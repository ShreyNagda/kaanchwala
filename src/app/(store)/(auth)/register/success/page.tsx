"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

const REDIRECT_DELAY = 5; // seconds

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push(redirectTo);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [redirectTo, router]);

  return (
    <div className="text-center space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-foreground" />
        </div>
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome to Kaanchwala
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          Your account has been created successfully. You now have access to
          order history, saved prescriptions, and exclusive member benefits.
        </p>
      </div>

      {/* Auto-redirect notice */}
      <div className="card-static rounded-xl p-4 bg-muted">
        <p className="text-sm text-muted-foreground">
          Redirecting you in{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {secondsLeft}s
          </span>
          …
        </p>
        {/* Thin progress bar */}
        <div className="mt-2 h-0.5 w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-foreground rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((REDIRECT_DELAY - secondsLeft) / REDIRECT_DELAY) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Manual CTA */}
      <Link
        href={redirectTo}
        className="btn-primary w-full gap-2"
        id="register-success-continue"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </Link>

      <Link
        href="/account"
        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Go to my account →
      </Link>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-sm px-4">
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
