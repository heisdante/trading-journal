"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SignupFormProps = {
  error?: string;
  message?: string;
};

export function SignupForm({ error, message }: SignupFormProps) {
  const router = useRouter();
  const [verifyMessage, setVerifyMessage] = useState(Boolean(message));
  const [signupError, setSignupError] = useState<string | null>(error ?? null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupError(null);
    setVerifyMessage(false);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setSignupError(signUpError.message);
      return;
    }

    setVerifyMessage(true);
    router.replace(`/signup?message=${encodeURIComponent("Check your email and click the verification link to activate your account.")}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="terminal-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">auth / signup</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Create your journal</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-terminal-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-terminal-muted">Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
              placeholder="••••••••"
            />
          </label>

          {signupError ? <p className="rounded border border-terminal-red/40 bg-terminal-red/10 p-3 text-sm text-terminal-red">{signupError}</p> : null}
          {message ? <p className="rounded border border-terminal-cyan/40 bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">{message}</p> : null}
          {verifyMessage || message ? (
            <div className="rounded border border-terminal-cyan/40 bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">
              Check your email and click the verification link to activate your account.
            </div>
          ) : null}

          <button
            type="submit"
            className="h-11 w-full rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"
          >
            Sign up
          </button>
        </form>

        <p className="mt-6 text-sm text-terminal-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-terminal-cyan hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
