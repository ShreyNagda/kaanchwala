import Link from "next/link";
import { ArrowLeft, Glasses } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <Glasses
              className="h-20 w-20 text-muted-foreground/30"
              strokeWidth={1}
            />
            {/* Crack / X overlay */}
            <span className="absolute -top-1 -right-1 text-2xl font-light text-muted-foreground select-none">
              ×
            </span>
          </div>
        </div>

        {/* 404 */}
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-3">
            Error 404
          </p>
          <h1 className="text-4xl sm:text-5xl font-light text-foreground tracking-tight leading-tight">
            Page not found
          </h1>
          <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
            The frame you&apos;re looking for seems to have been discontinued.
            Let&apos;s get you back to the collection.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            Kaanchwala
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="btn-outline w-full sm:w-auto"
            id="not-found-browse-collection"
          >
            Browse Collection
          </Link>
        </div>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {[
            { label: "Eyeglasses", href: "/products?category=eyeglasses" },
            { label: "Sunglasses", href: "/products?category=sunglasses" },
            { label: "My Account", href: "/account" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
