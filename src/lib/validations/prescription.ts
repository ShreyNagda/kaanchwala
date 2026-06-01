import { z } from 'zod'

const eyeSchema = z.object({
 sph: z.number().min(-20).max(20).nullable(),
 cyl: z.number().min(-10).max(10).nullable(),
 axis: z.number().int().min(0).max(180).nullable(),
 add: z.number().min(0).max(4).nullable(),
})

export const prescriptionSchema = z.object({
 right: eyeSchema,
 left: eyeSchema,
 pd: z.number().min(50).max(80).nullable(),
 dpdpConsent: z.literal(true, {
 message: 'You must consent to prescription data storage as per DPDP Act',
 }),
})

export const prescriptionUploadSchema = z.object({
 prescriptionUrl: z.string().url('Invalid prescription image URL'),
 dpdpConsent: z.literal(true, {
 message: 'You must consent to prescription data storage as per DPDP Act',
 }),
})

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>
export type PrescriptionUploadFormData = z.infer<typeof prescriptionUploadSchema>
