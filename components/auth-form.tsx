"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();

    const response = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    if (!isLogin && !response.data.session) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="terminal-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">{isLogin ? "auth / login" : "auth / signup"}</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">
            {isLogin ? "Resume your session" : "Create your journal"}
          </h1>
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

          {error ? <p className="rounded border border-terminal-red/40 bg-terminal-red/10 p-3 text-sm text-terminal-red">{error}</p> : null}
          {message ? <p className="rounded border border-terminal-cyan/40 bg-terminal-cyan/10 p-3 text-sm text-terminal-cyan">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Working..." : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-terminal-muted">
          {isLogin ? "No account yet?" : "Already have an account?"}{" "}
          <Link href={isLogin ? "/signup" : "/login"} className="text-terminal-cyan hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
