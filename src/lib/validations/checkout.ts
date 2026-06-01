import { z } from 'zod'

export const shippingAddressSchema = z.object({
 full_name: z.string().min(2, 'Name is required'),
 phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
 line1: z.string().min(5, 'Address line 1 is required'),
 line2: z.string().optional(),
 city: z.string().min(2, 'City is required'),
 state: z.string().min(2, 'State is required'),
 pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
})

export const checkoutSchema = z.object({
 email: z.string().email('Enter a valid email address'),
 address: shippingAddressSchema,
 paymentMethod: z.enum(['razorpay', 'cod']),
 discountCode: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>
