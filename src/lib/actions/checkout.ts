"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createRazorpayOrder, verifyPaymentSignature } from "@/lib/razorpay";
import { sendOrderConfirmation, sendPrescriptionReceived } from "@/lib/email";
import { checkoutSchema } from "@/lib/validations/checkout";
import { calculateShipping } from "@/lib/utils";
import type { LensAddOn, Prescription } from "@/lib/types";
import { revalidatePath } from "next/cache";

interface CartItemPayload {
  productId: string;
  variantId: string | null;
  lensAddOns: LensAddOn[];
  quantity: number;
  unitPrice: number;
}

export async function createOrder(
  cartItems: CartItemPayload[],
  formData: {
    email: string;
    address: {
      full_name: string;
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
    };
    paymentMethod: "razorpay" | "cod";
    discountCode?: string;
    prescriptionId?: string;
    prescriptionData?: {
      sph_r?: number | null;
      cyl_r?: number | null;
      axis_r?: number | null;
      add_r?: number | null;
      sph_l?: number | null;
      cyl_l?: number | null;
      axis_l?: number | null;
      add_l?: number | null;
      pd?: number | null;
      prescriptionUrl?: string | null;
      dpdpConsent: boolean;
    };
  },
) {
  const validated = checkoutSchema.safeParse({
    email: formData.email,
    address: formData.address,
    paymentMethod: formData.paymentMethod,
    discountCode: formData.discountCode,
  });
  if (!validated.success) {
    const errors: Record<string, string[]> = {};
    validated.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });
    return { error: errors };
  }

  const supabase = await createClient();
  const adminDb = createAdminClient();

  // Get current user (may be null for guest checkout)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Calculate totals
  let subtotal = 0;
  for (const item of cartItems) {
    subtotal += item.unitPrice * item.quantity;
  }

  const shippingFee = calculateShipping(subtotal);

  // Apply discount if provided
  let discountAmount = 0;
  if (validated.data.discountCode) {
    const { data: discount } = await adminDb
      .from("discounts")
      .select()
      .eq("code", validated.data.discountCode.toUpperCase())
      .eq("is_active", true)
      .lte("valid_from", new Date().toISOString())
      .gte("valid_to", new Date().toISOString())
      .single();

    if (discount) {
      if (
        discount.usage_limit &&
        discount.usage_count >= discount.usage_limit
      ) {
        return {
          error: { discountCode: ["This discount code has been used up"] },
        };
      }
      if (subtotal < discount.min_order_amount) {
        return {
          error: {
            discountCode: [
              `Minimum order ₹${discount.min_order_amount} required`,
            ],
          },
        };
      }

      discountAmount =
        discount.type === "percentage"
          ? (subtotal * discount.value) / 100
          : discount.value;

      // Increment usage count
      await adminDb
        .from("discounts")
        .update({ usage_count: discount.usage_count + 1 })
        .eq("id", discount.id);
    }
  }

  const total = subtotal + shippingFee - discountAmount;

  // Create order
  const { data: order, error: orderError } = await adminDb
    .from("orders")
    .insert({
      customer_email: validated.data.email,
      user_id: user?.id || null,
      status: "pending",
      payment_method: validated.data.paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total,
      shipping_address: validated.data.address,
      discount_code: validated.data.discountCode || null,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { error: { _form: ["Failed to create order. Please try again."] } };
  }

  // Link prescription to order
  if (formData.prescriptionId) {
    const { data: existingRx } = await adminDb
      .from("prescriptions")
      .select("*")
      .eq("id", formData.prescriptionId)
      .single();

    if (existingRx) {
      await adminDb.from("prescriptions").insert({
        order_id: order.id,
        user_id: user?.id || null,
        sph_r: existingRx.sph_r,
        cyl_r: existingRx.cyl_r,
        axis_r: existingRx.axis_r,
        add_r: existingRx.add_r,
        sph_l: existingRx.sph_l,
        cyl_l: existingRx.cyl_l,
        axis_l: existingRx.axis_l,
        add_l: existingRx.add_l,
        pd: existingRx.pd,
        prescription_url: existingRx.prescription_url,
        dpdp_consent: existingRx.dpdp_consent,
        status: "pending",
      });
    }
  } else if (formData.prescriptionData) {
    await adminDb.from("prescriptions").insert({
      order_id: order.id,
      user_id: user?.id || null,
      sph_r: formData.prescriptionData.sph_r,
      cyl_r: formData.prescriptionData.cyl_r,
      axis_r: formData.prescriptionData.axis_r,
      add_r: formData.prescriptionData.add_r,
      sph_l: formData.prescriptionData.sph_l,
      cyl_l: formData.prescriptionData.cyl_l,
      axis_l: formData.prescriptionData.axis_l,
      add_l: formData.prescriptionData.add_l,
      pd: formData.prescriptionData.pd,
      prescription_url: formData.prescriptionData.prescriptionUrl || null,
      dpdp_consent: formData.prescriptionData.dpdpConsent,
      status: "pending",
    });
  }

  // Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    lens_add_ons: item.lensAddOns,
    quantity: item.quantity,
    unit_price: item.unitPrice,
  }));

  await adminDb.from("order_items").insert(orderItems);

  // Deduct stock
  for (const item of cartItems) {
    if (item.variantId) {
      const { data: variant } = await adminDb
        .from("variants")
        .select("stock_quantity")
        .eq("id", item.variantId)
        .single();

      if (variant) {
        const newStock = Math.max(0, variant.stock_quantity - item.quantity);
        await adminDb
          .from("variants")
          .update({ stock_quantity: newStock })
          .eq("id", item.variantId);
      }
    }
  }

  // For Razorpay: create Razorpay order
  if (validated.data.paymentMethod === "razorpay") {
    try {
      const rpOrder = await createRazorpayOrder({
        amount: total,
        receipt: order.id,
        notes: {
          order_id: order.id,
          customer_email: validated.data.email,
        },
      });

      await adminDb
        .from("orders")
        .update({ razorpay_order_id: rpOrder.id })
        .eq("id", order.id);

      return {
        success: true,
        orderId: order.id,
        razorpayOrderId: rpOrder.id,
        amount: total,
      };
    } catch {
      return {
        error: { _form: ["Failed to initialize payment. Please try again."] },
      };
    }
  }

  // For COD: directly confirm
  await adminDb
    .from("orders")
    .update({ status: "verified" })
    .eq("id", order.id);

  // Send confirmation email
  try {
    const itemsWithProducts = await Promise.all(
      orderItems.map(async (item) => {
        const { data: product } = await adminDb
          .from("products")
          .select()
          .eq("id", item.product_id)
          .single();
        return { ...item, id: "", created_at: "", product };
      }),
    );
    await sendOrderConfirmation(order, itemsWithProducts);
  } catch {
    // Email failure should not block order
  }

  return { success: true, orderId: order.id };
}

