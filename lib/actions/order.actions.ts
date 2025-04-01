"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, toPlainObject } from "../utils";
import { auth } from "@/auth";
import { getCart } from "./cart.actions";
import { getUser } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

export async function placeOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("Session not found");
    const cart = await getCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");
    const user = await getUser(userId);

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "Cart is empty", redirectTo: "/cart" };
    }
    if (!user.address) {
      return {
        success: false,
        error: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        error: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const insertedOrder = await tx.order.create({ data: order });
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            orderId: insertedOrder.id,
            price: item.price,
          },
        });
      }
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });
      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error("Order not created");
    return {
      success: true,
      message: "Order is successfully created",
      orderId: insertedOrderId,
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, error: formatError(error) };
  }
}

export async function getOrder(orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: {
        select: { name: true, email: true },
      },
    },
  });
  return toPlainObject(order);
}

// Create paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });
    if (!order) throw new Error("Order not found");
    // If there is an order
    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          email_address: "",
          status: "",
          pricePaid: 0,
        },
      },
    });

    return {
      success: true,
      message: "Order created successfully",
      paypalOrderId: paypalOrder.id,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Approve paypal order
export async function approvePaypalOrder(
  // orderId for the order in the database
  // data.orderID for the paypal order
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order is already paid");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("PayPal payment failed!");
    }

    // Update order to paid
    await prisma.$transaction(async (tx) => {
      // Update stock
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
      // Update order to paid
      await tx.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            id: captureData.id,
            email_address: captureData.payer.email_address,
            status: captureData.status,
            pricePaid:
              captureData.purchase_units[0]?.payments?.captures[0]?.amount
                ?.value,
          },
        },
      });
    });
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Payment processed successfully. Your order is confirmed.",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
