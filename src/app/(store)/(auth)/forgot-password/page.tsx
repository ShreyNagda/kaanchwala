"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        // Supabase will append ?code=...&type=recovery to this URL
        redirectTo: `${window.location.origin}/api/auth/callback?type=recovery`,
      },
    );

    setPending(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        {sent ? (
          <div className="card p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h2 className="font-semibold text-foreground">Check your inbox</h2>
            <p className="text-sm text-muted-foreground">
              We sent a password reset link to{" "}
              <span className="font-medium text-foreground">{email}</span>.
              The link expires in 1 hour.
            </p>
            <Link href="/login" className="btn-outline w-full mt-2">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-5">
            <div>
              <label
                htmlFor="reset-email"
                className="text-sm font-medium text-foreground block mb-1.5"
              >
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
                autoComplete="email"
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full gap-2"
              id="forgot-password-submit"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Sending…" : "Send Reset Link"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
