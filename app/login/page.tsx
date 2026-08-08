"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { startLogin } = useAuth();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { userId } = await startLogin(login, password);
      const params = new URLSearchParams({ userId: String(userId) });
      router.push(`/verify-otp?${params.toString()}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't sign in. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brass">GCMS</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">Staff sign in</h1>
          <p className="mt-1 text-sm text-muted">For employee and admin accounts only.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-line bg-surface p-6 shadow-sm">
          <div>
            <label htmlFor="login" className="mb-1 block text-sm font-medium text-ink">
              Email or phone
            </label>
            <input
              id="login"
              type="text"
              required
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>

          {error && (
            <p className="rounded-md bg-brick/10 px-3 py-2 text-sm text-brick" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink-2 disabled:opacity-50"
          >
            {submitting ? "Sending code…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
