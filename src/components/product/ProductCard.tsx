"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Sun, Eye, Glasses } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  /** Delay (ms) before the image swap triggers after entering viewport. Default 800ms. */
  inViewDelay?: number;
  /** Duration (ms) of the crossfade. Default 700ms. */
  swapDuration?: number;
  /** Additional index-based stagger offset (ms) */
  staggerDelay?: number;
}

const categoryLabels: Record<string, string> = {
  eyeglasses: "Eyeglasses",
  sunglasses: "Sunglasses",
  contact_lenses: "Contact Lenses",
};

export function ProductCard({
  product,
  inViewDelay = 800,
  swapDuration = 700,
  staggerDelay = 0,
}: ProductCardProps) {
  const containerRef = useRef<HTMLAnchorElement>(null);
  // true = showing second image
  const [swapped, setSwapped] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSecondImage = (product.image_urls?.length ?? 0) >= 2;
  const hasImages = (product.image_urls?.length ?? 0) > 0;

  useEffect(() => {
    if (!hasSecondImage) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Card entered view — swap to second image after delay
          timerRef.current = setTimeout(() => {
            setSwapped(true);
          }, inViewDelay + staggerDelay);
        } else {
          // Card left view — cancel any pending swap and reset to first image
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          setSwapped(false);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasSecondImage, inViewDelay, staggerDelay]);

  return (
    <Link
      ref={containerRef}
      href={`/products/${product.id}`}
      className="card group overflow-hidden"
      id={`product-${product.id}`}
    >
      {/* ── Image area ── */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {hasImages ? (
          <>
            {/* First image */}
            <Image
              src={product.image_urls[0]}
              alt={product.title}
              width={300}
              height={300}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={[
                "h-full w-full object-cover absolute inset-0",
                // Desktop hover swap
                hasSecondImage
                  ? "group-hover:opacity-0 group-hover:scale-105"
                  : "group-hover:scale-105",
                // Mobile in-view swap
                hasSecondImage && swapped
                  ? "opacity-0 scale-105"
                  : "opacity-100",
                `transition-all ease-out`,
              ].join(" ")}
              style={{ transitionDuration: `${swapDuration}ms` }}
            />

            {/* Second image */}
            {hasSecondImage && (
              <Image
                src={product.image_urls[1]}
                alt={`${product.title} alternate view`}
                width={300}
                height={300}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={[
                  "h-full w-full object-cover absolute inset-0",
                  // Desktop hover swap
                  "group-hover:opacity-100 group-hover:scale-105",
                  // Mobile in-view swap
                  swapped ? "opacity-100 scale-105" : "opacity-0",
                  "transition-all ease-out",
                ].join(" ")}
                style={{ transitionDuration: `${swapDuration}ms` }}
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
            <span className="badge gap-1">
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

      {/* ── Info ── */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {categoryLabels[product.category] ??
            product.category.replace("_", " ")}
        </p>
        <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1 text-sm">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-bold text-foreground">
            {formatPrice(product.discount_price ?? product.base_price)}
          </span>
          {product.discount_price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.base_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
