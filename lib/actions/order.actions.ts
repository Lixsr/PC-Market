"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError, toPlainObject } from "../utils";
import { auth } from "@/auth";
import { getCart } from "./cart.actions";
import { getUser } from "./user.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constants";

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

export async function getOrders({
  page,
  limit = PAGE_SIZE,
}: {
  page: number;
  limit?: number;
}) {
  const session = await auth();
  if (!session) throw new Error("User is not authorized");
  const orders = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalOrders = await prisma.order.count({
    where: { userId: session.user?.id },
  });
  const totalPages = Math.ceil(totalOrders / limit);
  return {
    orders: orders,
    totalPages,
  };
}

type Sales = {
  month: string;
  totalSales: number;
}[];

// Get order summary
export async function getOrderSummary() {
  const totalOrders = await prisma.order.count();
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();

  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const rawSales = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales"
    FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')
    `;
  const sales: Sales = rawSales.map((sale) => ({
    month: sale.month,
    totalSales: Number(sale.totalSales),
  }));

  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      user: { select: { name: true } },
    },
  });

  return {
    totalOrders,
    totalProducts,
    totalUsers,
    totalSales,
    sales,
    latestSales,
  };
}

// Get all orders
export async function getAllOrders({
  page,
  limit = PAGE_SIZE,
}: {
  page: number;
  limit?: number;
}) {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      user: { select: { name: true } },
    },
  });
  const totalOrders = await prisma.order.count();
  const totalPages = Math.ceil(totalOrders / limit);
  return {
    orders,
    totalPages,
  };
}

// Delete order
export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    revalidatePath(`/admin/orders`);
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update order to delivered
export async function updateOrderToDelivered(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");
    if (!order.isPaid) throw new Error("Order is not paid");
    if (order.isDelivered) throw new Error("Order is already delivered");

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "Order is marked as delivered" };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}

// Update order to paid for Cash on Delivery
export async function updateOrderToPaidCOD(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderItems: true },
    });
    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("Order is already paid");
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
        },
      });
    });
    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: "Order is marked as paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
