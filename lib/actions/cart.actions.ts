"use server";

import { cookies } from "next/headers";
import { CartItem } from "@/types";
import { formatError, toPlainObject } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";

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
    // temporary log
    console.log({
      sessionCartId: sessionCartId,
      userId: userId,
      item: requestedItem,
      product: product,
    });
    return { success: true, message: "Item added to cart" };
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
