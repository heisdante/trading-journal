"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LineChart, ShieldCheck } from "lucide-react";
import { AuthMotion } from "@/components/auth-motion";
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
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <AuthMotion />
      <div className="auth-card grid w-full max-w-5xl overflow-hidden rounded-2xl bg-[#0d110e]/75 backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-visual relative hidden min-h-[620px] p-8 lg:flex lg:flex-col lg:justify-between" data-auth-reveal>
          <Link href="/" className="relative z-10 flex items-center gap-3 text-terminal-text">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/15 text-terminal-cyan">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div className="relative z-10 mt-auto max-w-md">
            <h2 className="text-4xl font-semibold leading-tight text-terminal-text">Start turning trades into evidence.</h2>
            <p className="mt-4 text-sm leading-6 text-white/70">A private space to reflect, build consistency, and grow with every trade.</p>
          </div>
        </section>

        <section className="relative flex flex-col p-5 sm:p-8 lg:min-h-[620px]" data-auth-reveal>
          <Link href="/" className="mb-8 flex items-center gap-3 text-terminal-text lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/10 text-terminal-cyan">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-terminal-text">Create your journal</h1>
            <p className="mt-1 text-sm text-terminal-muted">A clear record of every trade and lesson.</p>
          </div>

        <div className="mx-auto mt-8 w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-terminal-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              className="mt-2 h-12 w-full rounded-xl border-0 bg-white/[0.055] px-3 text-terminal-text outline-none transition placeholder:text-terminal-muted/60 focus-visible:ring-2 focus-visible:ring-terminal-cyan/60"
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
              className="mt-2 h-12 w-full rounded-xl border-0 bg-white/[0.055] px-3 text-terminal-text outline-none transition placeholder:text-terminal-muted/60 focus-visible:ring-2 focus-visible:ring-terminal-cyan/60"
              placeholder="••••••••"
            />
          </label>

          {signupError ? <p role="alert" className="rounded-lg bg-terminal-red/10 p-3 text-sm text-terminal-red">{signupError}</p> : null}
          {message ? <p role="status" className="rounded-lg bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">{message}</p> : null}
          {verifyMessage || message ? (
            <div role="status" className="rounded-lg bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">
              Check your email and click the verification link to activate your account.
            </div>
          ) : null}

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"
          >
            Create an account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 pt-5 text-xs leading-5 text-terminal-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-cyan" />
          Trading Journal is a review and accountability tool. It does not execute trades or provide market signals.
        </div>

        <p className="mt-6 text-sm text-terminal-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-terminal-cyan hover:underline">
            Log in
          </Link>
        </p>
        </div>
        </section>
      </div>
    </main>
  );
}
