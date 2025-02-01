import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object to a JS object
export function toPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
