import Link from "next/link";
import { BookOpenCheck, BrainCircuit, CircleHelp, FileUp, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/public-shell";

const topics = [
  { icon: BookOpenCheck, title: "Getting started", text: "Create an account, set your profile defaults, and log the first trade." },
  { icon: FileUp, title: "Imports", text: "Bring CSV history from MT4, MT5, and cTrader into the journal." },
  { icon: BrainCircuit, title: "AI coach and rules", text: "Learn how rule reviews and the journal coach use your recorded process." },
  { icon: ShieldCheck, title: "Account and privacy", text: "Update your profile, password, AI preference, and understand data isolation." },
];

export default function HelpPage() {
  return <PublicShell><p className="font-mono text-xs uppercase text-terminal-cyan">support / help center</p><h1 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-5xl">Get back to your process.</h1><p className="mt-5 max-w-2xl text-base leading-7 text-terminal-muted">Practical guidance for setting up, documenting, reviewing, and protecting your trading journal.</p><section className="mt-10 grid gap-px border border-terminal-line bg-terminal-line sm:grid-cols-2">{topics.map((topic) => <article key={topic.title} className="bg-terminal-bg p-6"><topic.icon className="h-5 w-5 text-terminal-cyan" /><h2 className="mt-5 text-lg font-semibold">{topic.title}</h2><p className="mt-2 text-sm leading-6 text-terminal-muted">{topic.text}</p></article>)}</section><section className="mt-12 border-t border-terminal-line pt-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs uppercase text-terminal-cyan">Need a hand?</p><h2 className="mt-2 text-2xl font-semibold">Contact support</h2></div><Link href="/contact" className="inline-flex h-11 items-center justify-center bg-terminal-cyan px-5 font-semibold text-terminal-bg hover:bg-cyan-300">Contact us</Link></div></section></PublicShell>;
}
