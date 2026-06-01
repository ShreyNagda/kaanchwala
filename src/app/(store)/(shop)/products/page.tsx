import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import type { Metadata } from "next";
import { Sparkles, SlidersHorizontal, Glasses, Sun, Eye } from "lucide-react";
import Image from "next/image";

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
  console.log(products);
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
            {products.map((product: Product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="card group overflow-hidden"
                id={`product-${product.id}`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {product.image_urls && product.image_urls.length > 0 ? (
                    <>
                      {/* First Image */}
                      <Image
                        src={product.image_urls[0]}
                        alt={product.title}
                        width={300}
                        height={300}
                        sizes="(max-w-7xl) 25vw, 300px"
                        className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                          product.image_urls.length >= 2
                            ? "absolute inset-0 opacity-100 group-hover:opacity-0 group-hover:scale-105"
                            : "group-hover:scale-105"
                        }`}
                      />
                      {/* Second Image (Hover Swap) */}
                      {product.image_urls.length >= 2 && (
                        <Image
                          src={product.image_urls[1]}
                          alt={`${product.title} alternate view`}
                          width={300}
                          height={300}
                          sizes="(max-w-7xl) 25vw, 300px"
                          className="h-full w-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      )}
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      {product.category === "sunglasses" ? (
                        <Sun className="h-12 w-12" />
                      ) : product.category === "contact_lenses" ? (
                        <Eye className="h-12 w-12" />
                      ) : (
                        <Glasses className="h-12 w-12" />
                      )}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.is_premium && (
                      <span className="badge badge gap-1">
                        <Sparkles className="h-3 w-3" /> Premium
                      </span>
                    )}
                    {product.discount_price && (
                      <span className="badge badge-destructive">
                        {Math.round(
                          ((product.base_price - product.discount_price) /
                            product.base_price) *
                            100,
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {categoryLabels[product.category]}
                  </p>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(
                        product.discount_price ?? product.base_price,
                      )}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.base_price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
