import Link from "next/link";
import { ArrowRight, ArrowUpRight, LineChart, Play } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingDemo } from "@/components/landing-demo";
import "./landing.css";

function Brand() {
  return <Link href="/" aria-label="Trading Journal home" className="tj-brand">
    <span className="tj-brand-icon"><LineChart size={18} strokeWidth={2} /></span>
    <span>Trading Journal</span>
  </Link>;
}

export default function HomePage() {
  return <main className="landing tj-home">
    <div className="tj-home-photo" aria-hidden="true" />
    <header className="landing-header tj-header">
      <nav className="tj-nav" aria-label="Main navigation">
        <Brand />
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
          <span className="tj-eyebrow"><span /> THE TRADING JOURNAL FOR YOUR NEXT LEVEL</span>
          <h1 id="tj-title">Trade with<br /><em>intention.</em></h1>
          <p>Capture the setup. Review the decision. Grow with every trade.</p>
          <div className="tj-hero-actions">
            <Link href="/signup" className="tj-primary-link">Start your journal <ArrowRight size={18} /></Link>
            <a href="#preview" className="tj-secondary-link">Explore the journal <ArrowUpRight size={16} /></a>
          </div>
          <div className="tj-hero-footnote"><span className="tj-footnote-line" /> Plan · Execute · Reflect</div>
        </div>
        <div id="preview" className="tj-hero-preview"><LandingDemo /></div>
      </div>
    </section>

    <section className="tj-next-step" aria-label="Start journaling">
      <div><span>START SIMPLE</span><h2>One trade at a time.</h2></div>
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
