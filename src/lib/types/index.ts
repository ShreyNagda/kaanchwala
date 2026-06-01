// ===========================================
// Kaanchwala v2 — TypeScript Types
// ===========================================

export type UserRole = "customer" | "admin";
export type ProductCategory = "eyeglasses" | "sunglasses" | "contact_lenses";
export type OrderStatus =
  | "pending"
  | "verified"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PrescriptionStatus = "pending" | "approved" | "rejected";
export type DiscountType = "percentage" | "fixed";
export type ReturnStatus =
  | "none"
  | "requested"
  | "approved"
  | "refunded"
  | "exchanged";
export type PaymentMethod = "razorpay" | "cod";

// --- Database Row Types ---

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  base_price: number;
  discount_price: number | null;
  category: ProductCategory;
  is_premium: boolean;
  is_active: boolean;
  return_eligible: boolean;
  image_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface Variant {
  id: string;
  product_id: string;
  color: string;
  sku: string;
  stock_quantity: number;
  is_in_stock: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  prescriptions: Prescription[];
  id: string;
  customer_email: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  shipping_address: ShippingAddress;
  tracking_number: string | null;
  courier: string | null;
  return_status: ReturnStatus;
  discount_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  lens_add_ons: LensAddOn[];
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface Prescription {
  order: Order;
  profile: Profile;
  id: string;
  user_id: string | null;
  order_id: string | null;
  sph_r: number | null;
  cyl_r: number | null;
  axis_r: number | null;
  add_r: number | null;
  sph_l: number | null;
  cyl_l: number | null;
  axis_l: number | null;
  add_l: number | null;
  pd: number | null;
  prescription_url: string | null;
  status: PrescriptionStatus;
  dpdp_consent: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Discount {
  id: string;
  code: string;
  type: DiscountType;
  value: number;
  min_order_amount: number;
  valid_from: string;
  valid_to: string;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}

// --- App Types ---

export interface ShippingAddress {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface LensAddOn {
  name: string;
  price: number;
}

export const LENS_ADD_ONS: LensAddOn[] = [
  { name: "Blue-Cut Lens", price: 500 },
  { name: "Photochromic Lens", price: 800 },
];

export interface CartItem {
  id: string;
  product: Product;
  variant: Variant | null;
  lensAddOns: LensAddOn[];
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// --- Joined types for UI ---

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    product?: Product;
    variant?: Variant;
  })[];
  prescription?: Prescription;
}
