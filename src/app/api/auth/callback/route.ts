import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If this is a password-reset flow, send to the update-password page
      const type = searchParams.get("type");
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/change-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to the appropriate error page
  const type = searchParams.get("type");
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/change-password?error=link_expired`);
  }

  let confirmUrl = `${origin}/register/confirm?error=link_expired`;
  if (next) {
    try {
      const nextUrl = new URL(next, origin);
      const email = nextUrl.searchParams.get("email");
      const redirectParam = nextUrl.searchParams.get("redirect");
      if (email) confirmUrl += `&email=${encodeURIComponent(email)}`;
      if (redirectParam) confirmUrl += `&redirect=${encodeURIComponent(redirectParam)}`;
    } catch (e) {
      // ignore parsing errors
    }
  }
  return NextResponse.redirect(confirmUrl);
}
