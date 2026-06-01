"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, calculateShipping } from "@/lib/utils";
import {
  createOrder,
  verifyRazorpayPayment,
  applyDiscountCode,
  uploadPrescriptionFile,
  getUserPrescriptions,
} from "@/lib/actions/checkout";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Check,
  Tag,
  Loader2,
  Glasses,
  Sun,
  Eye,
  Upload,
  Plus,
  FileText,
  Lock,
} from "lucide-react";
import { Prescription } from "@/lib/types";
import { User } from "@supabase/supabase-js";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay",
  );
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<{
    code: string;
    amount: number;
    type: string;
    value: number;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Prescription states
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [savedPrescriptions, setSavedPrescriptions] = useState<Prescription[]>(
    [],
  );
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<
    string | null
  >(null);
  const [prescriptionMode, setPrescriptionMode] = useState<"saved" | "new">(
    "new",
  );
  const [newPrescription, setNewPrescription] = useState({
    sph_r: "" as string | number,
    cyl_r: "" as string | number,
    axis_r: "" as string | number,
    add_r: "" as string | number,
    sph_l: "" as string | number,
    cyl_l: "" as string | number,
    axis_l: "" as string | number,
    add_l: "" as string | number,
    pd: "" as string | number,
    prescriptionUrl: "",
    dpdpConsent: false,
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  const hasPrescriptionItem = items.some(
    (item) =>
      item.product.category === "eyeglasses" ||
      item.product.category === "contact_lenses",
  );

  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
          setEmail(user.email || "");
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .single();
          if (profile) {
            setAddress((prev) => ({
              ...prev,
              full_name: profile.full_name || prev.full_name,
              phone: profile.phone || prev.phone,
            }));
          }
          const savedRxs = await getUserPrescriptions();
          setSavedPrescriptions(savedRxs);
          if (savedRxs && savedRxs.length > 0) {
            setPrescriptionMode("saved");
            setSelectedPrescriptionId(savedRxs[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setLoadingUser(false);
      }
    }
    loadSession();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadPrescriptionFile(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        setNewPrescription((prev) => ({
          ...prev,
          prescriptionUrl: result.url,
        }));
        toast.success("Prescription file uploaded successfully");
      }
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploadingFile(false);
    }
  };

  const shipping = calculateShipping(subtotal);
  const discountAmount = discountInfo?.amount || 0;
  const total = subtotal + shipping - discountAmount;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-6">
          Add some products to checkout
        </p>
        <a href="/products" className="btn-accent">
          Browse Collection
        </a>
      </div>
    );
  }

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    const result = await applyDiscountCode(discountCode, subtotal);
    if ("error" in result) {
      toast.error(result.error as string);
    } else if (result.discount) {
      setDiscountInfo(result.discount);
      toast.success(
        `Discount applied: -${formatPrice(result.discount.amount)}`,
      );
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrors({});

    const cartPayload = items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant?.id || null,
      lensAddOns: item.lensAddOns,
      quantity: item.quantity,
      unitPrice:
        (item.product.discount_price ?? item.product.base_price) +
        item.lensAddOns.reduce((s, a) => s + a.price, 0),
    }));

    // Prepare prescription data if applicable
    let prescriptionId = undefined;
    let prescriptionData = undefined;

    if (hasPrescriptionItem && user) {
      if (prescriptionMode === "saved" && selectedPrescriptionId) {
        prescriptionId = selectedPrescriptionId;
      } else if (prescriptionMode === "new") {
        if (!newPrescription.dpdpConsent) {
          toast.error(
            "You must consent to prescription data storage as per DPDP Act",
          );
          setLoading(false);
          return;
        }
        if (
          !newPrescription.prescriptionUrl &&
          !newPrescription.sph_r &&
          !newPrescription.sph_l
        ) {
          toast.error(
            "Please upload a prescription file or enter values manually",
          );
          setLoading(false);
          return;
        }

        prescriptionData = {
          sph_r: newPrescription.sph_r ? Number(newPrescription.sph_r) : null,
          cyl_r: newPrescription.cyl_r ? Number(newPrescription.cyl_r) : null,
          axis_r: newPrescription.axis_r
            ? Number(newPrescription.axis_r)
            : null,
          add_r: newPrescription.add_r ? Number(newPrescription.add_r) : null,
          sph_l: newPrescription.sph_l ? Number(newPrescription.sph_l) : null,
          cyl_l: newPrescription.cyl_l ? Number(newPrescription.cyl_l) : null,
          axis_l: newPrescription.axis_l
            ? Number(newPrescription.axis_l)
            : null,
          add_l: newPrescription.add_l ? Number(newPrescription.add_l) : null,
          pd: newPrescription.pd ? Number(newPrescription.pd) : null,
          prescriptionUrl: newPrescription.prescriptionUrl || null,
          dpdpConsent: newPrescription.dpdpConsent,
        };
      }
    }

    const result = await createOrder(cartPayload, {
      email,
      address,
      paymentMethod,
      discountCode: discountInfo?.code,
      prescriptionId,
      prescriptionData,
    });

    if ("error" in result && result.error) {
      const errs = result.error as Record<string, string[]>;
      setErrors(errs);
      setLoading(false);
      toast.error("Please fix the errors and try again");

      // Automatically redirect back to Step 1 if the error is on email or address fields
      const hasAddressErrors = Object.keys(errs).some(
        (key) => key.startsWith("address.") || key === "email",
      );
      if (hasAddressErrors) {
        setStep(1);
      }
      return;
    }

    if (
      result.success &&
      paymentMethod === "razorpay" &&
      result.razorpayOrderId
    ) {
      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round((result.amount || total) * 100),
        currency: "INR",
        name: "Kaanchwala",
        description: "Premium Eyewear",
        order_id: result.razorpayOrderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verifyResult = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: result.orderId!,
          });

          if (verifyResult.success) {
            clearCart();
            router.push(`/order/${result.orderId}`);
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email,
          contact: address.phone,
        },
        theme: {
          color: "#8b7355",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } else if (result.success) {
      // COD order
      clearCart();
      router.push(`/order/${result.orderId}`);
    }

    setLoading(false);
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {[
            {
              num: 1,
              label: "Contact & Address",
              icon: <MapPin className="h-4 w-4" />,
            },
            {
              num: 2,
              label: "Payment",
              icon: <CreditCard className="h-4 w-4" />,
            },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <button
                onClick={() => step > s.num && setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step >= s.num
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="h-4 w-4" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="card p-6 space-y-5">
                <h2 className="text-xl font-semibold">
                  Contact & Shipping Address
                </h2>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                    id="checkout-email"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={address.full_name}
                      onChange={(e) =>
                        setAddress({ ...address, full_name: e.target.value })
                      }
                      className="input-field"
                      placeholder="John Doe"
                    />
                    {errors["address.full_name"] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors["address.full_name"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="input-field"
                      placeholder="9876543210"
                    />
                    {errors["address.phone"] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors["address.phone"][0]}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    value={address.line1}
                    onChange={(e) =>
                      setAddress({ ...address, line1: e.target.value })
                    }
                    className="input-field"
                    placeholder="House/Flat no., Building name"
                  />
                  {errors["address.line1"] && (
                    <p className="text-xs text-destructive mt-1">
                      {errors["address.line1"][0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">
                    Address Line 2 (optional)
                  </label>
                  <input
                    type="text"
                    value={address.line2}
                    onChange={(e) =>
                      setAddress({ ...address, line2: e.target.value })
                    }
                    className="input-field"
                    placeholder="Locality, Landmark"
                  />
                  {errors["address.line2"] && (
                    <p className="text-xs text-destructive mt-1">
                      {errors["address.line2"][0]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="input-field"
                      placeholder="Mumbai"
                    />
                    {errors["address.city"] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors["address.city"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="input-field"
                      placeholder="Maharashtra"
                    />
                    {errors["address.state"] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors["address.state"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress({ ...address, pincode: e.target.value })
                      }
                      className="input-field"
                      placeholder="400001"
                    />
                    {errors["address.pincode"] && (
                      <p className="text-xs text-destructive mt-1">
                        {errors["address.pincode"][0]}
                      </p>
                    )}
                  </div>
                </div>

                {hasPrescriptionItem &&
                  (loadingUser ? (
                    <div className="flex justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    </div>
                  ) : !user ? (
                    <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 my-6">
                      <Lock className="h-10 w-10 text-accent" />
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          Prescription Eyewear Detected
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                          To buy prescription eyeglasses or contact lenses,
                          please log in or create an account to safely upload
                          and save your prescription.
                        </p>
                      </div>
                      <div className="flex gap-4 w-full sm:w-auto">
                        <Link
                          href={`/login?redirect=${encodeURIComponent("/checkout")}`}
                          className="btn-primary flex-1 sm:flex-initial text-center py-2.5 px-6"
                        >
                          Sign In
                        </Link>
                        <Link
                          href={`/register?redirect=${encodeURIComponent("/checkout")}`}
                          className="btn-outline flex-1 sm:flex-initial text-center py-2.5 px-6"
                        >
                          Create Account
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-border pt-6 mt-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5 text-accent" />
                          Prescription Details
                        </h3>
                        {savedPrescriptions.length > 0 && (
                          <div className="flex bg-muted rounded-lg p-0.5 text-xs">
                            <button
                              type="button"
                              onClick={() => setPrescriptionMode("saved")}
                              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                                prescriptionMode === "saved"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Saved
                            </button>
                            <button
                              type="button"
                              onClick={() => setPrescriptionMode("new")}
                              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                                prescriptionMode === "new"
                                  ? "bg-background text-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              Upload New
                            </button>
                          </div>
                        )}
                      </div>

                      {prescriptionMode === "saved" &&
                      savedPrescriptions.length > 0 ? (
                        <div className="space-y-3">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                            Select a saved prescription
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedPrescriptions.map((rx) => {
                              const dateStr = rx.created_at
                                ? new Date(rx.created_at).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "Unknown Date";

                              const hasNumbers =
                                rx.sph_r !== null || rx.sph_l !== null;

                              return (
                                <button
                                  key={rx.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedPrescriptionId(rx.id)
                                  }
                                  className={`text-left p-4 rounded-xl border transition-all ${
                                    selectedPrescriptionId === rx.id
                                      ? "border-accent bg-accent/5 shadow-sm hover:bg-accent/5"
                                      : "border-border hover:border-accent/30 bg-background"
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                                      {rx.status || "pending"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {dateStr}
                                    </span>
                                  </div>
                                  {rx.prescription_url ? (
                                    <p className="text-xs text-foreground truncate flex items-center gap-1.5">
                                      <Upload className="h-3 w-3 shrink-0 text-muted-foreground" />
                                      Attached File
                                    </p>
                                  ) : null}
                                  {hasNumbers ? (
                                    <div className="grid grid-cols-2 gap-x-2 text-[10px] text-muted-foreground mt-1.5 border-t border-border/50 pt-1.5">
                                      <div>
                                        OD (R): Sph {rx.sph_r || "-"} Cyl{" "}
                                        {rx.cyl_r || "-"}
                                      </div>
                                      <div>
                                        OS (L): Sph {rx.sph_l || "-"} Cyl{" "}
                                        {rx.cyl_l || "-"}
                                      </div>
                                    </div>
                                  ) : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">
                              Upload Prescription File
                            </label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/30 hover:border-accent/40 transition-all relative overflow-hidden bg-background">
                                {uploadingFile ? (
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Loader2 className="h-8 w-8 text-accent animate-spin mb-2" />
                                    <p className="text-sm font-medium text-muted-foreground">
                                      Uploading file...
                                    </p>
                                  </div>
                                ) : newPrescription.prescriptionUrl ? (
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <Check className="h-8 w-8 text-success mb-2" />
                                    <p className="text-sm font-medium text-foreground">
                                      File uploaded successfully
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                                      Uploaded Document
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-semibold text-foreground">
                                      Click to upload prescription
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      PNG, JPG, JPEG or PDF (max 5MB)
                                    </p>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                  disabled={uploadingFile}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="border border-border rounded-xl overflow-hidden bg-background">
                            <details className="group">
                              <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-medium text-sm text-foreground hover:bg-muted/30 transition-all">
                                Or, enter prescription values manually
                                (Optional)
                                <Plus className="h-4 w-4 text-muted-foreground group-open:rotate-45 transition-transform" />
                              </summary>
                              <div className="p-4 border-t border-border space-y-4 text-sm">
                                <div>
                                  <h4 className="font-semibold text-xs text-accent uppercase tracking-wider mb-2.5">
                                    Right Eye (OD)
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        SPH
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.sph_r}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            sph_r: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        CYL
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.cyl_r}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            cyl_r: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        AXIS
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={newPrescription.axis_r}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            axis_r: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        ADD
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.add_r}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            add_r: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-xs text-accent uppercase tracking-wider mb-2.5">
                                    Left Eye (OS)
                                  </h4>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        SPH
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.sph_l}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            sph_l: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        CYL
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.cyl_l}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            cyl_l: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        AXIS
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="0"
                                        value={newPrescription.axis_l}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            axis_l: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                        ADD
                                      </label>
                                      <input
                                        type="number"
                                        step="0.25"
                                        placeholder="0.00"
                                        value={newPrescription.add_l}
                                        onChange={(e) =>
                                          setNewPrescription({
                                            ...newPrescription,
                                            add_l: e.target.value,
                                          })
                                        }
                                        className="input-field py-1 px-2 text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="flex justify-start pt-1 pb-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewPrescription({
                                        ...newPrescription,
                                        sph_l: newPrescription.sph_r,
                                        cyl_l: newPrescription.cyl_r,
                                        axis_l: newPrescription.axis_r,
                                        add_l: newPrescription.add_r,
                                      });
                                    }}
                                    className="text-xs text-accent hover:underline flex items-center gap-1.5 font-medium bg-accent/5 px-3 py-1.5 rounded-lg border border-accent/15 transition-all hover:bg-accent/10"
                                  >
                                    Copy Right Eye (OD) values to Left Eye (OS)
                                  </button>
                                </div>

                                <div className="pt-2 border-t border-border/50">
                                  <div className="w-1/2">
                                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                                      PD (Pupillary Distance, mm)
                                    </label>
                                    <input
                                      type="number"
                                      placeholder="63"
                                      value={newPrescription.pd}
                                      onChange={(e) =>
                                        setNewPrescription({
                                          ...newPrescription,
                                          pd: e.target.value,
                                        })
                                      }
                                      className="input-field py-1 px-2 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </details>
                          </div>

                          <label className="flex items-start gap-2.5 text-xs text-muted-foreground select-none cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newPrescription.dpdpConsent}
                              onChange={(e) =>
                                setNewPrescription({
                                  ...newPrescription,
                                  dpdpConsent: e.target.checked,
                                })
                              }
                              className="mt-0.5 rounded border-border text-accent focus:ring-accent"
                            />
                            <span>
                              I consent to the secure storage and processing of
                              my prescription data by Kaanchwala in accordance
                              with the Digital Personal Data Protection (DPDP)
                              Act.
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                {(!hasPrescriptionItem || (user && !loadingUser)) && (
                  <button
                    onClick={() => {
                      if (hasPrescriptionItem && prescriptionMode === "new") {
                        if (
                          !newPrescription.prescriptionUrl &&
                          !newPrescription.sph_r &&
                          !newPrescription.sph_l
                        ) {
                          toast.error(
                            "Please upload a prescription file or enter values manually",
                          );
                          return;
                        }
                        if (!newPrescription.dpdpConsent) {
                          toast.error(
                            "You must consent to prescription data storage as per DPDP Act",
                          );
                          return;
                        }
                      }
                      setStep(2);
                    }}
                    className="btn-primary w-full mt-6"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="card p-6 space-y-5">
                  <h2 className="text-xl font-semibold">Payment Method</h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod("razorpay")}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === "razorpay"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "razorpay"
                            ? "border-accent"
                            : "border-border"
                        }`}
                      >
                        {paymentMethod === "razorpay" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Pay Online (Razorpay)</p>
                        <p className="text-sm text-muted-foreground">
                          Cards, UPI, Net Banking, Wallets
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        paymentMethod === "cod"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/30"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "border-accent"
                            : "border-border"
                        }`}
                      >
                        {paymentMethod === "cod" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when you receive
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="card p-6 space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5 text-accent" />
                    Discount Code
                  </h2>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) =>
                        setDiscountCode(e.target.value.toUpperCase())
                      }
                      className="input-field flex-1"
                      placeholder="Enter code"
                      disabled={!!discountInfo}
                    />
                    <button
                      onClick={handleApplyDiscount}
                      disabled={!!discountInfo || !discountCode}
                      className="btn-ghost"
                    >
                      Apply
                    </button>
                  </div>
                  {discountInfo && (
                    <p className="text-sm text-success flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      {discountInfo.code}: -{formatPrice(discountInfo.amount)}{" "}
                      applied
                    </p>
                  )}
                </div>

                {errors._form && (
                  <p className="text-sm text-destructive font-medium bg-destructive/10 border border-destructive/20 p-3 rounded-lg mb-4 text-center">
                    {errors._form[0]}
                  </p>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-accent w-full gap-2 text-base py-3.5"
                  id="place-order-button"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  {loading
                    ? "Processing..."
                    : `Place Order — ${formatPrice(total)}`}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                      {item.product.category === "sunglasses" ? (
                        <Sun className="h-6 w-6" />
                      ) : item.product.category === "contact_lenses" ? (
                        <Eye className="h-6 w-6" />
                      ) : (
                        <Glasses className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {item.product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.variant ? item.variant.color : ""} ×{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatPrice(
                        ((item.product.discount_price ??
                          item.product.base_price) +
                          item.lensAddOns.reduce((s, a) => s + a.price, 0)) *
                          item.quantity,
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span
                    className={shipping === 0 ? "text-success font-medium" : ""}
                  >
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <hr className="border-border" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}
