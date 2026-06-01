"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendPromotionalEmail } from "@/lib/email";
import { logAdminAction, getAdminLogs } from "@/lib/logging";
import { requireAdmin } from "./admin";

export interface PromotionUser {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: string;
  created_at: string;
  isCustomer: boolean;
}

/**
 * Fetch promotion targets (merged users + customers)
 */
export async function getPromotionUsers(): Promise<PromotionUser[]> {
  await requireAdmin();
  const db = createAdminClient();

  try {
    // 1. Fetch Auth Users
    const {
      data: { users: authUsers },
      error: authError,
    } = await db.auth.admin.listUsers();
    if (authError) throw authError;

    // 2. Fetch Profiles
    const { data: profiles } = await db
      .from("profiles")
      .select("id, role, full_name, phone");

    // 3. Fetch unique customer emails from Orders to tag who is a customer
    const { data: orders } = await db
      .from("orders")
      .select("customer_email, user_id, shipping_address");

    const customerEmails = new Set(
      orders?.map((o) => o.customer_email.toLowerCase()) || [],
    );
    const customerUserIds = new Set(
      orders?.map((o) => o.user_id).filter(Boolean) || [],
    );

    const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

    // Merge Auth Users with Profiles
    const mergedUsers: PromotionUser[] = authUsers.map((user) => {
      const profile = profileMap.get(user.id);
      const email = user.email || "";
      const isCustomer =
        customerUserIds.has(user.id) || customerEmails.has(email.toLowerCase());

      return {
        id: user.id,
        email,
        phone: profile?.phone || user.phone || "",
        fullName:
          profile?.full_name || user.user_metadata?.full_name || "Guest User",
        role: profile?.role || "customer",
        created_at: user.created_at,
        isCustomer,
      };
    });

    // Also include any guest checkouts from Orders that aren't in Auth Users
    const registeredEmails = new Set(
      mergedUsers.map((u) => u.email.toLowerCase()),
    );
    const guests: PromotionUser[] = [];

    if (orders) {
      const guestMap = new Map<
        string,
        { email: string; phone?: string; name?: string }
      >();
      orders.forEach((o) => {
        const email = o.customer_email.toLowerCase();
        if (!registeredEmails.has(email) && !guestMap.has(email)) {
          let name = "Guest Customer";
          let phone = "";
          try {
            const addr =
              typeof o.shipping_address === "string"
                ? JSON.parse(o.shipping_address)
                : o.shipping_address;
            if (addr?.name) name = addr.name;
            if (addr?.phone) phone = addr.phone;
          } catch (err) {
            console.log(err);
          }

          guestMap.set(email, { email, phone, name });
        }
      });

      guestMap.forEach((guest, email) => {
        guests.push({
          id: `guest_${email}`,
          email: guest.email,
          phone: guest.phone || "",
          fullName: guest.name || "Guest Customer",
          role: "customer",
          created_at: new Date().toISOString(), // Fallback
          isCustomer: true,
        });
      });
    }

    return [...mergedUsers, ...guests];
  } catch (err) {
    console.error("Error fetching promotional user list:", err);
    return [];
  }
}

/**
 * Dispatch promotional campaigns via Email or WhatsApp
 */
export async function sendPromotionalCampaign(data: {
  channel: "email" | "whatsapp";
  targetGroup: "all" | "customers" | "custom";
  selectedUserIds?: string[];
  subject?: string;
  heading: string;
  content: string;
}) {
  await requireAdmin();
  const { channel, targetGroup, selectedUserIds, subject, heading, content } =
    data;

  const users = await getPromotionUsers();
  let targets: PromotionUser[] = [];

  if (targetGroup === "all") {
    targets = users;
  } else if (targetGroup === "customers") {
    targets = users.filter((u) => u.isCustomer);
  } else if (targetGroup === "custom" && selectedUserIds) {
    const idSet = new Set(selectedUserIds);
    targets = users.filter((u) => idSet.has(u.id));
  }

  if (targets.length === 0) {
    return { error: "No target users found for this selection." };
  }

  let sentCount = 0;
  const errors: string[] = [];

  if (channel === "email") {
    // Send email using Resend helper
    const mailSubject = subject || "Special Offer from Kaanchwala";
    for (const target of targets) {
      if (!target.email) continue;
      try {
        await sendPromotionalEmail(target.email, mailSubject, heading, content);
        sentCount++;
      } catch (err: unknown) {
        errors.push(`${target.email}: ${err}`);
      }
    }
  } else {
    // WhatsApp Campaign Simulation
    for (const target of targets) {
      if (!target.phone) continue;
      // Simulated delay / dispatch
      console.log(
        `[WHATSAPP CAMPAIGN SIMULATION] To: ${target.phone} | Msg: ${heading} - ${content}`,
      );
      sentCount++;
    }
  }

  // Audit Log the Campaign
  await logAdminAction("send_promotional_campaign", {
    channel,
    targetGroup,
    targetCount: targets.length,
    sentCount,
    heading,
    subject: subject || null,
    errors: errors.length > 0 ? errors : undefined,
  });

  return { success: true, sentCount, errorCount: errors.length };
}

/**
 * Get promo campaign logs
 */
export async function getPromotionHistory() {
  await requireAdmin();
  const allLogs = await getAdminLogs();
  return allLogs.filter((log) => log.action === "send_promotional_campaign");
}
