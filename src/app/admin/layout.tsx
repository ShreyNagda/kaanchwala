"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  Tag,
  LogOut,
  Megaphone,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    href: "/admin/prescriptions",
    label: "Prescriptions",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    href: "/admin/discounts",
    label: "Discounts",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    href: "/admin/promotions",
    label: "Promotions",
    icon: <Megaphone className="h-5 w-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-surface p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <Image
              src="/logo2.webp"
              alt="Kaanchwala Logo"
              width={25}
              height={25}
            />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface px-2 py-2">
        <nav className="flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                  isActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label.slice(0, 6)}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs text-destructive transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 sm:p-8 pb-24 md:pb-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
