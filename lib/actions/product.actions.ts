"use server";
import { prisma } from "@/db/prisma";
import { formatError, toPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductSchema, updateProductSchema } from "../validators";

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
// Get Product
export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id },
  });
  if (!product) throw new Error("Product not found");
  return toPlainObject(product);
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
  console.log(category);
  const products = await prisma.product.findMany({
    where: { name: { contains: query, mode: "insensitive" } },
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

// Create Product
export const createProduct = async (
  data: z.infer<typeof insertProductSchema>
) => {
  try {
    // validate data
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: {
        ...product,
      },
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product created successfully", product };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
};
// Update Product
export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    // validate data
    const product = updateProductSchema.parse(data);
    const productFound = await prisma.product.findFirst({
      where: { id: product.id },
    });
    if (!productFound) return { success: false, message: "Product not found" };
    await prisma.product.update({
      where: { id: product.id },

      data: product,
    });
    revalidatePath("/admin/products");
    return { success: true, message: "Product updated successfully", product };
  } catch (e) {
    return { success: false, message: formatError(e) };
  }
};
