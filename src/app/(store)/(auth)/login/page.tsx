"use client";

import { useActionState, useState, Suspense } from "react";
import { signIn } from "@/lib/actions/auth";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const [state, formAction, pending] = useActionState(signIn, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="card p-6 space-y-5">
      <input type="hidden" name="redirect" value={redirect} />

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
            placeholder="••••••••"
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

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full gap-2"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-sm text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-accent font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your Kaanchwala account
          </p>
        </div>

        <Suspense
          fallback={
            <div className="card p-6 flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
