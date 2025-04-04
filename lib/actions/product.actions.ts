"use server";
import { prisma } from "@/db/prisma";
import { toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";

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

// Get All Products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalProducts = await prisma.product.count();

  return { products, totalPages: Math.ceil(totalProducts / limit) };
}
