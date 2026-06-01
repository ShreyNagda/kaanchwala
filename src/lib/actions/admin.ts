"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendOrderShipped } from "@/lib/email";
import { processRefund } from "@/lib/razorpay";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/lib/types";
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Auth user error:", userError);
    throw new Error("Authentication failed");
  }

  if (!user) {
    console.error("No user found in session");
    throw new Error("Unauthorized admin access - No user found");
  }

  console.log(`User ID: ${user.id}`);
  console.log(`User email: ${user.email}`);

  // Try to get profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile query error:", profileError);
    console.error("Error details:", {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint,
    });

    // Check if the profiles table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from("profiles")
      .select("count")
      .limit(1);

    console.log("Table exists check:", {
      exists: !!tableExists,
      error: tableCheckError,
    });

    throw new Error(`Profile query failed: ${profileError.message}`);
  }

  if (!profile) {
    console.error("No profile found for user ID:", user.id);

    // Check if user exists in profiles table at all
    const { data: allProfiles, error: listError } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .limit(5);

    console.log("Sample profiles in table:", allProfiles);

    throw new Error("Unauthorized admin access - No profile found");
  }

  console.log(`Profile found: ${JSON.stringify(profile)}`);

  if (profile.role !== "admin") {
    console.log(`User role is ${profile.role}, not admin`);
    throw new Error("Unauthorized admin access - Not an admin user");
  }

  return { user, profile };
}

// --- Order Management ---

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) return { error: error.message };

  // If shipped, send email
  if (status === "shipped") {
    const { data: order } = await db
      .from("orders")
      .select()
      .eq("id", orderId)
      .single();

    if (order) {
      try {
        await sendOrderShipped(order);
      } catch {
        /* non-blocking */
      }
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

export async function addTrackingInfo(
  orderId: string,
  trackingNumber: string,
  courier: string,
) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("orders")
    .update({
      tracking_number: trackingNumber,
      courier,
      status: "shipped",
    })
    .eq("id", orderId);

  if (error) return { error: error.message };

  // Send shipped email
  const { data: order } = await db
    .from("orders")
    .select()
    .eq("id", orderId)
    .single();
  if (order) {
    try {
      await sendOrderShipped(order);
    } catch {
      /* non-blocking */
    }
  }

  revalidatePath("/admin/orders");
  return { success: true };
}

// --- Product Management ---

export async function createProduct(data: {
  title: string;
  description?: string;
  base_price: number;
  discount_price?: number | null;
  category: "eyeglasses" | "sunglasses" | "contact_lenses";
  is_premium: boolean;
  is_active: boolean;
  return_eligible: boolean;
  image_urls?: string[];
}) {
  await requireAdmin();
  const db = createAdminClient();

  const { data: product, error } = await db
    .from("products")
    .insert(data)
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, product };
}

