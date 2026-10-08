"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LineChart, ShieldCheck } from "lucide-react";
import { AuthMotion } from "@/components/auth-motion";
import { AuthProcessChart } from "@/components/auth-process-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

type SignupFormProps = {
  error?: string;
  message?: string;
};

export function SignupForm({ error, message }: SignupFormProps) {
  const router = useRouter();
  const [verifyMessage, setVerifyMessage] = useState(Boolean(message));
  const [signupError, setSignupError] = useState<string | null>(error ?? null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSignupError(null);
    setVerifyMessage(false);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { trading_journal_tour: "pending" },
      },
    });

    if (signUpError) {
      setSignupError(signUpError.message);
      return;
    }

    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setVerifyMessage(true);
    router.replace(`/signup?message=${encodeURIComponent("Check your email and click the verification link to activate your account.")}`);
  }

  return (
    <main className="login-screen auth-shell grid min-h-screen gap-3 p-3 xl:h-dvh xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_minmax(400px,31%)] xl:grid-rows-[minmax(0,1fr)]">
      <AuthMotion />
      <section className="login-art-panel relative hidden min-h-[310px] flex-col overflow-hidden rounded-[18px] p-6 sm:min-h-[370px] sm:p-10 md:flex xl:min-h-0 xl:p-10 2xl:p-14" data-auth-reveal>
        <div className="login-art-eyebrow relative z-10 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#8ce0ad]">
          <span>Trading journal</span><span className="text-[#546458]">/</span><span className="text-[#89958b]">Process workspace</span>
        </div>

        <div className="login-art-body relative z-10 grid flex-1 items-end gap-8 pt-10 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] xl:items-center xl:gap-7 2xl:gap-12">
          <div className="login-art-copy max-w-[570px]">
            <h2 className="text-[clamp(2.1rem,4vw,4.5rem)] font-semibold leading-[1.02] tracking-[-.06em]"><span className="block text-[#a8b4ab]">Start turning trades</span> <span className="block text-white">into evidence.</span></h2>
            <p className="mt-5 max-w-[410px] text-sm leading-6 text-[#c5d1c7]">A private space to reflect, build consistency, and grow with every trade.</p>
            <Link href="/" className="mt-7 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-4 text-sm font-semibold text-[#101510] transition hover:bg-[#e6f3e9]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#8ce0ad] text-[#0b120e]"><LineChart className="h-4 w-4" /></span>Explore the journal<ArrowRight className="h-4 w-4 text-[#365842]" /></Link>
          </div>

          <AuthProcessChart />
        </div>

        <div className="relative z-10 mt-8 hidden items-center gap-3 font-mono text-[10px] text-[#a0afa2] xl:flex"><span className="font-semibold text-[#e1eee4]">TRADE JOURNAL</span><span className="h-px w-9 bg-[#728d78]"/><span>Learn from the process</span></div>
      </section>

      <section className="login-panel relative flex min-h-[620px] flex-col rounded-[18px] px-6 py-6 text-[#f4f1e8] sm:px-10 sm:py-8 xl:min-h-0 xl:overflow-y-auto xl:px-11" data-auth-reveal>
        <div className="flex items-center justify-between gap-3"><Link href="/" className="auth-brand flex items-center gap-2.5 text-sm font-semibold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#1d2b21] text-[#8ce0ad]"><LineChart className="h-4 w-4" /></span>Trading Journal</Link><ThemeToggle /></div>
        <div className="login-form-content mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center py-8">
          <div className="mb-7 text-center"><h1 className="text-[32px] font-semibold tracking-[-.055em]">Create your journal.</h1><p className="mt-2 text-xs text-[#8e9b91]">Build a clear record of every trade and lesson.</p></div>
          {signupError && <p role="alert" className="mb-4 rounded-xl bg-[#3a211e] px-3 py-3 text-sm text-[#ffb1a4]">{signupError}</p>}
          {(verifyMessage || message) && <p role="status" className="mb-4 rounded-xl bg-[#1b2b20] px-3 py-3 text-sm text-[#a7e6ba]">Check your email and click the verification link to activate your account.</p>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block"><span className="text-[11px] text-[#8e9b91]">Email address</span><input name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required className="mt-1.5 h-12 w-full rounded-xl border-0 bg-[#1a201b] px-3 text-sm text-[#eef3ee] outline-none placeholder:text-[#68736a] focus-visible:ring-2 focus-visible:ring-[#8ce0ad]/60" placeholder="you@example.com" /></label>
            <label className="block"><span className="text-[11px] text-[#8e9b91]">Password</span><span className="relative mt-1.5 block"><input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={6} className="h-12 w-full rounded-xl border-0 bg-[#1a201b] px-3 pr-12 text-sm text-[#eef3ee] outline-none placeholder:text-[#68736a] focus-visible:ring-2 focus-visible:ring-[#8ce0ad]/60" placeholder="Create a password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8e9b91] hover:text-[#8ce0ad]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span></label>
            <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#8ce0ad] px-4 font-semibold text-[#0b120e] transition hover:bg-[#a5edbd]">Create an account <ArrowRight className="h-4 w-4" /></button>
          </form>

          <div className="mt-5 flex items-start gap-2 text-[10px] leading-5 text-[#77837a]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8e9b91]" />Your journal stays private. Trading Journal does not execute trades or provide signals.</div>
          <p className="mt-5 text-center text-xs text-[#8e9b91]">Already have an account? <Link href="/login" className="font-semibold text-[#8ce0ad] hover:text-[#b0ebc2]">Sign in</Link></p>
        </div>
        <p className="mt-auto pt-3 text-[9px] leading-4 text-[#647067]">By continuing, you agree to our <Link href="/legal/terms" className="underline underline-offset-2 hover:text-[#9aa69d]">Terms of Service</Link> and <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-[#9aa69d]">Privacy Policy</Link>.</p>
      </section>
    </main>
  );
}
