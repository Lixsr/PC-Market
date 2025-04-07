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

export const defaultCredentials = {
  name: "",
  email: "",
  password: "",
};
export const defaultProduct = {
  name: "",
  slug: "",
  description: "",
  brand: "",
  category: "",
  images: [],
  stock: 0,
  price: "0",
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};
export const defaultShippingAddress = {
  fullName: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
};
export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["user", "admin"];

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal", "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD
  ? process.env.DEFAULT_PAYMENT_METHOD
  : "PayPal";
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const PRICES = [
  {
    name: "$1 to $100",
    value: "1-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
  {
    name: "More than $1000",
    value: "1001-10000",
  },
];
export const SORT_OPTIONS = ["Latest", "Lowest", "Highest", "Rating"];
