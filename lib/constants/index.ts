export const APP_NAME = process.env.APP_NAME || "PC Market";
export const APP_DESCRIPTION =
  process.env.APP_DESCRIPTION || "high end pc parts platform built with nextjs";
export const APP_URL = process.env.APP_URL || "http://localhost:3000";
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 12;

// For testing purposes
export const defaultCredentials = {
  name: "",
  email: "",
  password: "",
};
export const defaultShippingAddress = {
  fullName: "Osamah Alnahari",
  street: "123 King Fahd Road",
  city: "Riyadh",
  postalCode: "12345",
  country: "Saudi Arabia",
};