export async function verifyRazorpayPayment(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  const isValid = verifyPaymentSignature({
    razorpay_order_id: params.razorpay_order_id,
    razorpay_payment_id: params.razorpay_payment_id,
    razorpay_signature: params.razorpay_signature,
  });

  if (!isValid) {
    return { error: "Payment verification failed" };
  }

  const adminDb = createAdminClient();
  await adminDb
    .from("orders")
    .update({
      status: "verified",
      razorpay_payment_id: params.razorpay_payment_id,
    })
    .eq("id", params.orderId);

  // Send confirmation email
  const { data: order } = await adminDb
    .from("orders")
    .select("*, order_items(*, product:products(*))")
    .eq("id", params.orderId)
    .single();

  if (order) {
    try {
      await sendOrderConfirmation(order, order.order_items);
    } catch {
      // Non-blocking
    }
  }

  return { success: true };
}

export async function applyDiscountCode(code: string, subtotal: number) {
  const supabase = await createClient();
  const { data: discount } = await supabase
    .from("discounts")
    .select()
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!discount) {
    return { error: "Invalid discount code" };
  }

  if (
    new Date(discount.valid_from) > new Date() ||
    new Date(discount.valid_to) < new Date()
  ) {
    return { error: "This discount code has expired" };
  }

  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
    return { error: "This discount code has been fully redeemed" };
  }

  if (subtotal < discount.min_order_amount) {
    return { error: `Minimum order ₹${discount.min_order_amount} required` };
  }

  const discountAmount =
    discount.type === "percentage"
      ? (subtotal * discount.value) / 100
      : discount.value;

  return {
    success: true,
    discount: {
      code: discount.code,
      type: discount.type,
      value: discount.value,
      amount: discountAmount,
    },
  };
}

