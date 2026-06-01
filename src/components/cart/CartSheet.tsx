"use client";

import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CartSheet() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
      />

      {/* Sheet */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background border-l border-border shadow-elevated animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <h2 className="font-semibold text-lg">Cart ({itemCount})</h2>
          </div>
          <button
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Add some eyewear to get started
              </p>
              <button onClick={closeCart} className="btn-accent mt-6">
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => {
                const price =
                  item.product.discount_price ?? item.product.base_price;
                const addOnsTotal = item.lensAddOns.reduce(
                  (a, b) => a + b.price,
                  0,
                );
                const itemTotal = (price + addOnsTotal) * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.variant?.id}-${index}`}
                    className="flex gap-4 p-3 rounded-xl bg-surface border border-border"
                  >
                    {/* Image placeholder */}
                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.image_urls?.[0] ? (
                        <Image
                          width={50}
                          height={50}
                          src={item.product.image_urls[0]}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">
                        {item.product.title}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Color: {item.variant.color}
                        </p>
                      )}
                      {item.lensAddOns.length > 0 && (
                        <p className="text-xs text-accent mt-0.5">
                          + {item.lensAddOns.map((a) => a.name).join(", ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="h-7 w-7 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="h-7 w-7 flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {formatPrice(itemTotal)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4 bg-surface">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>
            {subtotal < 2000 && (
              <p className="text-xs text-accent text-center">
                Add {formatPrice(2000 - subtotal)} more for free shipping!
              </p>
            )}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
