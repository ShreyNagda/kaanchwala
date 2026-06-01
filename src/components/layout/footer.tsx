import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
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
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs font-light">
              Bhiwandi&apos;s elite optical house curation of custom
              prescription eyewear and international designer sunglasses. Est.
              2026.
            </p>
          </div>

          {/* Shop Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Shop Collections
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products?category=eyeglasses"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors font-light"
                >
                  Eyeglasses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=sunglasses"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors font-light"
                >
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=contact_lenses"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors font-light"
                >
                  Contact Lenses
                </Link>
              </li>
              <li>
                <Link
                  href="/products?premium=true"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors font-light"
                >
                  Premium Range
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Client Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/account"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors font-light"
                >
                  My Account
                </Link>
              </li>
              <li>
                <span className="text-xs text-muted-foreground font-light">
                  Track Your Order
                </span>
              </li>
              <li>
                <span className="text-xs text-muted-foreground font-light">
                  Returns &amp; Exchange Policies
                </span>
              </li>
              <li>
                <span className="text-xs text-muted-foreground font-light">
                  Prescription Consultation
                </span>
              </li>
            </ul>
          </div>

          {/* Contact and Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">
              Contacts
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-xs text-muted-foreground font-light">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>support@kaanchwala.in</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-muted-foreground font-light">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-muted-foreground font-light">
                <MapPin className="h-4 w-4 text-accent shrink-0" />
                <span>Gopal Nagar, Bhiwandi, Maharashtra</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground font-light">
            © {new Date().getFullYear()} Kaanchwala. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-muted-foreground">
            <span className="font-light">
              Free shipping on orders above ₹2,000
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-light">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              DPDP Compliant &amp; Secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
