import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import { ProductActions } from "./product-actions";
import { Sparkles, Glasses, Sun, Eye } from "lucide-react";
import type { Metadata } from "next";
import type { ProductWithVariants, Variant } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const db = createAdminClient();
  const { data: products } = await db
    .from("products")
    .select("*, variants(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Products</h1>
        <ProductActions />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products?.map((product: ProductWithVariants) => {
          const totalStock =
            product.variants?.reduce(
              (s: number, v: Variant) => s + v.stock_quantity,
              0,
            ) || 0;
          const hasLowStock = product.variants?.some(
            (v: Variant) => v.stock_quantity > 0 && v.stock_quantity <= 5,
          );

          return (
            <div
              key={product.id}
              className={`card p-5 ${!product.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-4 mb-3">
                {product.image_urls && product.image_urls.length > 0 ? (
                  <Image
                    width={40}
                    height={40}
                    src={product.image_urls[0]}
                    alt={product.title}
                    className="h-16 w-16 object-cover rounded-lg bg-muted shrink-0 border border-border"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border text-muted-foreground">
                    {product.category === "sunglasses" ? (
                      <Sun className="h-6 w-6" />
                    ) : product.category === "contact_lenses" ? (
                      <Eye className="h-6 w-6" />
                    ) : (
                      <Glasses className="h-6 w-6" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                        {product.title}
                        {product.is_premium && (
                          <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {product.category.replace("_", " ")}
                      </p>
                    </div>
                    {!product.is_active && (
                      <span className="badge badge-muted shrink-0">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-bold">
                  {formatPrice(product.discount_price ?? product.base_price)}
                </span>
                {product.discount_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.base_price)}
                  </span>
                )}
              </div>

              {/* Variants */}
              <div className="space-y-1 mb-3">
                {product.variants?.map((v: Variant) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {v.color} ({v.sku})
                    </span>
                    <span
                      className={`font-medium ${
                        v.stock_quantity === 0
                          ? "text-destructive"
                          : v.stock_quantity <= 5
                            ? "text-accent"
                            : "text-foreground"
                      }`}
                    >
                      {v.stock_quantity} in stock
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`badge ${totalStock === 0 ? "badge-destructive" : hasLowStock ? "badge" : "badge-success"}`}
                  >
                    {totalStock === 0
                      ? "Out of stock"
                      : hasLowStock
                        ? "Low stock"
                        : `${totalStock} total`}
                  </span>
                  {product.return_eligible && (
                    <span className="badge badge-muted">Returnable</span>
                  )}
                </div>
                <Link
                  href={`/admin/products/add?id=${product.id}`}
                  className="btn-ghost px-3 py-1.5 min-h-8 text-xs font-semibold shrink-0"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-10 text-muted-foreground">
          No products yet. Add your first product or import via CSV.
        </div>
      )}
    </div>
  );
}
