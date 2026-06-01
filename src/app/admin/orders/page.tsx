import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice, shortId } from "@/lib/utils";
import { format } from "date-fns";
import { OrderActions } from "./order-actions";
import type { Metadata } from "next";
import Link from "next/link";
import { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage() {
  const db = createAdminClient();
  const { data: orders } = await db
    .from("orders")
    .select("*, prescriptions(id)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Orders</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Order
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Prescription
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Payment
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(orders as Order[])?.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border/50 hover:bg-muted/20"
                >
                  <td className="py-3 px-4 font-mono text-xs font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-accent hover:underline"
                    >
                      {shortId(order.id)}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{order.customer_email}</td>
                  <td className="py-3 px-4">
                    {order.prescriptions && order.prescriptions.length > 0 ? (
                      <Link
                        href={`/admin/prescriptions/${order.prescriptions[0].id}`}
                        className="text-xs text-accent hover:underline font-medium"
                      >
                        View Rx
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge badge-muted">
                      {order.payment_method === "cod" ? "COD" : "Online"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`badge ${
                        order.status === "delivered"
                          ? "badge-success"
                          : order.status === "cancelled"
                            ? "badge-destructive"
                            : "badge"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs">
                    {format(new Date(order.created_at), "dd MMM yy")}
                  </td>
                  <td className="py-3 px-4">
                    <OrderActions order={order} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!orders || orders.length === 0) && (
          <div className="text-center py-10 text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}
