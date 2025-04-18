import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

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
    .max(250, "description must be at most 250 characters")
    .nullable(),
  images: z.array(z.string()).min(1, "Please upload at least one image"),
  isFeatured: z.boolean(),
  // nullable is used to allow null values
  banner: z.string().nullable(),
  price: currency,
});

// Update product schema
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product id is required"),
});

// Define a cartItem schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  quantity: z.number().int().positive("Quantity Must be positive"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});
// Define a cart schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  // allow user to add items to cart without being logged in
  userId: z.string().optional().nullable(),
});

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  street: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Payment Method Schema
export const paymentMethodSchema = z
  .object({
    paymentMethod: z.string().min(2, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.paymentMethod), {
    message: "Invalid payment method",
  });

export const insertOrderSchema = z.object({
  userId: z.string().min(2, "User id is required"),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  quantity: z.number().int().positive("Quantity must be positive"),
  image: z.string(),
  price: currency,
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(2, "Email must be at least 2 characters"),
});
// Update User schema
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "User id is required"),
  role: z.string().min(1, "Role is required"),
});

// Review schema
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  productId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
