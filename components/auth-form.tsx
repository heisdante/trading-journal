import Link from "next/link";
import { ArrowRight, CheckCircle2, LineChart, ShieldCheck, Sparkles } from "lucide-react";
import { AuthMotion } from "@/components/auth-motion";

type AuthFormProps = {
  mode: "login";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
};

export function AuthForm({ action, mode, error, message }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <AuthMotion />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-terminal-line bg-terminal-panel/70 shadow-[0_32px_90px_rgba(0,0,0,0.35)] backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-visual relative hidden min-h-[620px] border-r border-terminal-line p-8 lg:flex lg:flex-col lg:justify-between" data-auth-reveal>
          <Link href="/" className="relative z-10 flex items-center gap-3 text-terminal-text">
            <span className="flex h-10 w-10 items-center justify-center border border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-cyan shadow-glow">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 border border-terminal-cyan/30 bg-terminal-cyan/10 px-3 py-2 font-mono text-xs uppercase text-terminal-cyan">
              <Sparkles className="h-4 w-4" />
              Secure journal session
            </p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight text-terminal-text">Pick up where your process left off.</h2>
            <p className="mt-4 text-sm leading-6 text-terminal-muted">Your trades, rules, reviews, and AI coaching context stay tied to your private account.</p>
          </div>
          <div className="relative z-10 grid gap-3">
            {["Private account workspace", "Rule and review history", "Performance evidence in R"].map((item) => (
              <div key={item} className="flex items-center gap-3 border border-terminal-line bg-terminal-bg/50 p-3 text-sm text-terminal-muted">
                <CheckCircle2 className="h-4 w-4 text-terminal-green" />
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="relative p-5 sm:p-8" data-auth-reveal>
          <Link href="/" className="mb-8 flex items-center gap-3 text-terminal-text lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center border border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-cyan">
              <LineChart className="h-5 w-5" />
            </span>
            <span className="font-semibold">Trading Journal</span>
          </Link>
          <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">{isLogin ? "auth / login" : "auth / signup"}</p>
          <h1 className="mt-2 text-3xl font-semibold text-terminal-text">
            {isLogin ? "Resume your session" : "Create your journal"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-terminal-muted">Sign in to review your trades, rules, and decision record.</p>
        </div>

        <form action={action} className="space-y-4">
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

          {error ? <p className="rounded border border-terminal-red/40 bg-terminal-red/10 p-3 text-sm text-terminal-red">{error}</p> : null}
          {message ? <p className="rounded border border-terminal-cyan/40 bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">{message}</p> : null}

          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300 hover:shadow-glow"
          >
            {isLogin ? "Log in" : "Sign up"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 flex items-start gap-2 border-t border-terminal-line pt-5 text-xs leading-5 text-terminal-muted">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-terminal-cyan" />
          Trading Journal does not place trades or provide signals. It keeps your review workflow private to your account.
        </div>

        <p className="mt-6 text-sm text-terminal-muted">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"} className="text-terminal-cyan hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
