export const APP_NAME = process.env.APP_NAME || "PC Market";
export const APP_DESCRIPTION =
  process.env.APP_DESCRIPTION || "high end pc parts platform built with nextjs";
export const APP_URL = process.env.APP_URL || "http://localhost:3000";
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 12;

export const checkoutSteps = [
  "Login",
  "Shipping Address",
  "Payment Method",
  "Place Order",
];

// For testing purposes
export const defaultCredentials = {
  // dummy data
  name: "fake",
  email: "fake@gmail.com",
  password: "!!22QQww",
};
export const defaultShippingAddress = {
  fullName: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
};
export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD
  ? process.env.DEFAULT_PAYMENT_METHOD
  : "PayPal";
