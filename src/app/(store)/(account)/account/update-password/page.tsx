"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
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

    setDone(true);
    // Redirect to account after a short pause
    setTimeout(() => router.push("/account"), 2500);
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Set New Password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a strong password for your Kaanchwala account.
          </p>
        </div>

        {done ? (
          <div className="card p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h2 className="font-semibold text-foreground">Password updated!</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you to your account…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-5">
            {/* New password */}
            <div>
              <label
                htmlFor="new-password"
                className="text-sm font-medium text-foreground block mb-1.5"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
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
                  onClick={() => setShowPassword((v) => !v)}
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

            {/* Confirm */}
            <div>
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-foreground block mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Re-enter password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-primary w-full gap-2"
              id="update-password-submit"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {pending ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
