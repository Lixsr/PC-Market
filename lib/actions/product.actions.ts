"use server";
import { prisma } from "@/db/prisma";
import { formatError, toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";

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
  console.log(query, category);
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalProducts = await prisma.product.count();

  return { products, totalPages: Math.ceil(totalProducts / limit) };
}

// Delete Product
export const deleteProduct = async (productId: string) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) return { success: false, message: "Product not found" };
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted successfully" };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
};
