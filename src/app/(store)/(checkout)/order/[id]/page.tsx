import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatPrice, shortId } from "@/lib/utils";
import { format } from "date-fns";
import {
  Package,
  Check,
  Truck,
  MapPin,
  Clock,
  Glasses,
  Sun,
  Eye,
  FileText,
  Upload,
} from "lucide-react";
import { GuestSignupBanner } from "./guest-signup-banner";
import type { Metadata } from "next";
import type { OrderItem, Product, ShippingAddress } from "@/lib/types";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_STEPS = [
  { key: "pending", label: "Placed", icon: <Clock className="h-4 w-4" /> },
  { key: "verified", label: "Verified", icon: <Check className="h-4 w-4" /> },
  {
    key: "processing",
    label: "Processing",
    icon: <Package className="h-4 w-4" />,
  },
  { key: "shipped", label: "Shipped", icon: <Truck className="h-4 w-4" /> },
  {
    key: "delivered",
    label: "Delivered",
    icon: <MapPin className="h-4 w-4" />,
  },
];

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*, product:products(title, category, image_urls))")
    .eq("id", id)
    .single();

  if (!order) notFound();

  // Fetch prescription details if they exist
  const { data: prescription } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("order_id", id)
    .maybeSingle();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isGuest = !user;

  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === order.status,
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mt-2">
            Order #{shortId(order.id)} •{" "}
            {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        {/* Guest Signup Banner — 5% off next order */}
        {isGuest && <GuestSignupBanner email={order.customer_email} />}

        {/* Status Timeline */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, idx) => (
              <div
                key={step.key}
                className="flex flex-col items-center flex-1 relative"
              >
                {/* Connector line */}
                {idx > 0 && (
                  <div
                    className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                      idx <= currentStepIndex ? "bg-accent" : "bg-border"
                    }`}
                  />
                )}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    idx <= currentStepIndex
                      ? "bg-accent text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.icon}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    idx <= currentStepIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {order.tracking_number && (
            <div className="mt-6 p-3 rounded-lg bg-muted text-sm">
              <span className="text-muted-foreground">Tracking:</span>{" "}
              <span className="font-medium">{order.tracking_number}</span>
              {order.courier && (
                <span className="text-muted-foreground">
                  {" "}
                  via {order.courier}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          <div className="space-y-3">
            {order.order_items.map(
              (item: OrderItem & { product?: Product }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                    {item.product?.category === "sunglasses" ? (
                      <Sun className="h-7 w-7" />
                    ) : item.product?.category === "contact_lenses" ? (
                      <Eye className="h-7 w-7" />
                    ) : (
                      <Glasses className="h-7 w-7" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.product?.title || "Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ),
            )}
          </div>

          <hr className="border-border my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping_fee === 0
                  ? "FREE"
                  : formatPrice(order.shipping_fee)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({order.discount_code})</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            <hr className="border-border" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Prescription Card */}
        {prescription && (
          <div className="card p-6 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                Prescription Information
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                  prescription.status === "approved"
                    ? "bg-success/10 text-success"
                    : prescription.status === "rejected"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-warning/10 text-warning"
                }`}
              >
                {prescription.status}
              </span>
            </div>

            {prescription.prescription_url && (
              <div className="mb-5">
                <a
                  href={prescription.prescription_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:underline bg-accent/5 px-4 py-2.5 rounded-xl border border-accent/15 transition-all hover:bg-accent/10"
                >
                  <Upload className="h-4 w-4" />
                  View Uploaded Prescription Document
                </a>
              </div>
            )}

            {(prescription.sph_r !== null || prescription.sph_l !== null) && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground font-medium text-xs uppercase tracking-wider">
                      <th className="py-2">Eye</th>
                      <th className="py-2">SPH</th>
                      <th className="py-2">CYL</th>
                      <th className="py-2">AXIS</th>
                      <th className="py-2">ADD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 text-foreground">
                    <tr>
                      <td className="py-2.5 font-medium text-foreground">
                        Right (OD)
                      </td>
                      <td className="py-2.5">
                        {prescription.sph_r !== null
                          ? prescription.sph_r.toFixed(2)
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.cyl_r !== null
                          ? prescription.cyl_r.toFixed(2)
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.axis_r !== null
                          ? prescription.axis_r
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.add_r !== null
                          ? prescription.add_r.toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-foreground">
                        Left (OS)
                      </td>
                      <td className="py-2.5">
                        {prescription.sph_l !== null
                          ? prescription.sph_l.toFixed(2)
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.cyl_l !== null
                          ? prescription.cyl_l.toFixed(2)
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.axis_l !== null
                          ? prescription.axis_l
                          : "-"}
                      </td>
                      <td className="py-2.5">
                        {prescription.add_l !== null
                          ? prescription.add_l.toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {prescription.pd && (
                  <div className="mt-3.5 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 inline-block">
                    <strong>PD (Pupillary Distance):</strong> {prescription.pd}{" "}
                    mm
                  </div>
                )}
              </div>
            )}

            {prescription.notes && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                <strong>Notes:</strong> {prescription.notes}
              </div>
            )}
          </div>
        )}

        {/* Shipping Address */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="text-foreground font-medium">
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
            <p>📞 {(order.shipping_address as ShippingAddress)?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