export async function updateProduct(
  productId: string,
  data: Record<string, unknown>,
) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db.from("products").update(data).eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("products")
    .update({ is_active: false })
    .eq("id", productId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function uploadProductImage(formData: FormData) {
  await requireAdmin();
  const db = createAdminClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let { error } = await db.storage
    .from("product-images")
    .upload(fileName, buffer, {
      contentType: file.type || "image/jpeg",
      duplex: "half",
    });

  if (
    error &&
    (error.message.toLowerCase().includes("not found") ||
      error.message.toLowerCase().includes("exist"))
  ) {
    // Auto-create bucket and retry upload
    const { error: createError } = await db.storage.createBucket(
      "product-images",
      {
        public: true,
        allowedMimeTypes: ["image/*"],
      },
    );
    if (!createError) {
      const retryResult = await db.storage
        .from("product-images")
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
  } = db.storage.from("product-images").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

// --- Variant Management ---

export async function createVariant(
  productId: string,
  data: {
    color: string;
    sku: string;
    stock_quantity: number;
  },
) {
  await requireAdmin();
  const db = createAdminClient();

  const { data: variant, error } = await db
    .from("variants")
    .insert({
      ...data,
      product_id: productId,
      is_in_stock: data.stock_quantity > 0,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { success: true, variant };
}

export async function updateStock(variantId: string, quantity: number) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("variants")
    .update({ stock_quantity: quantity })
    .eq("id", variantId);

  if (error) return { error: error.message };

  revalidatePath("/admin/products");
  return { success: true };
}

// --- Prescription Management ---

export async function approvePrescription(prescriptionId: string) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("prescriptions")
    .update({ status: "approved" })
    .eq("id", prescriptionId);

  if (error) return { error: error.message };

  revalidatePath("/admin/prescriptions");
  return { success: true };
}

export async function rejectPrescription(
  prescriptionId: string,
  notes?: string,
) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("prescriptions")
    .update({ status: "rejected", notes: notes || "Rejected by admin" })
    .eq("id", prescriptionId);

  if (error) return { error: error.message };

  revalidatePath("/admin/prescriptions");
  return { success: true };
}

export async function updatePrescriptionData(
  prescriptionId: string,
  data: {
    sph_r: number | null;
    cyl_r: number | null;
    axis_r: number | null;
    add_r: number | null;
    sph_l: number | null;
    cyl_l: number | null;
    axis_l: number | null;
    add_l: number | null;
    pd: number | null;
    notes?: string | null;
  },
) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("prescriptions")
    .update(data)
    .eq("id", prescriptionId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/prescriptions/${prescriptionId}`);
  revalidatePath("/admin/prescriptions");
  return { success: true };
}

// --- Discount Management ---

export async function createDiscount(data: {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  min_order_amount?: number;
  valid_from: string;
  valid_to: string;
  usage_limit?: number | null;
}) {
  await requireAdmin();
  const db = createAdminClient();

  const { data: discount, error } = await db
    .from("discounts")
    .insert({ ...data, code: data.code.toUpperCase() })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { success: true, discount };
}

export async function updateDiscount(
  discountId: string,
  data: Record<string, unknown>,
) {
  await requireAdmin();
  const db = createAdminClient();

  const { error } = await db
    .from("discounts")
    .update(data)
    .eq("id", discountId);

  if (error) return { error: error.message };

  revalidatePath("/admin/discounts");
  return { success: true };
}

// --- Refund ---

export async function initiateRefund(orderId: string) {
  await requireAdmin();
  const db = createAdminClient();

  const { data: order } = await db
    .from("orders")
    .select()
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.payment_method !== "razorpay")
    return { error: "COD orders can only be exchanged" };
  if (!order.razorpay_payment_id) return { error: "No payment ID found" };

  try {
    await processRefund(order.razorpay_payment_id, order.total);
    await db
      .from("orders")
      .update({ return_status: "refunded" })
      .eq("id", orderId);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch {
    return { error: "Refund processing failed" };
  }
}

// --- Bulk Import ---

export async function bulkImportProducts(
  products: Array<{
    title: string;
    description?: string;
    base_price: number;
    discount_price?: number | null;
    category: "eyeglasses" | "sunglasses" | "contact_lenses";
    is_premium?: boolean;
    variants?: Array<{
      color: string;
      sku: string;
      stock_quantity: number;
    }>;
  }>,
) {
  await requireAdmin();
  const db = createAdminClient();

  const results = { imported: 0, errors: [] as string[] };

  for (const product of products) {
    const { variants, ...productData } = product;
    const { data: newProduct, error } = await db
      .from("products")
      .insert({
        ...productData,
        is_active: true,
        return_eligible: true,
        is_premium: product.is_premium || false,
      })
      .select()
      .single();

    if (error) {
      results.errors.push(`${product.title}: ${error.message}`);
      continue;
    }

    if (variants && newProduct) {
      const variantRows = variants.map((v) => ({
        product_id: newProduct.id,
        color: v.color,
        sku: v.sku,
        stock_quantity: v.stock_quantity,
        is_in_stock: v.stock_quantity > 0,
      }));
      await db.from("variants").insert(variantRows);
    }

    results.imported++;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return results;
}
