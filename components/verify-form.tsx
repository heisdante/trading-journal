"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email") ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get("email") ?? "").trim();
    const token = String(formData.get("token") ?? "").trim();
    const supabase = createClient();

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: submittedEmail,
      token,
      type: "signup",
    });

    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="terminal-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">auth / verify</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Enter your verification code</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-terminal-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-terminal-muted">Verification code</span>
            <input
              name="token"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className="number mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
              placeholder="123456"
            />
          </label>

          {error ? <p className="rounded border border-terminal-red/40 bg-terminal-red/10 p-3 text-sm text-terminal-red">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>

        <p className="mt-6 text-sm text-terminal-muted">
          Already verified?{" "}
          <Link href="/login" className="text-terminal-cyan hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
