"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import {
  LENS_ADD_ONS,
  type Product,
  type Variant,
  type LensAddOn,
} from "@/lib/types";
import {
  ShoppingBag,
  Check,
  Sparkles,
  ArrowLeft,
  Truck,
  Shield,
  Glasses,
  Sun,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";

interface ProductDetailProps {
  product: Product;
  variants: Variant[];
}

export function ProductDetail({ product, variants }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants[0] || null,
  );
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedVariant?.image_url || product.image_urls?.[0] || "",
  );
  const [selectedAddOns, setSelectedAddOns] = useState<LensAddOn[]>([]);
  const [quantity, setQuantity] = useState(1);

  const effectivePrice = product.discount_price ?? product.base_price;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (effectivePrice + addOnsTotal) * quantity;
  const savingsPercent = product.discount_price
    ? Math.round(
        ((product.base_price - product.discount_price) / product.base_price) *
          100,
      )
    : 0;

  const toggleAddOn = (addOn: LensAddOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn],
    );
  };

  const handleAddToCart = () => {
    addItem(product, selectedVariant, selectedAddOns, quantity);
    toast.success(`${product.title} added to cart!`);
  };

  const showLensAddOns = product.category === "eyeglasses";

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Eyewear
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-muted overflow-hidden">
            {selectedImage ? (
              <Image
                width={1000}
                height={1000}
                src={selectedImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                {product.category === "sunglasses" ? (
                  <Sun className="h-24 w-24" />
                ) : product.category === "contact_lenses" ? (
                  <Eye className="h-24 w-24" />
                ) : (
                  <Glasses className="h-24 w-24" />
                )}
              </div>
            )}
            {product.is_premium && (
              <div className="absolute top-4 left-4 badge badge gap-1 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Premium
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.image_urls && product.image_urls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.image_urls.map((url, idx) => (
                <button
                  key={idx}
                  className={`h-20 w-20 rounded-lg bg-muted overflow-hidden border-2 transition-colors shrink-0 cursor-pointer ${url === selectedImage ? "border-accent" : "border-transparent hover:border-accent"}`}
                  onClick={() => setSelectedImage(url)}
                >
                  <Image
                    width={100}
                    height={100}
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-accent font-medium uppercase tracking-wider mb-1">
              {product.category.replace("_", " ")}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {product.title}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(effectivePrice)}
            </span>
            {product.discount_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.base_price)}
                </span>
                <span className="badge badge-destructive">
                  {savingsPercent}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Color Variants */}
          {variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Color:{" "}
                <span className="text-accent">{selectedVariant?.color}</span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={!variant.is_in_stock}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-accent bg-accent/10 text-accent"
                        : variant.is_in_stock
                          ? "border-border hover:border-accent/50 text-foreground"
                          : "border-border text-muted-foreground opacity-50 cursor-not-allowed line-through"
                    }`}
                  >
                    {variant.color}
                    {!variant.is_in_stock && " (Sold out)"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lens Add-Ons (only for eyeglasses) */}
          {showLensAddOns && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Lens Add-Ons
                </h3>
                <Link
                  href="/lenses"
                  className="text-xs text-accent hover:underline underline-offset-2 transition-colors"
                >
                  Learn about lens options →
                </Link>
              </div>
              <div className="space-y-2">
                {LENS_ADD_ONS.map((addOn) => {
                  const isSelected = selectedAddOns.find(
                    (a) => a.name === addOn.name,
                  );
                  return (
                    <button
                      key={addOn.name}
                      onClick={() => toggleAddOn(addOn)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-accent bg-accent"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {addOn.name}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        + {formatPrice(addOn.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Quantity
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-lg"
              >
                −
              </button>
              <span className="w-12 text-center font-semibold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Total & Add to Cart */}
          <div className="pt-4 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={variants.length > 0 && !selectedVariant?.is_in_stock}
              className="btn-accent w-full gap-2 text-base py-3.5"
              id="add-to-cart-button"
            >
              <ShoppingBag className="h-5 w-5" />
              {variants.length > 0 && !selectedVariant?.is_in_stock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                {totalPrice >= 2000 ? "Free Shipping" : "Ships in 2-4 days"}
              </div>
              {product.return_eligible && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  Easy Returns
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
