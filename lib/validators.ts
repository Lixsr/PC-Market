import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

// Currency format
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    {
      message: "Invalid price",
    }
  );

// Define a schema for inserting products
export const insertProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at lease 2 characters")
    .max(50, "Name must be at most 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at lease 3 characters")
    .max(50, "Slug must be at most 50 characters"),
  category: z
    .string()
    .min(2, "Category must be at lease 3 characters")
    .max(50, "Category must be at most 50 characters"),
  brand: z
    .string()
    .min(2, "Brand must be at lease 3 characters")
    .max(50, "Brand must be at most 50 characters"),
  // coerce is used to convert the value to a number
  stock: z.coerce.number(),
  description: z
    .string()
    .min(2, "description must be at lease 3 characters")
    .max(50, "description must be at most 250 characters"),
  images: z.array(z.string()).min(1, "Please upload at least one image"),
  isFeatured: z.boolean(),
  // nullable is used to allow null values
  banner: z.boolean().nullable(),
  price: currency,
});
