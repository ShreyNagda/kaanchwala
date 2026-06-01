import { createAdminClient } from "@/lib/supabase/admin";
import { ProductEditorForm } from "./product-editor-form";
import type { ProductWithVariants } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Admin — Product Editor" };

export default async function ProductEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const id = params.id;
  
  let product: ProductWithVariants | null = null;
  
  if (id) {
    const db = createAdminClient();
    const { data } = await db
      .from("products")
      .select("*, variants(*)")
      .eq("id", id)
      .single();
      
    if (data) {
      product = data as ProductWithVariants;
    }
  }
  
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/products"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {product ? `Editing product details for "${product.title}"` : "Create a new optical product in the database"}
          </p>
        </div>
      </div>
      
      <div className="card p-6">
        <ProductEditorForm initialProduct={product} />
      </div>
    </div>
  );
}
