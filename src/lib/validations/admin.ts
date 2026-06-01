import { z } from 'zod'

export const productSchema = z.object({
 title: z.string().min(2, 'Title is required'),
 description: z.string().optional(),
 base_price: z.number().min(0, 'Price must be positive'),
 discount_price: z.number().min(0).nullable().optional(),
 category: z.enum(['eyeglasses', 'sunglasses', 'contact_lenses']),
 is_premium: z.boolean().default(false),
 is_active: z.boolean().default(true),
 return_eligible: z.boolean().default(true),
})

export const variantSchema = z.object({
 color: z.string().min(1, 'Color is required'),
 sku: z.string().min(1, 'SKU is required'),
 stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
})

export const discountSchema = z.object({
 code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
 type: z.enum(['percentage', 'fixed']),
 value: z.number().min(0.01, 'Value must be positive'),
 min_order_amount: z.number().min(0).default(0),
 valid_from: z.string().datetime(),
 valid_to: z.string().datetime(),
 usage_limit: z.number().int().min(1).nullable().optional(),
})

export const orderStatusSchema = z.enum([
 'pending', 'verified', 'processing', 'shipped', 'delivered', 'cancelled',
])

export const trackingSchema = z.object({
 tracking_number: z.string().min(1, 'Tracking number is required'),
 courier: z.string().min(1, 'Courier name is required'),
})

export type ProductFormData = z.infer<typeof productSchema>
export type VariantFormData = z.infer<typeof variantSchema>
export type DiscountFormData = z.infer<typeof discountSchema>
