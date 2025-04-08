import { z } from "zod";
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  shippingAddressSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  updateProfileSchema,
  updateUserSchema,
  insertReviewSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  // Add types for the extra fields
  id: string;
  rating: string;
  createdAt: Date;
};
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  userId: string;
  orderItems: OrderItem[];
  user: { name: string; email: string };
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  createdAt: Date;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
