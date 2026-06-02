// app/admin/orders/[id]/page.tsx
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice, shortId } from "@/lib/utils";
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
  Glasses,
  Sun,
  Eye,
  Truck,
  Tag,
  Package,
} from "lucide-react";
import { OrderActions } from "../order-actions";
import { PrescriptionActions } from "../../prescriptions/prescription-actions";
import { PrescriptionDataEditor } from "../../prescriptions/PrescriptionDataEditor";
import type { Metadata } from "next";
import type {
  OrderItem,
  Product,
  ShippingAddress,
  Prescription,
  OrderWithItems,
} from "@/lib/types";
import Image from "next/image";

export const metadata: Metadata = { title: "Admin — Order Details" };

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  const db = createAdminClient();

  // 1. Fetch order details with items, product info, and variant SKU
  const { data: order } = await db
    .from("orders")
    .select(
      "*, order_items(*, product:products(title, category, image_urls), variant:variants(color, sku))",
    )
    .eq("id", id)
    .single<OrderWithItems>();

  if (!order) {
    notFound();
  }

  // 2. Fetch associated prescription (if any)
  const { data: prescription } = await db
    .from("prescriptions")
    .select("*")
    .eq("order_id", id)
    .maybeSingle<Prescription>();

  // 3. Fetch client profile separately (if user_id exists)
  let profile = null;
  if (order.user_id) {
    const { data: profileData } = await db
      .from("profiles")
      .select("full_name, phone")
      .eq("id", order.user_id)
      .single();
    profile = profileData;
  }

  // 4. Fetch auth user email separately (as fallback)
  let userEmail = order.customer_email || null;
  if (order.user_id) {
    try {
      const { data: authData } = await db.auth.admin.getUserById(order.user_id);
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
          href="/admin/orders"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Order #{shortId(order.id)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Fulfill items and review user prescription parameters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Order Items and Prescription */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card p-6 space-y-4">
            <h2 className="text-base font-semibold border-b border-border pb-3 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              Order Items
            </h2>
            <div className="space-y-3">
              {order.order_items?.map(
                (
                  item: OrderItem & {
                    product?: Product;
                    variant?: { color: string; sku: string };
                  },
                ) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      {item.product?.category === "sunglasses" ? (
                        <Sun className="h-6 w-6" />
                      ) : item.product?.category === "contact_lenses" ? (
                        <Eye className="h-6 w-6" />
                      ) : (
                        <Glasses className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">
                        {item.product?.title || "Product"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.variant?.sku || "—"} • Color:{" "}
                        {item.variant?.color || "—"}
                      </p>
                      {item.lens_add_ons && item.lens_add_ons.length > 0 && (
                        <p className="text-[10px] text-accent mt-1 bg-accent/5 inline-block px-2 py-0.5 rounded border border-accent/10">
                          Lens Add-ons: {item.lens_add_ons.join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-sm">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span>
                  {order.shipping_fee === 0
                    ? "FREE"
                    : formatPrice(order.shipping_fee)}
                </span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-success">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    Discount ({order.discount_code})
                  </span>
                  <span>-{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Unified Prescription details card (if any) */}
          {prescription ? (
            <div className="space-y-6">
              {/* Image preview card if prescription has document */}
              {prescription.prescription_url && (
                <div className="card p-6 space-y-4">
                  <h2 className="text-base font-semibold flex items-center gap-2 border-b border-border pb-4">
                    <FileText className="h-5 w-5 text-accent" />
                    Uploaded Prescription Document
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 border border-border rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          Uploaded Document
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Uploaded on{" "}
                          {format(
                            new Date(prescription.created_at),
                            "dd MMM yyyy",
                          )}
                        </p>
                      </div>
                      <a
                        href={prescription.prescription_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-accent px-4 py-2 text-xs font-semibold"
                      >
                        Open Document in New Tab
                      </a>
                    </div>
                    {/* Inline Preview */}
                    <div className="border border-border rounded-xl overflow-hidden bg-muted/10 p-4 flex justify-center">
                      {prescription.prescription_url
                        .toLowerCase()
                        .endsWith(".pdf") ? (
                        <div className="py-12 text-center text-muted-foreground text-sm">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-55" />
                          PDF file preview is not supported inline. Please open
                          the file using the button above.
                        </div>
                      ) : (
                        <Image
                          width={100}
                          height={100}
                          src={prescription.prescription_url}
                          alt="Prescription Image"
                          className="max-h-100 w-auto object-contain rounded-lg border border-border bg-surface"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Optical Parameters Card */}
              <div className="card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Optical Configuration
                  </h2>
                  <span
                    className={`badge text-[10px] uppercase font-semibold ${
                      prescription.status === "approved"
                        ? "badge-success"
                        : prescription.status === "rejected"
                          ? "badge-destructive"
                          : "badge-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {prescription.status}
                  </span>
                </div>

                <PrescriptionDataEditor prescription={prescription} />

                {/* Consent & Notes details */}
                <div className="p-4 bg-muted/20 border border-border rounded-xl">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                    Consent Status
                  </span>
                  <span className="text-sm font-semibold flex items-center gap-1.5 text-success">
                    <ShieldAlert className="h-4 w-4 text-accent" />
                    DPDP Act Compliant Consent Granted
                  </span>
                </div>

                {prescription.status === "pending" && (
                  <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                    <span className="text-xs text-muted-foreground">
                      Verification Actions:
                    </span>
                    <PrescriptionActions prescriptionId={prescription.id} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/10 border border-dashed border-border rounded-xl">
              <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-55" />
              <p className="text-sm text-muted-foreground font-light">
                No prescription associated with this order.
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Order Status/Fulfillment, Shipping details, Client details */}
        <div className="space-y-6">
          {/* Order Actions / Status */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <Package className="h-4.5 w-4.5 text-accent" />
              Order Status & Fulfillment
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Fulfillment Status
                </span>
                <span
                  className={`badge uppercase tracking-wider text-[10px] font-semibold mt-1 inline-block ${
                    order.status === "delivered"
                      ? "badge-success"
                      : order.status === "cancelled"
                        ? "badge-destructive"
                        : "badge"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.tracking_number && (
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-xs space-y-1">
                  <p>
                    <span className="font-semibold">Tracking Number:</span>{" "}
                    {order.tracking_number}
                  </p>
                  {order.courier && (
                    <p>
                      <span className="font-semibold">Courier:</span>{" "}
                      {order.courier}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <span className="text-xs font-semibold text-muted-foreground block mb-2">
                  Fulfillment Actions
                </span>
                <OrderActions order={order} />
              </div>
            </div>
          </div>

          {/* Client details */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-accent" />
              Customer Information
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
              <div>
                <span className="text-xs text-muted-foreground block">
                  Email Address
                </span>
                <span className="font-medium font-mono text-xs">
                  {userEmail}
                </span>
              </div>
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

          {/* Shipping Address */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-accent" />
              Shipping Address
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="text-foreground font-semibold">
                {(order.shipping_address as ShippingAddress)?.full_name}
              </p>
              <p>{(order.shipping_address as ShippingAddress)?.line1}</p>
              {(order.shipping_address as ShippingAddress)?.line2 && (
                <p>{(order.shipping_address as ShippingAddress).line2}</p>
              )}
              <p>
                {(order.shipping_address as ShippingAddress)?.city},{" "}
                {(order.shipping_address as ShippingAddress)?.state} —{" "}
                {(order.shipping_address as ShippingAddress)?.pincode}
              </p>
              <p className="pt-2 font-medium text-foreground">
                📞 {(order.shipping_address as ShippingAddress)?.phone}
              </p>
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-semibold border-b border-border pb-3 flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-accent" />
              Order Metadata
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">
                  Placed On
                </span>
                <span className="font-medium">
                  {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">
                  Payment Method
                </span>
                <span className="font-medium capitalize">
                  {order.payment_method === "razorpay"
                    ? "Razorpay Online"
                    : "Cash on Delivery (COD)"}
                </span>
              </div>
              {order.razorpay_payment_id && (
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Razorpay Payment ID
                  </span>
                  <span className="font-mono text-xs">
                    {order.razorpay_payment_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
