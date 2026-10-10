import Link from "next/link";
import { ArrowRight, ArrowUpRight, Brain, Calculator, CalendarDays, LineChart, Link2, Play, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingDemo } from "@/components/landing-demo";
import "./landing.css";

function Brand() {
  return <Link href="/" aria-label="Trading Journal home" className="tj-brand">
    <span className="tj-brand-icon"><LineChart size={18} strokeWidth={2} /></span>
    <span>Trading Journal</span>
  </Link>;
}

const features = [
  { number: "01", title: "Capture the setup", summary: "Save an idea quickly, even before your entry.", icon: Link2, details: ["Trade idea links", "Quick or guided logging", "Planned setups"] },
  { number: "02", title: "Size the risk", summary: "Use your rules and lot calculator before execution.", icon: Calculator, details: ["Forex lot calculator", "Trading rules", "Execution details"] },
  { number: "03", title: "Review the decision", summary: "Learn from emotions, wins, losses, and streaks.", icon: Brain, details: ["Mindset notes", "Trade reviews", "Daily and weekly debriefs"] },
  { number: "04", title: "See the progress", summary: "Connect your trades to a longer growth plan.", icon: CalendarDays, details: ["Calendar and reports", "Growth roadmap", "Journal coach"] },
];

export default function HomePage() {
  return <main className="landing tj-home">
    <div className="tj-home-photo" aria-hidden="true" />
    <header className="landing-header tj-header">
      <nav className="tj-nav" aria-label="Main navigation">
        <Brand />
        <div className="tj-nav-links"><a href="#preview">How it works</a><a href="#features">Features</a></div>
        <div className="tj-nav-actions">
          <ThemeToggle />
          <Link href="/login" className="tj-signin">Sign in</Link>
          <Link href="/signup" className="tj-nav-start">Get started <ArrowUpRight size={16} /></Link>
        </div>
      </nav>
    </header>

    <section className="tj-hero" aria-labelledby="tj-title">
      <div className="tj-hero-inner">
        <div className="tj-hero-copy">
          <span className="tj-eyebrow"><span /> YOUR TRADING PROCESS, IN ONE PLACE</span>
          <h1 id="tj-title">Turn trades<br />into <em>insight.</em></h1>
          <p>Plan the setup, record what happened, and understand the thinking behind every result.</p>
          <div className="tj-hero-actions">
            <Link href="/signup" className="tj-primary-link">Start your journal <ArrowRight size={18} /></Link>
            <a href="#features" className="tj-secondary-link">Explore features <ArrowUpRight size={16} /></a>
          </div>
          <div className="tj-hero-footnote"><span className="tj-footnote-line" /> Grow as you execute. Journal every trade.</div>
        </div>
        <div id="preview" className="tj-hero-preview"><LandingDemo /></div>
      </div>
    </section>

    <section id="features" className="tj-features" aria-labelledby="tj-features-title">
      <div className="tj-features-inner">
        <div className="tj-features-intro">
          <span className="tj-section-label">INSIDE THE JOURNAL / 04 PARTS OF THE PROCESS</span>
          <h2 id="tj-features-title">Built for the<br /><em>whole trade.</em></h2>
          <p>From the first idea to the lesson you carry into the next session.</p>
          <a href="/videos/trading-journal-guide.mp4" target="_blank" rel="noreferrer" className="tj-feature-tour"><Play size={14} fill="currentColor" /> Watch the walkthrough <ArrowUpRight size={15} /></a>
        </div>
        <div className="tj-feature-list">
          {features.map(({ number, title, summary, icon: Icon, details }) => <details key={number} className="tj-feature-item">
            <summary><span className="tj-feature-number">{number}</span><span className="tj-feature-icon"><Icon size={20} strokeWidth={1.8} /></span><span className="tj-feature-copy"><strong>{title}</strong><small>{summary}</small></span><span className="tj-feature-plus"><Plus size={17} /></span></summary>
            <div className="tj-feature-details">{details.map((detail) => <span key={detail}>{detail}</span>)}</div>
          </details>)}
        </div>
      </div>
    </section>

    <section className="tj-next-step" aria-label="Start journaling">
      <div><span>YOUR NEXT TRADE IS A START</span><h2>Build a record you can learn from.</h2></div>
      <div className="tj-next-actions">
        <a href="/videos/trading-journal-guide.mp4" target="_blank" rel="noreferrer" className="tj-video-link"><Play size={15} fill="currentColor" /> Watch the tour</a>
        <Link href="/signup" className="tj-bottom-cta">Create your journal <ArrowUpRight size={17} /></Link>
      </div>
    </section>

    <footer className="tj-footer">
      <Brand />
      <span>Grow as you execute. Journal every trade.</span>
      <div><Link href="/help">Help</Link><Link href="/legal/privacy">Privacy</Link><Link href="/legal/risk-disclosure">Risk disclosure</Link></div>
    </footer>
  </main>;
}
