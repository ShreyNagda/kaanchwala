import Razorpay from 'razorpay'
import crypto from 'crypto'

function getRazorpay() {
 return new Razorpay({
 key_id: process.env.RAZORPAY_KEY_ID!,
 key_secret: process.env.RAZORPAY_KEY_SECRET!,
 })
}

/**
 * Create a Razorpay order for checkout
 */
export async function createRazorpayOrder(params: {
 amount: number // in INR (not paise)
 receipt: string
 notes?: Record<string, string>
}) {
 const order = await getRazorpay().orders.create({
 amount: Math.round(params.amount * 100), // convert to paise
 currency: 'INR',
 receipt: params.receipt,
 notes: params.notes || {},
 })
 return order
}

/**
 * Verify Razorpay payment signature (client-side callback verification)
 */
export function verifyPaymentSignature(params: {
 razorpay_order_id: string
 razorpay_payment_id: string
 razorpay_signature: string
}): boolean {
 const body = params.razorpay_order_id + '|' + params.razorpay_payment_id
 const expectedSignature = crypto
 .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
 .update(body)
 .digest('hex')
 return expectedSignature === params.razorpay_signature
}

/**
 * Verify webhook signature from Razorpay
 */
export function verifyWebhookSignature(
 rawBody: string,
 signature: string
): boolean {
 const expectedSignature = crypto
 .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
 .update(rawBody)
 .digest('hex')
 return expectedSignature === signature
}

/**
 * Process a refund for prepaid orders
 */
export async function processRefund(paymentId: string, amount?: number) {
 const refund = await getRazorpay().payments.refund(paymentId, {
 ...(amount ? { amount: Math.round(amount * 100) } : {}),
 })
 return refund
}

