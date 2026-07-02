import Link from "next/link";

type VerifyFormProps = {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  email?: string;
};

export function VerifyForm({ action, error, email = "" }: VerifyFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="terminal-panel w-full max-w-md rounded-lg p-6">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-terminal-cyan">auth / verify</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Enter your verification code</h1>
        </div>

        <form action={action} className="space-y-4">
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
            className="h-11 w-full rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"
          >
            Verify and continue
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
