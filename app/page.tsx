import Link from "next/link";
import {
  ArrowRight,
  BotMessageSquare,
  Check,
  CircleAlert,
  ClipboardCheck,
  DatabaseZap,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { HomepageMotion } from "@/components/homepage-motion";

const features = [
  { icon: Target, title: "Trade the plan", text: "Store the rules that define your edge, then review every documented trade against them." },
  { icon: LineChart, title: "See the real numbers", text: "R-multiples, win rate, risk-to-reward, drawdown, expectancy, and rolling trade series." },
  { icon: ClipboardCheck, title: "Track the behavior", text: "Capture FOMO, early exits, emotion, revenge trades, and the discipline behind each result." },
  { icon: DatabaseZap, title: "Bring your history", text: "Import CSV exports from MT4, MT5, and cTrader to establish a complete record faster." },
  { icon: BotMessageSquare, title: "Review with AI", text: "Use a private journal coach to investigate your process, not chase signals or predictions." },
  { icon: ShieldCheck, title: "Keep it yours", text: "Your journal, rules, reviews, and settings are isolated to your account." },
];

const faqs = [
  ["Is this a broker or signal service?", "No. Trading Journal is a private process and performance tool. It does not execute trades or provide market signals."],
  ["Can I start with my existing trade history?", "Yes. Export CSV history from MetaTrader 4, MetaTrader 5, or cTrader and import it into the journal."],
  ["What does the AI coach do?", "It reviews the journal data and rules you provide to surface process patterns and possible rule breaches. It does not make trade decisions for you."],
];

const reviewLoop = [
  ["01", "Document", "Capture the setup, entry, risk, result, and emotional context while the trade is still fresh."],
  ["02", "Review", "Compare each trade to your active rules and isolate the behavior that changed the outcome."],
  ["03", "Refine", "Use daily reviews and series analytics to reinforce the process that keeps showing up."],
];

function ProductPreview() {
  return (
    <div className="home-preview relative mx-auto w-full max-w-[660px]" data-reveal>
      <div className="absolute -inset-5 bg-terminal-cyan/10 blur-3xl" />
      <div className="relative overflow-hidden border border-terminal-cyan/35 bg-[#07111f]/95 p-3 shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur sm:p-4">
        <div className="scanline" />
        <div className="flex items-center justify-between border-b border-terminal-line pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-red" />
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-amber" />
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-green" />
          </div>
          <span className="font-mono text-[10px] uppercase text-terminal-muted">journal / dashboard</span>
          <span className="pulse-dot font-mono text-[10px] text-terminal-cyan">live</span>
        </div>
        <div className="grid gap-3 pt-3 sm:grid-cols-[1.28fr_0.72fr]">
          <div className="border border-terminal-line bg-terminal-panel p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase text-terminal-muted">equity / last 20</p>
                <p className="number mt-1 text-2xl font-semibold text-terminal-text">+12.4R</p>
              </div>
              <span className="rounded-sm border border-terminal-green/30 bg-terminal-green/10 px-2 py-1 text-[10px] text-terminal-green">process rising</span>
            </div>
            <svg viewBox="0 0 340 130" className="mt-4 h-28 w-full" role="img" aria-label="R-multiple equity curve">
              <path d="M0 120 H340 M0 84 H340 M0 48 H340 M0 12 H340" stroke="#1b3552" strokeDasharray="3 5" />
              <path className="equity-fill" d="M0 108 L30 92 L57 101 L86 73 L115 82 L143 48 L175 60 L208 31 L240 45 L273 18 L310 30 L340 8 V130 H0 Z" fill="url(#equityGradient)" />
              <path className="equity-line" d="M0 108 L30 92 L57 101 L86 73 L115 82 L143 48 L175 60 L208 31 L240 45 L273 18 L310 30 L340 8" fill="none" stroke="#35f29a" strokeWidth="3" />
              <defs>
                <linearGradient id="equityGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#35f29a" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#35f29a" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-terminal-muted">
              <span>-1.0R</span>
              <span>0R</span>
              <span>+3.0R</span>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="border border-terminal-line bg-terminal-panel p-3">
              <p className="font-mono text-[10px] uppercase text-terminal-muted">discipline</p>
              <p className="number mt-1 text-2xl font-semibold text-terminal-text">84<span className="text-sm text-terminal-muted">/100</span></p>
              <div className="mt-3 h-1.5 bg-terminal-line">
                <div className="score-bar h-full bg-terminal-cyan" />
              </div>
            </div>
            <div className="border border-terminal-line bg-terminal-panel p-3">
              <p className="font-mono text-[10px] uppercase text-terminal-muted">rule review</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-terminal-amber">
                <CircleAlert className="h-4 w-4" />1 item to inspect
              </div>
              <p className="mt-2 text-[11px] leading-4 text-terminal-muted">Early exit recorded against your 2R target rule.</p>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {[
            ["WIN RATE", "62.5%"],
            ["AVG R:R", "2.14:1"],
            ["FOMO", "2 / 20"],
          ].map(([label, value]) => (
            <div key={label} className="metric-tile border border-terminal-line p-3">
              <p className="font-mono text-[10px] text-terminal-muted">{label}</p>
              <p className="number mt-1 text-lg text-terminal-text">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="home-shell overflow-hidden text-terminal-text">
      <HomepageMotion />
      <nav className="relative z-20 mx-auto flex min-h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-cyan shadow-glow">
            <LineChart className="h-5 w-5" />
          </span>
          <span className="font-semibold">Trading Journal</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-terminal-muted md:flex">
          <a href="#features" className="transition hover:text-terminal-cyan">Features</a>
          <a href="#how-it-works" className="transition hover:text-terminal-cyan">How it works</a>
          <a href="#pricing" className="transition hover:text-terminal-cyan">Pricing</a>
          <a href="#about" className="transition hover:text-terminal-cyan">About</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="inline-flex h-11 items-center px-2 text-sm text-terminal-muted transition hover:text-terminal-text sm:px-3">Sign in</Link>
          <Link href="/signup" className="btn-primary inline-flex h-11 items-center gap-2 bg-terminal-cyan px-4 text-sm font-semibold text-terminal-bg transition hover:bg-cyan-300">
            Create account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <section className="hero-light relative mx-auto grid min-h-[calc(100dvh-80px)] max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div className="relative z-10" data-reveal>
          <div className="inline-flex items-center gap-2 border border-terminal-cyan/25 bg-terminal-cyan/10 px-3 py-2 font-mono text-xs uppercase text-terminal-cyan">
            <Radar className="h-4 w-4" />
            The trader&apos;s operating system
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold leading-tight text-terminal-text sm:text-5xl lg:text-6xl">
            Trading Journal
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-terminal-muted">
            Turn every execution, emotion, and rule into evidence for a more disciplined trading process.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary inline-flex h-12 items-center justify-center gap-2 bg-terminal-cyan px-5 font-semibold text-terminal-bg transition hover:bg-cyan-300">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="inline-flex h-12 items-center justify-center border border-terminal-line px-5 font-semibold text-terminal-text transition hover:border-terminal-cyan hover:text-terminal-cyan">
              Explore the journal
            </a>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-px border border-terminal-line bg-terminal-line">
            {[
              ["R", "Performance in risk units"],
              ["Rules", "Your process, made visible"],
              ["AI", "Review, not prediction"],
            ].map(([value, label]) => (
              <div key={value} className="bg-terminal-bg/90 p-4">
                <p className="number text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs leading-5 text-terminal-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <ProductPreview />
        <div className="ticker-strip absolute bottom-6 left-4 right-4 hidden overflow-hidden border-y border-terminal-line py-2 font-mono text-[11px] uppercase text-terminal-muted sm:block lg:left-8 lg:right-8">
          <div className="ticker-track flex min-w-max gap-8">
            <span>Process score +8.2%</span>
            <span>Rule drift flagged</span>
            <span>Average R:R 2.14:1</span>
            <span>Series review ready</span>
            <span>Process score +8.2%</span>
            <span>Rule drift flagged</span>
            <span>Average R:R 2.14:1</span>
            <span>Series review ready</span>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-terminal-line bg-terminal-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl" data-reveal>
            <p className="font-mono text-xs uppercase text-terminal-cyan">More than a trade log</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Build a record you can actually learn from.</h2>
          </div>
          <div className="mt-12 grid gap-px border border-terminal-line bg-terminal-line sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article key={feature.title} className="feature-cell bg-terminal-bg p-6" data-reveal style={{ transitionDelay: `${index * 45}ms` }}>
                <feature.icon className="h-5 w-5 text-terminal-cyan" />
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-terminal-muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="font-mono text-xs uppercase text-terminal-cyan">A simple review loop</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">The trade is only the beginning.</h2>
            <p className="mt-5 text-base leading-7 text-terminal-muted">A good journal does not just archive what happened. It makes the next decision clearer.</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {reviewLoop.map(([number, title, text], index) => (
              <li key={number} className="timeline-step border-t border-terminal-cyan/40 pt-5" data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
                <span className="font-mono text-sm text-terminal-cyan">{number}</span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-terminal-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="pricing" className="border-y border-terminal-line bg-terminal-panel/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
            <div>
              <p className="font-mono text-xs uppercase text-terminal-cyan">Pricing</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Start with your process.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-terminal-muted">Pricing is intentionally simple for now and will evolve as broker sync and coaching workflows deepen.</p>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              ["FREE", "Journal", "For building the habit.", "$0", "Manual trade logging", "Core performance stats", "/signup", "Create account"],
              ["PLANNED", "Trader", "For tighter feedback loops.", "TBD", "AI rule review", "Advanced series analysis", "#about", "Join the journey"],
              ["PLANNED", "Coach", "For shared accountability.", "TBD", "Broker connections", "Coach-ready reports", "#about", "Coming later"],
            ].map(([label, title, subtitle, price, itemA, itemB, href, cta], index) => (
              <div key={title} className={`price-panel border p-6 ${index === 1 ? "border-terminal-cyan bg-terminal-cyan/5" : "border-terminal-line"}`} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
                <p className={`font-mono text-xs ${index === 1 ? "text-terminal-cyan" : "text-terminal-muted"}`}>{label}</p>
                <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-terminal-muted">{subtitle}</p>
                <p className="number mt-7 text-3xl">{price}<span className="text-sm text-terminal-muted"> / month</span></p>
                <ul className="mt-7 space-y-3 text-sm text-terminal-muted">
                  <li className="flex gap-2"><Check className="h-4 w-4 text-terminal-green" />{itemA}</li>
                  <li className="flex gap-2"><Check className="h-4 w-4 text-terminal-green" />{itemB}</li>
                </ul>
                <Link href={href} className={`mt-8 inline-flex h-11 w-full items-center justify-center text-sm font-semibold transition ${index === 1 ? "bg-terminal-cyan text-terminal-bg hover:bg-cyan-300" : "border border-terminal-line hover:border-terminal-cyan hover:text-terminal-cyan"}`}>
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-terminal-line pb-20 lg:grid-cols-[1.15fr_0.85fr]" data-reveal>
          <div>
            <p className="font-mono text-xs uppercase text-terminal-cyan">About Trading Journal</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">Better trading is often less about finding more information and more about meeting your own process honestly.</h2>
          </div>
          <div className="text-base leading-7 text-terminal-muted">
            <p>Trading Journal is built for traders who want a private, evidence-based view of their decisions. We make room for the parts of a trade that a broker statement cannot show: intention, risk, discipline, and emotional state.</p>
            <p className="mt-4">The aim is not perfection. It is a clearer blueprint for the next hundred trades.</p>
          </div>
        </div>
        <div className="grid gap-0 divide-y divide-terminal-line lg:grid-cols-[0.85fr_1.15fr] lg:divide-x lg:divide-y-0">
          <div className="py-10 lg:pr-12" data-reveal>
            <p className="font-mono text-xs uppercase text-terminal-cyan">Questions</p>
            <h2 className="mt-3 text-2xl font-semibold">Before you begin</h2>
            <Link href="/signup" className="btn-primary mt-6 inline-flex h-11 items-center gap-2 bg-terminal-cyan px-4 text-sm font-semibold text-terminal-bg transition hover:bg-cyan-300">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="py-10 lg:pl-12">
            {faqs.map(([question, answer]) => (
              <div key={question} className="border-b border-terminal-line py-5 first:pt-0 last:border-b-0 last:pb-0" data-reveal>
                <h3 className="font-semibold">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-terminal-muted">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-terminal-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-terminal-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Trading Journal - Measure the process.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/login" className="hover:text-terminal-cyan">Sign in</Link>
            <Link href="/signup" className="hover:text-terminal-cyan">Create account</Link>
            <a href="#about" className="hover:text-terminal-cyan">About</a>
            <Link href="/help" className="hover:text-terminal-cyan">Help</Link>
            <Link href="/contact" className="hover:text-terminal-cyan">Contact</Link>
            <Link href="/legal/terms" className="hover:text-terminal-cyan">Terms</Link>
            <Link href="/legal/privacy" className="hover:text-terminal-cyan">Privacy</Link>
            <Link href="/legal/risk-disclosure" className="hover:text-terminal-cyan">Risk disclosure</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
