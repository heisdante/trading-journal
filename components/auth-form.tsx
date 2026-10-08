"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { ArrowRight, Eye, EyeOff, LineChart, Mail, ShieldCheck } from "lucide-react";
import { AuthMotion } from "@/components/auth-motion";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login";
  magicLinkAction: (formData: FormData) => Promise<void>;
  next?: string;
  error?: string;
  message?: string;
};

function LoginButton({ pending }: { pending: boolean }) {
  return <button disabled={pending} type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70">{pending ? "Signing in…" : "Sign in"}{!pending && <ArrowRight className="h-4 w-4" />}</button>;
}

function LinkButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded bg-white/[0.045] px-4 text-sm font-semibold text-terminal-text transition hover:bg-white/[0.08] hover:text-terminal-cyan disabled:cursor-wait disabled:opacity-70"><Mail className="h-4 w-4" />{pending ? "Sending link…" : "Email me a sign-in link"}</button>;
}

export function AuthForm({ magicLinkAction, next, error, message }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [loginError, setLoginError] = useState("");
  useEffect(() => {
    const savedEmail = window.localStorage.getItem("trading-journal-login-email");
    if (savedEmail) { setEmail(savedEmail); setRememberEmail(true); }
  }, []);
  function remember() {
    if (rememberEmail && email.trim()) window.localStorage.setItem("trading-journal-login-email", email.trim());
    else window.localStorage.removeItem("trading-journal-login-email");
  }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setLoginError("");
    remember();
    const formData = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      });
      if (signInError) {
        setLoginError(signInError.message);
        setPending(false);
        return;
      }
    } catch {
      setLoginError("Could not reach the sign-in service. Check your connection and try again.");
      setPending(false);
      return;
    }
    const destination = (next ?? "").trim();
    const safeDestination = destination.startsWith("/") && !destination.startsWith("//") && !destination.includes("\\") ? destination : "/dashboard";
    router.replace(safeDestination);
  }

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <AuthMotion />
      <div className="auth-card grid w-full max-w-5xl overflow-hidden rounded-2xl bg-[#0d110e]/75 backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-visual relative hidden min-h-[620px] p-8 lg:flex lg:flex-col lg:justify-between" data-auth-reveal>
          <Link href="/" className="relative z-10 flex items-center gap-3 text-terminal-text"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/15 text-terminal-cyan"><LineChart className="h-5 w-5" /></span><span className="font-semibold">Trading Journal</span></Link>
          <div className="relative z-10 mt-auto max-w-md"><h2 className="text-4xl font-semibold leading-tight text-terminal-text">Pick up where your process left off.</h2><p className="mt-4 text-sm leading-6 text-white/70">Your trades, rules, reviews, and coaching context stay tied to your private account.</p></div>
        </section>

        <section className="relative p-5 sm:p-8" data-auth-reveal>
          <Link href="/" className="mb-7 flex items-center gap-3 text-terminal-text lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-terminal-cyan/10 text-terminal-cyan"><LineChart className="h-5 w-5" /></span><span className="font-semibold">Trading Journal</span></Link>
          <div className="mb-6"><h1 className="text-3xl font-semibold text-terminal-text">Welcome back</h1><p className="mt-2 text-sm leading-6 text-terminal-muted">Sign in to pick up your review where you left off.</p></div>

          {(loginError || error) && <p role="alert" className="mb-4 rounded-lg bg-terminal-red/10 p-3 text-sm text-terminal-red">{loginError || error}</p>}
          {message && <p role="status" className="mb-4 rounded-lg bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">{message}</p>}

          <form onSubmit={signIn} className="space-y-4">
            <input type="hidden" name="next" value={next ?? ""} />
            <label className="block"><span className="text-sm text-terminal-muted">Email</span><input name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border-0 bg-white/[0.055] px-3 text-terminal-text outline-none transition placeholder:text-terminal-muted/60 focus-visible:ring-2 focus-visible:ring-terminal-cyan/60" placeholder="you@example.com" /></label>
            <label className="block"><span className="text-sm text-terminal-muted">Password</span><span className="relative mt-2 block"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={6} className="h-12 w-full rounded-xl border-0 bg-white/[0.055] px-3 pr-12 text-terminal-text outline-none transition placeholder:text-terminal-muted/60 focus-visible:ring-2 focus-visible:ring-terminal-cyan/60" placeholder="Your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-terminal-muted hover:text-terminal-cyan">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
            <label className="flex min-h-8 items-center gap-2 text-sm text-terminal-muted"><input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} className="h-4 w-4 accent-cyan-300" />Remember my email on this device</label>
            <LoginButton pending={pending} />
          </form>

          <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-terminal-line" /><span className="font-mono text-[10px] uppercase text-terminal-muted">or skip the password</span><span className="h-px flex-1 bg-terminal-line" /></div>
          <form action={magicLinkAction} onSubmit={remember}><input type="hidden" name="email" value={email} /><input type="hidden" name="next" value={next ?? ""} /><LinkButton /></form>
          <p className="mt-2 text-center text-xs leading-5 text-terminal-muted">We’ll email a one-time sign-in link. It won’t create a new account.</p>

          <div className="mt-6 flex items-start gap-2 pt-5 text-xs leading-5 text-terminal-muted"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-cyan" />Trading Journal does not place trades or provide signals. Your account keeps your review workflow private.</div>
          <p className="mt-5 text-sm text-terminal-muted">New to Trading Journal? <Link href="/signup" className="font-semibold text-terminal-cyan hover:underline">Create an account</Link></p>
        </section>
      </div>
    </main>
  );
}
