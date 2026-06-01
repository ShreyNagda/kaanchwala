import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { DiscountActions } from "./discount-actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Discounts" };

export default async function AdminDiscountsPage() {
 const db = createAdminClient();
 const { data: discounts } = await db
 .from("discounts")
 .select("*")
 .order("created_at", { ascending: false });

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <h1 className="text-2xl font-bold text-foreground">
 Discounts
 </h1>
 <DiscountActions />
 </div>

 <div className="card overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead>
 <tr className="border-b border-border bg-muted/30">
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Code
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Type
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Value
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Min Order
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Usage
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Valid Until
 </th>
 <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
 Status
 </th>
 </tr>
 </thead>
 <tbody>
 {discounts?.map((d) => {
 const isExpired = new Date(d.valid_to) < new Date();
 const isActive = d.is_active && !isExpired;

 return (
 <tr
 key={d.id}
 className="border-b border-border/50 hover:bg-muted/20"
 >
 <td className="py-3 px-4 font-mono font-bold text-accent">
 {d.code}
 </td>
 <td className="py-3 px-4 capitalize">{d.type}</td>
 <td className="py-3 px-4 font-medium">
 {d.type === "percentage"
 ? `${d.value}%`
 : formatPrice(d.value)}
 </td>
 <td className="py-3 px-4 text-muted-foreground">
 {d.min_order_amount > 0
 ? formatPrice(d.min_order_amount)
 : "—"}
 </td>
 <td className="py-3 px-4">
 {d.usage_count}
 {d.usage_limit ? `/${d.usage_limit}` : ""}
 </td>
 <td className="py-3 px-4 text-xs text-muted-foreground">
 {format(new Date(d.valid_to), "dd MMM yyyy")}
 </td>
 <td className="py-3 px-4">
 <span
 className={`badge ${isActive ? "badge-success" : "badge-muted"}`}
 >
 {isActive
 ? "Active"
 : isExpired
 ? "Expired"
 : "Inactive"}
 </span>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 {(!discounts || discounts.length === 0) && (
 <div className="text-center py-10 text-muted-foreground">
 No discount codes yet
 </div>
 )}
 </div>
 </div>
 );
}
