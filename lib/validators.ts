import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

// Decimal format
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    {
      message: "Invalid price",
    }
  );
// Define a schema for signing in
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 8 characters"),
});
// Define a schema for signing up
export const signUpSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(3, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
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
    .max(50, "description must be at most 250 characters")
    .nullable(),
  images: z
    .array(z.string())
    .min(1, "Please upload at least one image")
    .nullable(),
  isFeatured: z.boolean(),
  // nullable is used to allow null values
  banner: z.string().nullable(),
  price: currency,
});
