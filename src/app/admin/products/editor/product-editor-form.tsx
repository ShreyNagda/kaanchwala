/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createProduct,
  updateProduct,
  createVariant,
  updateStock,
  uploadProductImage,
} from "@/lib/actions/admin";
import { toast } from "sonner";
import { Plus, Upload, Loader2, X, Check, Trash } from "lucide-react";
import type {
  ProductCategory,
  ProductWithVariants,
  Variant,
} from "@/lib/types";
import Image from "next/image";

export function ProductEditorForm({
  initialProduct,
}: {
  initialProduct: ProductWithVariants | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "variants">("basic");

  // Image selection previews state
  const [selectedPreviews, setSelectedPreviews] = useState<
    { file: File; url: string }[]
  >([]);

  // Handle file selection and generate local object URL previews
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const newPreviews = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedPreviews((prev) => [...prev, ...newPreviews]);
    setFiles((prev) => [...prev, ...selectedFiles]);

    // Reset file input value to allow selecting same file again
    if (e.target) {
      e.target.value = "";
    }
  };

  // Remove selected pending image
  const handleRemovePendingImage = (indexToRemove: number) => {
    const preview = selectedPreviews[indexToRemove];
    if (preview) {
      URL.revokeObjectURL(preview.url);
    }
    setSelectedPreviews((prev) =>
      prev.filter((_, idx) => idx !== indexToRemove),
    );
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Core product form state
  const [form, setForm] = useState({
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
    base_price: initialProduct?.base_price?.toString() || "",
    discount_price: initialProduct?.discount_price?.toString() || "",
    category: initialProduct?.category || "eyeglasses",
    is_premium: initialProduct?.is_premium ?? false,
    is_active: initialProduct?.is_active ?? true,
    return_eligible: initialProduct?.return_eligible ?? true,
  });

  // Image URLs list
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialProduct?.image_urls || [],
  );

  // New variant state
  const [newVariant, setNewVariant] = useState({
    color: "",
    sku: "",
    stock_quantity: 0,
  });

  // Local state for variants stock to allow updates
  const [variants, setVariants] = useState<Variant[]>(
    initialProduct?.variants || [],
  );

  // Local temporary stocks before saving
  const [variantStocks, setVariantStocks] = useState<Record<string, number>>(
    (initialProduct?.variants || []).reduce(
      (acc, v) => ({ ...acc, [v.id]: v.stock_quantity }),
      {} as Record<string, number>,
    ),
  );

  // Local variable to track which variant is currently saving stock
  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);

  // Handle image upload
  const handleUploadImages = async () => {
    if (files.length === 0) return;
    setLoading(true);
    const toastId = toast.loading("Uploading images...");

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await uploadProductImage(formData);
        if (res.success && res.url) {
          uploadedUrls.push(res.url);
        } else {
          toast.error(
            `Failed to upload ${file.name}: ${res.error || "Unknown error"}`,
          );
        }
      }

      if (uploadedUrls.length > 0) {
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`, {
          id: toastId,
        });

        // Clear pending previews and revoke local URLs
        selectedPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setSelectedPreviews([]);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.dismiss(toastId);
      }
    } catch (_) {
      toast.error("An error occurred during upload", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Remove image from array
  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    toast.success("Image reference removed");
  };

  // Update variant stock quantity
  const handleUpdateStock = async (variantId: string) => {
    const qty = variantStocks[variantId];
    if (qty === undefined || qty < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    setSavingVariantId(variantId);

    try {
      const res = await updateStock(variantId, qty);
      if (res.success) {
        toast.success("Stock quantity updated!");
        // Update local variant quantity state
        setVariants((prev) =>
          prev.map((v) =>
            v.id === variantId ? { ...v, stock_quantity: qty } : v,
          ),
        );
      } else {
        toast.error(`Failed to update stock: ${res.error}`);
      }
    } catch (_) {
      toast.error("Failed to update stock");
    } finally {
      setSavingVariantId(null);
    }
  };

  // Add a new variant
  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialProduct) {
      toast.error("Please create the product first before adding variants");
      return;
    }
    if (!newVariant.color || !newVariant.sku) {
      toast.error("Color and SKU are required");
      return;
    }
    setLoading(true);

    try {
      const res = await createVariant(initialProduct.id, {
        color: newVariant.color,
        sku: newVariant.sku,
        stock_quantity: newVariant.stock_quantity,
      });

      if (res.success && res.variant) {
        toast.success("New variant added!");
        setVariants((prev) => [...prev, res.variant as Variant]);
        setVariantStocks((prev) => ({
          ...prev,
          [res.variant.id]: res.variant.stock_quantity,
        }));
        setNewVariant({ color: "", sku: "", stock_quantity: 0 });
      } else {
        toast.error(`Failed to create variant: ${res.error}`);
      }
    } catch (_) {
      toast.error("An error occurred while creating variant");
    } finally {
      setLoading(false);
    }
  };

  // Submit product edits/creation
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      initialProduct ? "Updating product..." : "Creating product...",
    );

    const finalUrls = [...imageUrls];

    // Upload selected files first
    if (files.length > 0) {
      toast.loading("Uploading selected images...", { id: toastId });
      try {
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await uploadProductImage(formData);
          if (res.success && res.url) {
            finalUrls.push(res.url);
          } else {
            toast.error(
              `Failed to upload ${file.name}: ${res.error || "Unknown error"}`,
              { id: toastId },
            );
            setLoading(false);
            return;
          }
        }
        // Clear previews
        selectedPreviews.forEach((p) => URL.revokeObjectURL(p.url));
        setSelectedPreviews([]);
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (_) {
        toast.error("Image upload failed", { id: toastId });
        setLoading(false);
        return;
      }
    }

    const productData = {
      title: form.title,
      description: form.description || undefined,
      base_price: parseFloat(form.base_price),
      discount_price: form.discount_price
        ? parseFloat(form.discount_price)
        : null,
      category: form.category as "eyeglasses" | "sunglasses" | "contact_lenses",
      is_premium: form.is_premium,
      is_active: form.is_active,
      return_eligible: form.return_eligible,
      image_urls: finalUrls,
    };

    try {
      if (initialProduct) {
        const res = await updateProduct(initialProduct.id, productData);
        if (res.success) {
          toast.success("Product updated successfully!", { id: toastId });
          router.push("/admin/products");
          router.refresh();
        } else {
          toast.error(`Update failed: ${res.error}`, { id: toastId });
        }
      } else {
        const res = await createProduct(productData);
        if (res.success && res.product) {
          toast.success(
            "Product created successfully! Now you can manage its variants.",
            { id: toastId },
          );
          // Redirect to the edit mode for this newly created product to allow variant adding
          router.replace(`/admin/products/editor?id=${res.product.id}`);
          router.refresh();
        } else {
          toast.error(`Creation failed: ${res.error}`, { id: toastId });
        }
      }
    } catch (_) {
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== Tab Bar ===== */}
      <div className="flex border-b border-border mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("basic")}
          className={`px-5 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition-all ${
            activeTab === "basic"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Basic Details
        </button>
        <button
          type="button"
          onClick={() => {
            if (!initialProduct) {
              toast.error(
                "Please create the product details first before managing stock.",
              );
              return;
            }
            setActiveTab("variants");
          }}
          className={`px-5 py-3 text-sm font-semibold tracking-wider uppercase border-b-2 transition-all relative ${
            activeTab === "variants"
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          } ${!initialProduct ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Variants &amp; Stock Levels
          {!initialProduct && (
            <span className="absolute -top-1 -right-2 text-[8px] bg-muted border border-border px-1.5 py-0.5 rounded text-muted-foreground font-sans normal-case tracking-normal">
              Locked
            </span>
          )}
        </button>
      </div>

      {activeTab === "basic" && (
        <form onSubmit={handleSubmitProduct} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Form Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Product Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Akoni Gold aviators"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field py-3 min-h-25 resize-none text-sm"
                  placeholder="Product design details, material composition, etc."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Base Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.base_price}
                    onChange={(e) =>
                      setForm({ ...form, base_price: e.target.value })
                    }
                    className="input-field"
                    placeholder="Base Price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.discount_price}
                    onChange={(e) =>
                      setForm({ ...form, discount_price: e.target.value })
                    }
                    className="input-field"
                    placeholder="Discounted Price"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="input-field"
                >
                  <option value="eyeglasses">Eyeglasses</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="contact_lenses">Contact Lenses</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_premium}
                    onChange={(e) =>
                      setForm({ ...form, is_premium: e.target.checked })
                    }
                    className="h-4.5 w-4.5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="font-medium text-foreground">
                    Premium Collection
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.return_eligible}
                    onChange={(e) =>
                      setForm({ ...form, return_eligible: e.target.checked })
                    }
                    className="h-4.5 w-4.5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="font-medium text-foreground">
                    Return Eligible
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      setForm({ ...form, is_active: e.target.checked })
                    }
                    className="h-4.5 w-4.5 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="font-medium text-foreground">
                    Product Active
                  </span>
                </label>
              </div>
            </div>

            {/* Right Column: Image Management */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Product Images
              </h3>

              {/* Image Upload Input */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field text-sm file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                />
                <button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={loading || files.length === 0}
                  className="btn-accent px-4 gap-1.5 shrink-0 text-xs py-2 min-h-0"
                >
                  <Upload className="h-4 w-4" /> Upload
                </button>
              </div>

              {/* Thumbnail Preview Grid */}
              {imageUrls.length > 0 || selectedPreviews.length > 0 ? (
                <div className="grid grid-cols-3 gap-3 border border-border rounded-lg p-3 bg-muted/30">
                  {/* Uploaded Images */}
                  {imageUrls.map((url, idx) => (
                    <div
                      key={url}
                      className="relative group aspect-square rounded-md overflow-hidden border border-border bg-surface"
                    >
                      <Image
                        width={50}
                        height={50}
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-success/80 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                        Uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Selected Pending Previews */}
                  {selectedPreviews.map((p, idx) => (
                    <div
                      key={p.url}
                      className="relative group aspect-square rounded-md overflow-hidden border border-accent/40 bg-surface"
                    >
                      <Image
                        width={50}
                        height={50}
                        src={p.url}
                        alt={`Pending Preview ${idx + 1}`}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <span className="absolute top-1 left-1 bg-accent/90 text-black text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                        Not Uploaded
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingImage(idx)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-border rounded-lg p-8 text-center text-muted-foreground text-sm">
                  No images added yet. Select files to preview (they will be
                  uploaded when you save the product).
                </div>
              )}
            </div>
          </div>

          {/* Form Action Bar */}
          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="btn-ghost"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary gap-2 min-w-37.5"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : initialProduct ? (
                "Save Changes"
              ) : (
                "Create & Next"
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === "variants" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Variants & Stock Management
            </h2>
            <p className="text-sm text-muted-foreground">
              {initialProduct
                ? "Modify the stock levels of existing frames or add a new color variant."
                : "⚠️ You must save this product details above before you can add variants and stock levels."}
            </p>
          </div>

          {initialProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Existing Stock Management list */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Current Variants
                </h3>

                {variants.length > 0 ? (
                  <div className="space-y-3">
                    {variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between border border-border rounded-lg p-3 bg-surface hover:border-accent/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {v.color}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            SKU: {v.sku}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <input
                            type="number"
                            value={variantStocks[v.id] ?? 0}
                            onChange={(e) =>
                              setVariantStocks({
                                ...variantStocks,
                                [v.id]: parseInt(e.target.value, 10) || 0,
                              })
                            }
                            className="w-20 text-center input-field min-h-9 py-1"
                            min={0}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateStock(v.id)}
                            disabled={savingVariantId === v.id || loading}
                            className="btn-accent px-3 py-1.5 min-h-9 text-xs font-semibold gap-1"
                          >
                            {savingVariantId === v.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-border rounded-lg p-6 text-center text-muted-foreground text-sm bg-muted/10">
                    No variants added yet. Use the form on the right to create
                    one.
                  </div>
                )}
              </div>

              {/* Add New Variant Form */}
              <div className="card p-4 bg-muted/10">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  Add Color Variant
                </h3>
                <form onSubmit={handleAddVariant} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Color Description
                    </label>
                    <input
                      value={newVariant.color}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, color: e.target.value })
                      }
                      className="input-field min-h-9 text-sm"
                      placeholder="e.g. Glossy Black, Tortoiseshell"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      SKU Code
                    </label>
                    <input
                      value={newVariant.sku}
                      onChange={(e) =>
                        setNewVariant({ ...newVariant, sku: e.target.value })
                      }
                      className="input-field min-h-9 text-sm"
                      placeholder="e.g. AKONI-BLK-54"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">
                      Initial Stock Level
                    </label>
                    <input
                      type="number"
                      value={newVariant.stock_quantity}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          stock_quantity: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="input-field min-h-9 text-sm"
                      min={0}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full gap-1.5 text-xs py-2 mt-2 min-h-0"
                  >
                    <Plus className="h-4 w-4" /> Add Variant to Catalog
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
