import Link from "next/link";

type AuthFormProps = {
  mode: "login";
  action: (formData: FormData) => Promise<void>;
  error?: string;
  message?: string;
};

export function AuthForm({ action, mode, error, message }: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="terminal-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">{isLogin ? "auth / login" : "auth / signup"}</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">
            {isLogin ? "Resume your session" : "Create your journal"}
          </h1>
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
            className="h-11 w-full rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"
          >
            {isLogin ? "Log in" : "Sign up"}
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
