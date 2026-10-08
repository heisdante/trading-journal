"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LineChart, ShieldCheck, Sparkles } from "lucide-react";
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
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-terminal-line bg-terminal-panel/70 shadow-[0_32px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-visual relative hidden min-h-[620px] border-r border-terminal-line p-8 lg:flex lg:flex-col lg:justify-between" data-auth-reveal>
          <Link href="/" className="relative z-10 flex items-center gap-3 text-terminal-text">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/15 text-terminal-cyan">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-terminal-cyan/15 px-3 py-2 font-mono text-xs uppercase text-terminal-cyan">
              <Sparkles className="h-4 w-4" />
              Build the habit
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-terminal-text">Start turning trades into evidence.</h2>
            <p className="mt-4 text-sm leading-6 text-terminal-muted">Create a private workspace for your executions, emotions, rules, reviews, and performance patterns.</p>
          </div>
          <div className="relative z-10 grid gap-3">
            {["Manual trade logging", "Daily and weekly review loops", "Private performance dashboard"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-3 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-terminal-green" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="relative p-5 sm:p-8" data-auth-reveal>
          <Link href="/" className="mb-8 flex items-center gap-3 text-terminal-text lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/15 text-terminal-cyan">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div className="mb-8">
            <p className="font-mono text-xs uppercase text-terminal-cyan">auth / signup</p>
            <h1 className="mt-2 text-3xl font-semibold text-terminal-text">Create your journal</h1>
            <p className="mt-3 text-sm leading-6 text-terminal-muted">Open a private trading workspace and verify your email to activate it.</p>
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
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300 hover:shadow-glow"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 border-t border-terminal-line pt-5 text-xs leading-5 text-terminal-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-cyan" />
          Trading Journal is a review and accountability tool. It does not execute trades or provide market signals.
        </div>

        <p className="mt-6 text-sm text-terminal-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-terminal-cyan hover:underline">
            Log in
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
