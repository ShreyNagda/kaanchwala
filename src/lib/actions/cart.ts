"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Validate that cart items are in stock before checkout
 */
export async function validateCartItems(
 items: Array<{
 productId: string;
 variantId: string | null;
 quantity: number;
 }>,
) {
 const supabase = await createClient();
 const errors: string[] = [];

 for (const item of items) {
 // Check product is active
 const { data: product } = await supabase
 .from("products")
 .select("title, is_active")
 .eq("id", item.productId)
 .single();

 if (!product || !product.is_active) {
 errors.push(`${product?.title || "A product"} is no longer available`);
 continue;
 }

 // Check variant stock
 if (item.variantId) {
 const { data: variant } = await supabase
 .from("variants")
 .select("color, stock_quantity, is_in_stock")
 .eq("id", item.variantId)
 .single();

 if (!variant || !variant.is_in_stock) {
 errors.push(`${product.title} (${variant?.color}) is out of stock`);
 } else if (variant.stock_quantity < item.quantity) {
 errors.push(
 `Only ${variant.stock_quantity} of ${product.title} (${variant.color}) available`,
 );
 }
 }
 }

 if (errors.length > 0) {
 return { valid: false, errors };
 }

 return { valid: true, errors: [] };
}
