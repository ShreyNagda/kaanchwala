import { verifyWebhookSignature } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(request: Request) {
 try {
 const rawBody = await request.text()
 const signature = request.headers.get('x-razorpay-signature')

 if (!signature) {
 return new Response('Missing signature', { status: 400 })
 }

 // Verify webhook signature
 const isValid = verifyWebhookSignature(rawBody, signature)
 if (!isValid) {
 return new Response('Invalid signature', { status: 400 })
 }

 const event = JSON.parse(rawBody)

 // Handle payment.captured event
 if (event.event === 'payment.captured') {
 const payment = event.payload.payment.entity
 const orderId = payment.notes?.order_id

 if (!orderId) {
 return new Response('No order ID in payment notes', { status: 400 })
 }

 const db = createAdminClient()

 // Update order status
 await db
 .from('orders')
 .update({
 status: 'verified',
 razorpay_payment_id: payment.id,
 })
 .eq('id', orderId)

 // Send confirmation email
 const { data: order } = await db
 .from('orders')
 .select('*, order_items(*, product:products(*))')
 .eq('id', orderId)
 .single()

 if (order) {
 try {
 await sendOrderConfirmation(order, order.order_items)
 } catch {
 // Email failure should not return error to Razorpay
 }
 }
 }

 // Handle payment.failed event
 if (event.event === 'payment.failed') {
 const payment = event.payload.payment.entity
 const orderId = payment.notes?.order_id

 if (orderId) {
 const db = createAdminClient()
 await db
 .from('orders')
 .update({ status: 'cancelled' })
 .eq('id', orderId)
 }
 }

 // Respond quickly with 200
 return new Response(JSON.stringify({ status: 'ok' }), {
 status: 200,
 headers: { 'Content-Type': 'application/json' },
 })
 } catch (error) {
 console.error('Webhook error:', error)
 return new Response('Webhook processing error', { status: 500 })
 }
}
