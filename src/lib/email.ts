import { Resend } from "resend";
import { formatPrice } from "./utils";
import type { Order, OrderItem, Product } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM_EMAIL = "Kaanchwala <orders@kaanchwala.com>";

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(
  order: Order,
  items: (OrderItem & { product?: Product })[],
) {
  const itemsHtml = items
    .map(
      (item) => `
 <tr>
 <td style="padding: 12px; border-bottom: 1px solid #f0e6d6;">
 ${item.product?.title || "Product"}
 </td>
 <td style="padding: 12px; border-bottom: 1px solid #f0e6d6; text-align: center;">
 ${item.quantity}
 </td>
 <td style="padding: 12px; border-bottom: 1px solid #f0e6d6; text-align: right;">
 ${formatPrice(item.unit_price)}
 </td>
 </tr>`,
    )
    .join("");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [order.customer_email],
    subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
 <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fffdf8; padding: 32px; border-radius: 12px;">
 <h1 style="color: #1a1612; font-size: 24px; margin-bottom: 8px;">Thank you for your order!</h1>
 <p style="color: #6b5e50; margin-bottom: 24px;">Order #${order.id.slice(0, 8).toUpperCase()} has been confirmed.</p>

 <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
 <thead>
 <tr style="background: #f7f0e6;">
 <th style="padding: 12px; text-align: left; color: #8b7355;">Item</th>
 <th style="padding: 12px; text-align: center; color: #8b7355;">Qty</th>
 <th style="padding: 12px; text-align: right; color: #8b7355;">Price</th>
 </tr>
 </thead>
 <tbody>${itemsHtml}</tbody>
 </table>

 <div style="background: #f7f0e6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
 <span style="color: #6b5e50;">Subtotal</span>
 <span style="color: #1a1612;">${formatPrice(order.subtotal)}</span>
 </div>
 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
 <span style="color: #6b5e50;">Shipping</span>
 <span style="color: #1a1612;">${order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)}</span>
 </div>
 ${
   order.discount_amount > 0
     ? `
 <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
 <span style="color: #6b5e50;">Discount</span>
 <span style="color: #2d8a4e;">-${formatPrice(order.discount_amount)}</span>
 </div>`
     : ""
 }
 <hr style="border: none; border-top: 1px solid #d4c5a9; margin: 12px 0;" />
 <div style="display: flex; justify-content: space-between;">
 <strong style="color: #1a1612; font-size: 18px;">Total</strong>
 <strong style="color: #1a1612; font-size: 18px;">${formatPrice(order.total)}</strong>
 </div>
 </div>

 <p style="color: #6b5e50; font-size: 14px;">
 Payment: ${order.payment_method === "cod" ? "Cash on Delivery" : "Paid via Razorpay"}<br/>
 You can track your order at ${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}
 </p>

 <p style="color: #a89880; font-size: 12px; margin-top: 32px; text-align: center;">
 Kaanchwala — Premium Eyewear
 </p>
 </div>
 `,
  });
}

/**
 * Send prescription received notification
 */
export async function sendPrescriptionReceived(email: string, orderId: string) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [email],
    subject: "Prescription Received — Kaanchwala",
    html: `
 <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fffdf8; padding: 32px; border-radius: 12px;">
 <h1 style="color: #1a1612; font-size: 24px;">Prescription Received</h1>
 <p style="color: #6b5e50;">
 We've received your prescription for order #${orderId.slice(0, 8).toUpperCase()}.
 Our team will review it and you'll be notified once it's verified.
 </p>
 <p style="color: #a89880; font-size: 12px; margin-top: 32px; text-align: center;">
 Kaanchwala — Premium Eyewear
 </p>
 </div>
 `,
  });
}

/**
 * Send order shipped email with tracking info
 */
export async function sendOrderShipped(order: Order) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [order.customer_email],
    subject: `Order Shipped — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #fffdf8; padding: 32px; border-radius: 12px;">
  <h1 style="color: #1a1612; font-size: 24px;">Your order is on its way! 🚀</h1>
  <p style="color: #6b5e50; margin-bottom: 24px;">
  Order #${order.id.slice(0, 8).toUpperCase()} has been shipped.
  </p>

  <div style="background: #f7f0e6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
  <p style="margin: 0 0 8px 0; color: #6b5e50;"><strong>Courier:</strong> ${order.courier || "N/A"}</p>
  <p style="margin: 0; color: #6b5e50;"><strong>Tracking Number:</strong> ${order.tracking_number || "N/A"}</p>
  </div>

  <a href="${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}"
  style="display: inline-block; background: #8b7355; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
  Track Your Order
  </a>

  <p style="color: #a89880; font-size: 12px; margin-top: 32px; text-align: center;">
  Kaanchwala — Premium Eyewear
  </p>
  </div>
  `,
  });
}

/**
 * Send a promotional campaign email to a customer
 */
export async function sendPromotionalEmail(
  email: string,
  subject: string,
  heading: string,
  content: string,
) {
  await resend.emails.send({
    from: "Kaanchwala Offers <offers@kaanchwala.com>",
    to: [email],
    subject: subject,
    html: `
      <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #fffdf8; padding: 40px 32px; border-radius: 12px; border: 1px solid #ebdcc5;">
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 300; letter-spacing: 6px; font-family: Georgia, serif; color: #1a1612; text-transform: uppercase;">KAANCHWALA</span>
          <div style="font-size: 9px; letter-spacing: 2px; color: #8b7355; text-transform: uppercase; margin-top: 4px; font-weight: 600;">Boutique Eyewear</div>
        </div>

        <h1 style="color: #1a1612; font-size: 22px; font-weight: 400; line-height: 1.4; margin-bottom: 20px; text-align: center; font-family: Georgia, serif;">
          ${heading}
        </h1>

        <div style="color: #4a3e3d; font-size: 15px; line-height: 1.7; margin-bottom: 32px; font-weight: 300;">
          ${content.replace(/\n/g, "<br/>")}
        </div>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/products"
             style="display: inline-block; background: #1a1612; color: #fffdf8; padding: 14px 36px; border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; transition: background 0.3s ease;">
            Explore Catalog
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #ebdcc5; margin: 32px 0;" />

        <p style="color: #a89880; font-size: 11px; text-align: center; margin: 0; font-weight: 300;">
          This is a promotional message sent by Kaanchwala Boutique Eyewear.<br/>
          South Extension II, New Delhi • Gopal Nagar, Bhiwandi, Maharashtra
        </p>
      </div>
    `,
  });
}
