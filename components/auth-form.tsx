"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LineChart, ShieldCheck } from "lucide-react";
import { AuthMotion } from "@/components/auth-motion";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  next?: string;
  error?: string;
  message?: string;
};

function LoginButton({ pending }: { pending: boolean }) {
  return <button disabled={pending} type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ffcc32] px-4 font-semibold text-[#17140b] transition hover:bg-[#f2bd21] disabled:cursor-wait disabled:opacity-70">{pending ? "Signing in…" : "Sign in"}{!pending && <ArrowRight className="h-4 w-4" />}</button>;
}

export function AuthForm({ next, error, message }: AuthFormProps) {
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
    <main className="login-screen auth-shell grid min-h-screen gap-3 p-3 lg:h-dvh lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(390px,25vw)] lg:grid-rows-[minmax(0,1fr)]">
      <AuthMotion />
      <section className="login-art-panel relative hidden overflow-hidden rounded-[18px] p-8 lg:flex lg:min-h-0 lg:flex-col lg:p-12 xl:p-14" data-auth-reveal>
        <div className="login-art-dots absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#96720e]">
          <span>Trading journal</span><span className="text-[#c6bfa8]">/</span><span>Execution &amp; review</span>
        </div>

        <div className="relative z-10 mt-12 max-w-[540px]">
          <h2 className="max-w-[11ch] text-5xl font-semibold leading-[.98] tracking-[-.065em] text-[#181712] xl:text-6xl">Trade with focus. <span className="text-[#98720d]">Grow</span> with every review.</h2>
          <p className="mt-6 max-w-[380px] text-sm leading-6 text-[#716d60]">Build a clearer picture of your decisions, your discipline, and the lessons behind every outcome.</p>
          <Link href="/" className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-full bg-[#171612] px-4 text-sm font-semibold text-[#f5f2e8] transition hover:bg-[#2b2922]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#ffcc32] text-[#17140b]"><LineChart className="h-4 w-4" /></span>Explore the journal<ArrowRight className="h-4 w-4 text-[#ffcc32]" /></Link>
        </div>

        <div className="login-coin-art absolute" aria-hidden="true"><span className="login-mini-coin">£<b>$</b></span><span className="login-dollar-coin">$</span><span className="login-euro-coin">€</span><span className="login-coin-arrow">↗</span></div>

        <div className="relative z-10 mt-auto flex items-center gap-3 pt-10 font-mono text-[10px] text-[#777365]"><span className="font-semibold text-[#292820]">01</span><span className="h-px w-9 bg-[#292820]"/><span className="h-px w-5 bg-[#c9c3b0]"/><span className="h-px w-5 bg-[#c9c3b0]"/><span>04</span></div>
      </section>

      <section className="login-panel relative flex min-h-[calc(100dvh-24px)] flex-col rounded-[18px] px-6 py-6 text-[#f4f1e8] sm:px-10 sm:py-8 lg:min-h-0 lg:overflow-y-auto lg:px-11" data-auth-reveal>
        <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ffcc32] text-[#17140b]"><LineChart className="h-4 w-4" /></span>Trading Journal</Link>
        <div className="mt-12 sm:mt-16 lg:mt-[clamp(38px,8vh,72px)]"><h1 className="text-[32px] font-semibold tracking-[-.055em]">Welcome back.</h1><p className="mt-2 text-xs text-[#8c877c]">Sign in to pick up right where you left off.</p></div>

        <div className="mx-auto mt-9 w-full max-w-[390px] lg:mt-auto lg:pb-[clamp(20px,4vh,36px)] lg:pt-8">
          {(loginError || error) && <p role="alert" className="mb-4 rounded-xl bg-[#5d2822] px-3 py-3 text-sm text-[#ffb1a4]">{loginError || error}</p>}
          {message && <p role="status" className="mb-4 rounded-xl bg-[#302b1c] px-3 py-3 text-sm text-[#f0d783]">{message}</p>}

          <form onSubmit={signIn} className="space-y-3">
            <input type="hidden" name="next" value={next ?? ""} />
            <label className="block"><span className="text-[11px] text-[#aaa498]">Email address</span><input name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 h-12 w-full rounded-xl border-0 bg-[#1d1b17] px-3 text-sm text-[#f4f1e8] outline-none placeholder:text-[#68645b] focus-visible:ring-2 focus-visible:ring-[#ffcc32]/60" placeholder="you@example.com" /></label>
            <label className="block"><span className="text-[11px] text-[#aaa498]">Password</span><span className="relative mt-1.5 block"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={6} className="h-12 w-full rounded-xl border-0 bg-[#1d1b17] px-3 pr-12 text-sm text-[#f4f1e8] outline-none placeholder:text-[#68645b] focus-visible:ring-2 focus-visible:ring-[#ffcc32]/60" placeholder="Your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8c877c] hover:text-[#ffcc32]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
            <label className="flex min-h-7 items-center gap-2 text-xs text-[#aaa498]"><input type="checkbox" checked={rememberEmail} onChange={(event) => setRememberEmail(event.target.checked)} className="h-3.5 w-3.5 accent-[#ffcc32]" />Remember my email on this device</label>
            <LoginButton pending={pending} />
          </form>

          <div className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#777268]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#aaa498]" />Your journal stays private. Trading Journal does not execute trades or provide signals.</div>
          <p className="mt-5 text-center text-xs text-[#8c877c]">New to Trading Journal? <Link href="/signup" className="font-semibold text-[#ffcc32] hover:text-[#ffe38b]">Create an account</Link></p>
        </div>
        <p className="mt-auto pt-3 text-[9px] leading-4 text-[#666159]">By continuing, you agree to our <Link href="/legal/terms" className="underline underline-offset-2 hover:text-[#aaa498]">Terms of Service</Link> and <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-[#aaa498]">Privacy Policy</Link>.</p>
      </section>
    </main>
  );
}
