import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in INR
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Calculate shipping fee. Free above ₹2000.
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= 2000 ? 0 : 99;
}

/**
 * Generate a short order ID for display
 */
export function shortId(uuid: string | null | undefined): string {
  if (!uuid) return "N/A";
  return uuid.slice(0, 8).toUpperCase();
}
