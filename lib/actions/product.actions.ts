"use server";
import { prisma } from "@/db/prisma";
import { toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get Latest Products
export const getLatestProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: "desc" },
  });
  return toPlainObject(products);
};
// Get Product
export const getProduct = async (slug: string) => {
  return await prisma.product.findFirst({
    where: { slug },
  });
};
