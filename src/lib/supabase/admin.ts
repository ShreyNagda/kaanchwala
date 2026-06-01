import { createClient } from '@supabase/supabase-js'

/**
 * Admin client bypasses RLS using the service role key.
 * Only use in trusted server-side contexts (webhooks, admin actions).
 */
export function createAdminClient() {
 return createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.SUPABASE_SECRET_KEY!,
 {
 auth: {
 autoRefreshToken: false,
 persistSession: false,
 },
 }
 )
}
