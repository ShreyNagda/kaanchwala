"use client";

import Link from "next/link";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import Image from "next/image";

export function Header() {
  const { openCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-foreground text-background text-center py-2 px-4 text-[10px] font-semibold tracking-[0.15em] uppercase">
        Free shipping on orders above ₹2,000 | 5% off on account creation
      </div>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group py-2">
              <div className="h-10 w-10 rounded-full group-hover:bg-transparent bg-primary flex items-center justify-center transition-colors">
                <Image
                  src="/logo2.webp"
                  alt="Kaanchwala Logo"
                  width={25}
                  height={25}
                  className="group-hover:scale-120 transition-transform duration-300"
                />
              </div>
              <span className="text-xl sm:text-2xl font-light tracking-[0.15em] font-display text-foreground group-hover:text-accent transition-colors">
                KAANCHWALA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                All Eyewear
              </Link>
              <Link
                href="/products?category=eyeglasses"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Eyeglasses
              </Link>
              <Link
                href="/products?category=sunglasses"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sunglasses
              </Link>
              <Link
                href="/products?category=contact_lenses"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Lenses
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={openCart}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Shopping cart"
                id="cart-button"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground animate-fade-in">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t border-border py-4 animate-fade-in">
              <div className="flex flex-col gap-3">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  All Eyewear
                </Link>
                <Link
                  href="/products?category=eyeglasses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  Eyeglasses
                </Link>
                <Link
                  href="/products?category=sunglasses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  Sunglasses
                </Link>
                <Link
                  href="/products?category=contact_lenses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  Contact Lenses
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                >
                  My Account
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