export async function submitPrescription(
  orderId: string,
  data: {
    sph_r?: number | null;
    cyl_r?: number | null;
    axis_r?: number | null;
    add_r?: number | null;
    sph_l?: number | null;
    cyl_l?: number | null;
    axis_l?: number | null;
    add_l?: number | null;
    pd?: number | null;
    prescriptionUrl?: string | null;
    dpdpConsent: boolean;
  },
) {
  if (!data.dpdpConsent) {
    return { error: "DPDP consent is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminDb = createAdminClient();

  const { error } = await adminDb.from("prescriptions").insert({
    order_id: orderId,
    user_id: user?.id || null,
    sph_r: data.sph_r,
    cyl_r: data.cyl_r,
    axis_r: data.axis_r,
    add_r: data.add_r,
    sph_l: data.sph_l,
    cyl_l: data.cyl_l,
    axis_l: data.axis_l,
    add_l: data.add_l,
    pd: data.pd,
    prescription_url: data.prescriptionUrl || null,
    dpdp_consent: data.dpdpConsent,
    status: "pending",
  });

  if (error) {
    return { error: "Failed to submit prescription" };
  }

  // Get order email for notification
  const { data: order } = await adminDb
    .from("orders")
    .select("customer_email")
    .eq("id", orderId)
    .single();

  if (order) {
    try {
      await sendPrescriptionReceived(order.customer_email, orderId);
    } catch {
      // Non-blocking
    }
  }

  revalidatePath(`/order/${orderId}`);
  return { success: true };
}

export async function uploadPrescriptionFile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to upload a prescription" };
  }

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const adminDb = createAdminClient();

  let { error } = await adminDb.storage
    .from("prescriptions")
    .upload(fileName, buffer, {
      contentType: file.type || "image/jpeg",
      duplex: "half",
    });

  if (
    error &&
    (error.message.toLowerCase().includes("not found") ||
      error.message.toLowerCase().includes("exist"))
  ) {
    const { error: createError } = await adminDb.storage.createBucket(
      "prescriptions",
      {
        public: true,
        allowedMimeTypes: ["image/*", "application/pdf"],
      },
    );
    if (!createError) {
      const retryResult = await adminDb.storage
        .from("prescriptions")
        .upload(fileName, buffer, {
          contentType: file.type || "image/jpeg",
          duplex: "half",
        });
      error = retryResult.error;
    }
  }

  if (error) return { error: error.message };

  const {
    data: { publicUrl },
  } = adminDb.storage.from("prescriptions").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

export async function getUserPrescriptions() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("prescriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prescriptions:", error);
    return [];
  }

  const valid = (data || []).filter(
    (rx: Prescription) =>
      rx.prescription_url ||
      rx.sph_r !== null ||
      rx.sph_l !== null ||
      rx.pd !== null,
  );

  return valid;
}

export async function saveAccountPrescription(data: {
  sph_r?: number | null;
  cyl_r?: number | null;
  axis_r?: number | null;
  add_r?: number | null;
  sph_l?: number | null;
  cyl_l?: number | null;
  axis_l?: number | null;
  add_l?: number | null;
  pd?: number | null;
  prescriptionUrl?: string | null;
  dpdpConsent: boolean;
  notes?: string | null;
}) {
  if (!data.dpdpConsent) {
    return { error: "DPDP consent is required" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save a prescription" };
  }

  const adminDb = createAdminClient();
  const { error } = await adminDb.from("prescriptions").insert({
    user_id: user.id,
    order_id: null,
    sph_r: data.sph_r,
    cyl_r: data.cyl_r,
    axis_r: data.axis_r,
    add_r: data.add_r,
    sph_l: data.sph_l,
    cyl_l: data.cyl_l,
    axis_l: data.axis_l,
    add_l: data.add_l,
    pd: data.pd,
    prescription_url: data.prescriptionUrl || null,
    dpdp_consent: data.dpdpConsent,
    notes: data.notes || null,
    status: "pending",
  });

  if (error) {
    return { error: "Failed to save prescription: " + error.message };
  }

  revalidatePath("/account");
  return { success: true };
}

