import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object to a JS object
export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}
// Error Format & disable eslint for any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(err: any) {
  if (err.name === "ZodError") {
    const errors = Object.keys(err.errors).map(
      (key) => err.errors[key].message
    );
    return errors.join(". ");
  } else if (
    err.name === "PrismaClientKnownRequestError" &&
    err.code === "P2002"
  ) {
    const field = err.meta?.target ? err.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof err.message === "string"
      ? err.message
      : JSON.stringify(err.message);
  }
}

// Format number
export function to2Decimals(num: number | string): number {
  if (typeof num === "string") {
    return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
  } else if (typeof num == "number") {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else throw new Error("Invalid input");
}

// Currency Formatter
export const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Format number
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");
export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

// Format Currency
export function formatCurrency(value: number | string | null): string {
  if (typeof value === "string") {
    return currency.format(Number(value));
  } else if (typeof value == "number") {
    return currency.format(value);
  } else return "NaN";
}

export function formatId(id: string): string {
  return `..${id.substring(id.length - 6)}  `;
}

// Format Date
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Pagination
export function createUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = qs.parse(params);
  query[key] = value;
  return qs.stringifyUrl(
    { url: window.location.pathname, query },
    { skipNull: true }
  );
}
