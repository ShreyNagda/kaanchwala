import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { formatPrice, shortId } from "@/lib/utils";
import { format } from "date-fns";
import { signOut } from "@/lib/actions/auth";
import { Package, LogOut } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { PrescriptionManager } from "@/components/account/PrescriptionManager";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminDb = createAdminClient();

  const { data: orders } = await adminDb
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: prescriptions } = await adminDb
    .from("prescriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Account</h1>
            <p className="text-muted-foreground mt-1">{user.email}</p>
          </div>
          <form action={signOut}>
            <button type="submit" className="btn-outline gap-2 text-sm">
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Prescription Section */}
        <PrescriptionManager initialPrescriptions={prescriptions || []} />

        {/* Orders */}
        <div className="card-static p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-accent" />
            Order History
          </h2>

          {!orders || orders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No orders yet</p>
              <Link href="/products" className="btn-accent mt-4 inline-flex">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/order/${order.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">
                      Order #{shortId(order.id)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(order.created_at), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`text-xs font-medium ${
                        order.status === "delivered"
                          ? "text-success"
                          : order.status === "shipped"
                            ? "text-accent"
                            : order.status === "cancelled"
                              ? "text-destructive"
                              : "text-muted-foreground"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
