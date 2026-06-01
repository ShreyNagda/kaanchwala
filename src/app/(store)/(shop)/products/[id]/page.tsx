import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "./product-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("title, description")
    .eq("id", id)
    .single();

  return {
    title: product?.title || "Product",
    description: product?.description || "Premium eyewear from Kaanchwala",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const { data: variants } = await supabase
    .from("variants")
    .select("*")
    .eq("product_id", id)
    .order("color");

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ProductDetail product={product} variants={variants || []} />
      </div>
    </div>
  );
}
