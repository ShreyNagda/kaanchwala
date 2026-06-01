import { createAdminClient } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { PrescriptionActions } from "./prescription-actions";
import type { Metadata } from "next";
import Link from "next/link";
import { Prescription, Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Admin — Prescriptions" };

export default async function AdminPrescriptionsPage() {
  const db = createAdminClient();
  const { data: prescriptions } = await db
    .from("prescriptions")
    .select("*, order:orders(customer_email, id)")
    .order("created_at", { ascending: false })
    .limit(50);

  // Fetch profiles and emails in-memory to bypass Postgrest RLS/relationship limitations
  const userIds = Array.from(
    new Set(
      prescriptions
        ?.map((rx: Prescription) => rx.user_id)
        .filter(Boolean) as string[],
    ),
  );

  const profileMap = new Map<string, Profile>();
  const emailMap = new Map<string, string>();

  if (userIds.length > 0) {
    // 1. Fetch profiles
    const { data: profiles } = await db
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds);

    profiles?.forEach((p) => {
      profileMap.set(p.id, p as Profile);
    });

    // 2. Fetch auth emails in parallel
    const emailPromises = userIds.map(async (uid) => {
      try {
        const { data } = await db.auth.admin.getUserById(uid);
        if (data?.user?.email) {
          emailMap.set(uid, data.user.email);
        }
      } catch (err) {
        console.error(`Error fetching user ${uid}:`, err);
      }
    });
    await Promise.all(emailPromises);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Prescriptions</h1>

      <div className="space-y-4">
        {prescriptions?.map((rx: Prescription) => {
          const profile = rx.user_id ? profileMap.get(rx.user_id) : null;
          const userEmail = rx.user_id ? emailMap.get(rx.user_id) : null;
          const customerEmail = userEmail || rx.order?.customer_email || null;

          const displayName =
            profile?.full_name || customerEmail || "Guest Client";

          return (
            <div key={rx.id} className="card p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Link
                    href={`/admin/prescriptions/${rx.id}`}
                    className="font-semibold text-sm hover:text-accent transition-colors block"
                  >
                    {displayName}
                  </Link>
                  {profile?.full_name && customerEmail && (
                    <p className="text-xs text-muted-foreground">
                      {customerEmail}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(rx.created_at), "dd MMM yyyy, hh:mm a")}
                  </p>
                </div>
                <span
                  className={`badge ${
                    rx.status === "approved"
                      ? "badge-success"
                      : rx.status === "rejected"
                        ? "badge-destructive"
                        : "badge"
                  }`}
                >
                  {rx.status}
                </span>
              </div>

              <div className="mb-4">
                <Link
                  href={`/admin/prescriptions/${rx.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  View Prescription Details →
                </Link>
              </div>

              {rx.notes && (
                <p className="text-xs text-muted-foreground mb-3 italic">
                  Note: {rx.notes}
                </p>
              )}

              {rx.status === "pending" && (
                <PrescriptionActions prescriptionId={rx.id} />
              )}
            </div>
          );
        })}
      </div>

      {(!prescriptions || prescriptions.length === 0) && (
        <div className="text-center py-10 text-muted-foreground">
          No prescriptions submitted yet
        </div>
      )}
    </div>
  );
}
