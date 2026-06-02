"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ChangePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  };

  if (success) {
    return (
      <div className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-foreground" />
          </div>
        </div>
        <h2 className="font-semibold text-foreground text-lg">Password Changed Successfully</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been updated. You will be redirected to the login page shortly to sign in with your new credentials.
        </p>
        <Link href="/login" className="btn-primary w-full mt-2">
          Back to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pr-10"
            placeholder="Min 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          placeholder="Re-enter password"
          required
          autoComplete="new-password"
        />
      </div>

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full gap-2"
        id="change-password-submit"
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Change Password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter and confirm your new password below.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="card p-6 flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          }
        >
          <ChangePasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
