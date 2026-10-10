import { PublicShell } from "@/components/public-shell";

export default function PrivacyPage() {
  return (
    <PublicShell>
      <article className="max-w-3xl">
        <p className="font-mono text-xs uppercase text-terminal-cyan">legal / privacy</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-5xl">Privacy Notice</h1>
        <p className="mt-5 text-sm text-terminal-muted">Last updated: October 10, 2026</p>
        <div className="mt-10 space-y-8 text-base leading-7 text-terminal-muted">
          <section>
            <h2 className="text-xl font-semibold text-terminal-text">Data we handle</h2>
            <p className="mt-3">The journal stores account details, trade documentation, rules, daily reviews, profile preferences, and information you choose to submit through the product.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-terminal-text">How it is used</h2>
            <p className="mt-3">Your data is used to operate the journal, calculate performance metrics, and provide the features you request. When AI features are enabled, relevant journal information is sent to the configured AI service, OpenRouter or OpenAI, to generate the requested draft or review. OpenRouter may route the request to an underlying model provider. Analysis drafts can include your notes and selected screenshots. Reference URLs are not opened by the AI feature.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-terminal-text">Access and security</h2>
            <p className="mt-3">Journal data is associated with your authenticated account. Access controls are designed to prevent other users from reading your records.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-terminal-text">Your choices</h2>
            <p className="mt-3">You can update profile preferences and turn off AI features in your profile. For privacy requests, contact support.</p>
          </section>
        </div>
      </article>
    </PublicShell>
  );
}
