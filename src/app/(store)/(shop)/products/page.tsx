import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";

export const metadata: Metadata = {
  title: "All Eyewear",
  description:
    "Browse our complete collection of premium eyeglasses, sunglasses, and contact lenses.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    premium?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = createAdminClient();

  let query = supabase.from("products").select("*").eq("is_active", true);

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.premium === "true") {
    query = query.eq("is_premium", true);
  }

  if (params.sort === "price_asc") {
    query = query.order("base_price", { ascending: true });
  } else if (params.sort === "price_desc") {
    query = query.order("base_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: products } = await query;
  const categoryLabels: Record<string, string> = {
    eyeglasses: "Eyeglasses",
    sunglasses: "Sunglasses",
    contact_lenses: "Contact Lenses",
  };

  const pageTitle =
    params.premium === "true"
      ? "Premium Collection"
      : params.category
        ? categoryLabels[params.category] || "All Eyewear"
        : "All Eyewear";

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {pageTitle}
              {params.premium === "true" && (
                <Sparkles className="inline h-6 w-6 text-accent ml-2" />
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {products?.length || 0} products
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            <Link
              href="/products"
              className={`badge ${!params.category && params.premium !== "true" ? "badge" : "badge-muted"}`}
            >
              All
            </Link>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <Link
                key={key}
                href={`/products?category=${key}`}
                className={`badge ${params.category === key ? "badge" : "badge-muted"}`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/products?premium=true"
              className={`badge ${params.premium === "true" ? "badge" : "badge-muted"}`}
            >
              ✨ Premium
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        {!products || products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon — we&apos;re adding new styles regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product, idx: number) => (
              <ProductCard
                key={product.id}
                product={product}
                inViewDelay={600}
                staggerDelay={idx * 80}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
