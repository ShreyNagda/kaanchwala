"use client";

import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RegisterForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [state, formAction, pending] = useActionState(signUp, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="card p-6 space-y-5">
      <input type="hidden" name="redirect" value={redirect} />

      <div>
        <label
          htmlFor="full_name"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          className="input-field"
          placeholder="John Doe"
          required
        />
        {state?.error?.full_name && (
          <p className="text-xs text-destructive mt-1">
            {state.error.full_name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input-field"
          placeholder="your@email.com"
          required
        />
        {state?.error?.email && (
          <p className="text-xs text-destructive mt-1">
            {state.error.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="input-field"
          placeholder="9876543210"
          required
        />
        {state?.error?.phone && (
          <p className="text-xs text-destructive mt-1">
            {state.error.phone[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="input-field pr-10"
            placeholder="Min 6 characters"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {state?.error?.password && (
          <p className="text-xs text-destructive mt-1">
            {state.error.password[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-foreground block mb-1.5"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="input-field"
          placeholder="Re-enter password"
          required
        />
        {state?.error?.confirmPassword && (
          <p className="text-xs text-destructive mt-1">
            {state.error.confirmPassword[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full gap-2"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Creating..." : "Create Account"}
      </button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="text-accent font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join Kaanchwala for exclusive benefits
          </p>
        </div>

        <Suspense
          fallback={
            <div className="card p-6 flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
