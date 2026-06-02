"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  RefreshCw,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const redirect = searchParams.get("redirect") || "/";

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResend = async () => {
    if (!email || email === "your email") return;
    setResending(true);
    setResendStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      // To resend verification email in Supabase, we can call signUp again or resetPassword.
      // But actually Supabase auth provides a resend method:
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(`/register/success?redirect=${encodeURIComponent(redirect)}`)}`,
        },
      });

      if (error) {
        setResendStatus("error");
        setErrorMessage(error.message);
      } else {
        setResendStatus("success");
      }
    } catch (err: unknown) {
      setResendStatus("error");
      let msg = "An unexpected error occurred.";
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      }
      setErrorMessage(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="card p-8 text-center space-y-6">
      {/* Icon with a subtle pulse/micro-animation */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center relative animate-pulse">
          <Mail className="h-10 w-10 text-foreground" />
          <span className="absolute top-0 right-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </div>
      </div>

      {/* Main Copy */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          Confirm Your Account
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent an account confirmation email to:
        </p>
        <div className="inline-block px-3 py-1 bg-surface border border-border rounded-full text-sm font-semibold text-foreground font-mono">
          {email}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto mt-2">
          Please click the activation link inside the email to complete your
          registration and log in.
        </p>
      </div>

      {/* Resend Action */}
      <div className="pt-2 border-t border-border space-y-3">
        {resendStatus === "success" && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-950/20 dark:text-green-400 py-2 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            Verification email resent!
          </div>
        )}

        {resendStatus === "error" && (
          <div className="text-xs text-destructive bg-destructive/10 py-2 rounded-lg">
            {errorMessage || "Failed to resend. Please try again."}
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resending || email === "your email"}
          className="flex items-center justify-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors w-full font-medium"
        >
          {resending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          {resending ? "Resending..." : "Resend confirmation email"}
        </button>
      </div>

      {/* Navigation links */}
      <div className="flex flex-col gap-2 pt-2">
        <Link href="/login" className="btn-outline w-full">
          Back to Sign In
        </Link>
        <Link
          href="/register"
          className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Edit registration details
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <Suspense
          fallback={
            <div className="card p-8 flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          }
        >
          <ConfirmEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
