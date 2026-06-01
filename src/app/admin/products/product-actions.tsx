"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { bulkImportProducts } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Plus, Upload, Loader2, X } from "lucide-react";

export function ProductActions() {
  const [showImport, setShowImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const text = await file.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const products = lines
      .slice(1)
      .map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || "";
        });

        return {
          title: row.title || "",
          description: row.description || undefined,
          base_price: parseFloat(row.base_price || "0"),
          discount_price: row.discount_price
            ? parseFloat(row.discount_price)
            : null,
          category: (row.category || "eyeglasses") as
            | "eyeglasses"
            | "sunglasses"
            | "contact_lenses",
          is_premium: row.is_premium === "true",
          variants: row.variant_color
            ? [
                {
                  color: row.variant_color,
                  sku: row.variant_sku || `SKU-${Date.now()}`,
                  stock_quantity: parseInt(row.stock_quantity || "0", 10),
                },
              ]
            : undefined,
        };
      })
      .filter((p) => p.title);

    const result = await bulkImportProducts(products);
    toast.success(
      `Imported ${result.imported} products. ${result.errors.length} errors.`,
    );
    if (result.errors.length > 0) {
      result.errors.forEach((e) => toast.error(e));
    }

    setLoading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowImport(true)}
        className="btn-ghost gap-1.5 text-sm"
      >
        <Upload className="h-4 w-4" /> Import CSV
      </button>
      <Link href="/admin/products/add" className="btn-primary gap-1.5 text-sm">
        <Plus className="h-4 w-4" /> Add Product
      </Link>

      {/* Import Modal */}
      {showImport && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowImport(false)}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Import Products (CSV)</h2>
              <button
                onClick={() => setShowImport(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              CSV columns: title, description, base_price, discount_price,
              category, is_premium, variant_color, variant_sku, stock_quantity
            </p>

            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCSVImport}
              className="input-field"
            />

            {loading && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Importing...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
