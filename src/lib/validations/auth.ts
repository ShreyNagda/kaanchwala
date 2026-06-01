import { z } from 'zod'

export const loginSchema = z.object({
 email: z.string().email('Enter a valid email'),
 password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
 full_name: z.string().min(2, 'Name is required'),
 email: z.string().email('Enter a valid email'),
 phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
 password: z.string().min(6, 'Password must be at least 6 characters'),
 confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
 message: 'Passwords do not match',
 path: ['confirmPassword'],
})

export const guestToAccountSchema = z.object({
 email: z.string().email(),
 phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
 password: z.string().min(6, 'Password must be at least 6 characters'),
 full_name: z.string().min(2, 'Name is required'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type GuestToAccountFormData = z.infer<typeof guestToAccountSchema>
