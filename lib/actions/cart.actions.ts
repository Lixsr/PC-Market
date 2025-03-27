"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { formatError, to2Decimals, toPlainObject } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Price calculation
function calculatePrice(items: CartItem[]) {
  const itemsPrice = to2Decimals(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );
  // convert to 2 decimal places. 10 => 10.00
  const shippingPrice = to2Decimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = to2Decimals(0.15 * itemsPrice);
  const totalPrice = to2Decimals(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}
export const addToCart = async (item: CartItem) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    // handle missing sessionCartId
    if (!sessionCartId) {
      throw new Error("Session Cart Id not found");
    }
    // Get the user id from the session
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get user cart
    const cart = await getCart();
    const requestedItem = cartItemSchema.parse(item);

    // Fetch the item from the DB
    const product = await prisma.product.findFirst({
      where: { id: requestedItem.productId },
    });
    if (!product) throw new Error("Product not found");
    // if no cart found, create a new cart
    if (!cart) {
      // Create a new cart
      const newCart = insertCartSchema.parse({
        userId,
        sessionCartId,
        items: [requestedItem],
        ...calculatePrice([requestedItem]),
      });
      // Save the cart to the DB
      await prisma.cart.create({ data: newCart });
      // Revalidate, to ensure users see the latest content
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    } else {
      // Handle the quantity
      const existingItem = (cart.items as CartItem[]).find(
        (i) => i.productId === requestedItem.productId
      );

      if (existingItem) {
        if (product.stock < existingItem.quantity + 1) {
          throw new Error("Out of stock");
        }
        (cart.items as CartItem[]).find(
          (i) => i.productId === requestedItem.productId
        )!.quantity = existingItem.quantity + 1;
      } else {
        if (product.stock < 0) {
          throw new Error("Out of stock");
        }
        cart.items.push(requestedItem);
      }
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calculatePrice(cart.items as CartItem[]),
        },
      });
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existingItem ? "updated in" : "added to"
        } cart`,
      };
    }
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
};
export async function getCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  // handle missing sessionCartId
  if (!sessionCartId) {
    throw new Error("Session Cart Id not found");
  }
  // Get the user id from the session
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  // Get user cart from DB by id or sessionCartId
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });
  if (!cart) return undefined;
  return toPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
  });
}
export const removeItemFromCart = async (productId: string) => {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    // handle missing sessionCartId
    if (!sessionCartId) {
      throw new Error("Session Cart Id not found");
    }
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product not found");

    const cart = await getCart();
    if (!cart) throw new Error("Cart not found");

    const existingItem = (cart.items as CartItem[]).find(
      (i) => i.productId === productId
    );
    if (!existingItem) throw new Error("Item not found in cart");

    if (existingItem.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (i) => i.productId !== productId
      );
    } else {
      (cart.items as CartItem[]).find(
        (i) => i.productId === productId
      )!.quantity = existingItem.quantity - 1;
    }

    // Update the cart
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calculatePrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return { success: true, message: `${product.name} removed from cart` };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
};
