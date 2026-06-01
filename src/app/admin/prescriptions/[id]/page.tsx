import { createAdminClient } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";
import { PrescriptionActions } from "../prescription-actions";
import { PrescriptionDataEditor } from "../PrescriptionDataEditor";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Admin — Prescription Details" };

interface PrescriptionDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PrescriptionDetailsPage({
  params,
}: PrescriptionDetailsPageProps) {
  const { id } = await params;
  const db = createAdminClient();

  // Fetch prescription with order details (separated profiles fetch to prevent PGRST200 join issues)
  const { data: rx } = await db
    .from("prescriptions")
    .select("*, order:orders(customer_email, id, total, status)")
    .eq("id", id)
    .single();

  if (!rx) {
    notFound();
  }

  // Fetch profile separately
  let profile = null;
  if (rx.user_id) {
    const { data: profileData } = await db
      .from("profiles")
      .select("full_name, phone")
      .eq("id", rx.user_id)
      .single();
    profile = profileData;
  }

  // Fetch user email separately
  let userEmail = rx.order?.customer_email || null;
  if (rx.user_id) {
    try {
      const { data: authData } = await db.auth.admin.getUserById(rx.user_id);
      if (authData?.user?.email) {
        userEmail = authData.user.email;
      }
    } catch (err) {
      console.error("Error fetching email:", err);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header / Back Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/prescriptions"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Prescription Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Review optical parameters and verify DPDP Act consent
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Prescription Values and Document */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Preview Card if prescription_url exists */}
          {rx.prescription_url && (
            <div className="card p-6 space-y-4">
              <h2 className="text-base font-semibold flex items-center gap-2 border-b border-border pb-4">
                <FileText className="h-5 w-5 text-accent" />
                Uploaded Prescription Document
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Uploaded Document</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Uploaded on{" "}
                      {format(new Date(rx.created_at), "dd MMM yyyy")}
                    </p>
                  </div>
                  <a
                    href={rx.prescription_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-accent px-4 py-2 text-xs font-semibold"
                  >
                    Open Document in New Tab
                  </a>
                </div>
                {/* Inline Preview */}
                <div className="border border-border rounded-xl overflow-hidden bg-muted/10 p-4 flex justify-center">
                  {rx.prescription_url.toLowerCase().endsWith(".pdf") ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-55" />
                      PDF file preview is not supported inline. Please open the
                      file using the button above.
                    </div>
                  ) : (
                    <Image
                      width={50}
                      height={50}
                      src={rx.prescription_url}
                      alt="Prescription Image"
                      className="max-h-125 w-auto object-contain rounded-lg border border-border bg-surface"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Values Card */}
          <div className="card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Optical Configuration
              </h2>
              <span
                className={`badge text-[10px] uppercase font-semibold ${
                  rx.status === "approved"
                    ? "badge-success"
                    : rx.status === "rejected"
                      ? "badge-destructive"
                      : "badge-muted bg-muted text-muted-foreground"
                }`}
              >
                {rx.status}
              </span>
            </div>

            <PrescriptionDataEditor prescription={rx} />

            {/* PD & Notes Grid (Handled inside PrescriptionDataEditor, but keep consent info here) */}
            <div className="p-4 bg-muted/20 border border-border rounded-xl">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Consent Status
              </span>
              <span className="text-sm font-semibold flex items-center gap-1.5 text-success">
                <ShieldAlert className="h-4 w-4 text-accent" />
                DPDP Act Compliant Consent Granted
              </span>
            </div>

            {rx.status === "pending" && (
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <span className="text-xs text-muted-foreground">
                  Verification Actions:
                </span>
                <PrescriptionActions prescriptionId={rx.id} />
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Client & Order Meta Info */}
        <div className="space-y-6">
          {/* Client Details */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-accent" />
              Client Information
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Full Name
                </span>
                <span className="font-medium">
                  {profile?.full_name || "Guest Client"}
                </span>
              </div>
              {userEmail && (
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Email Address
                  </span>
                  <span className="font-medium font-mono text-xs">
                    {userEmail}
                  </span>
                </div>
              )}
              {profile?.phone && (
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Phone
                  </span>
                  <span className="font-medium">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Linked Order */}
          {rx.order && (
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-accent" />
                Linked Order
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Linked Order
                  </span>
                  <Link
                    href={`/admin/orders`}
                    className="font-medium text-xs text-accent hover:underline animate-pulse"
                  >
                    View in Orders list
                  </Link>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Order Total
                  </span>
                  <span className="font-semibold text-foreground">
                    {rx.order.total ? `₹${rx.order.total}` : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Fulfillment Status
                  </span>
                  <span className="badge font-medium uppercase text-[10px]">
                    {rx.order.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-accent" />
              Prescription Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Submitted On
                </span>
                <span className="font-medium">
                  {format(new Date(rx.created_at), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  Last Updated
                </span>
                <span className="font-medium">
                  {format(new Date(rx.updated_at), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
