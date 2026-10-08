"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Clock3, Moon, SunMedium } from "lucide-react";

type Session = {
  name: string;
  city: string;
  timezone: string;
  openHour: number;
  closeHour: number;
};

const sessions: Session[] = [
  { name: "Asian", city: "Tokyo", timezone: "Asia/Tokyo", openHour: 9, closeHour: 18 },
  { name: "Frankfurt", city: "Frankfurt", timezone: "Europe/Berlin", openHour: 8, closeHour: 17 },
  { name: "London", city: "London", timezone: "Europe/London", openHour: 8, closeHour: 17 },
  { name: "New York", city: "New York", timezone: "America/New_York", openHour: 8, closeHour: 17 },
];

function partsFor(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(date);

  return {
    weekday: parts.find((part) => part.type === "weekday")?.value ?? "Mon",
    hour: Number(parts.find((part) => part.type === "hour")?.value ?? 0),
    minute: Number(parts.find((part) => part.type === "minute")?.value ?? 0),
    time: new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "numeric", minute: "2-digit", hour12: true }).format(date),
  };
}

function sessionState(session: Session, now: Date) {
  const parts = partsFor(now, session.timezone);
  const minutes = parts.hour * 60 + parts.minute;
  const open = session.openHour * 60;
  const close = session.closeHour * 60;
  const isWeekday = !["Sat", "Sun"].includes(parts.weekday);
  const isOpen = isWeekday && minutes >= open && minutes < close;
  const opensIn = isWeekday ? open - minutes : null;
  const closesIn = isOpen ? close - minutes : null;
  const preOpen = opensIn !== null && opensIn > 0 && opensIn <= 5;

  let label = "Closed";
  let detail = `Opens ${String(session.openHour).padStart(2, "0")}:00 ${session.city} time`;
  if (preOpen) {
    label = "Opening soon";
    detail = `Opens in ${opensIn} min`;
  } else if (isOpen) {
    label = "Open";
    detail = closesIn === 0 ? "Closing now" : `Closes in ${closesIn} min`;
  }

  return { ...parts, label, detail, isOpen, preOpen };
}

export function MarketSessionStatus({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const states = useMemo(() => sessions.map((session) => ({ session, state: sessionState(session, now) })), [now]);
  const activeCount = states.filter(({ state }) => state.isOpen).length;

  return (
    <section className={`terminal-panel app-chart-panel market-sessions rounded-lg p-4 ${compact ? "is-compact" : ""}`}>
      <div className="flex flex-col gap-3 border-b border-terminal-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-terminal-cyan">market / sessions</p>
          <h2 className="mt-1 text-xl font-semibold text-terminal-text">{compact ? "Market hours" : "Session clock"}</h2>
        </div>
        <span className="number rounded-sm border border-terminal-line bg-terminal-bg/70 px-2 py-1 text-xs text-terminal-muted">
          {activeCount} session{activeCount === 1 ? "" : "s"} open
        </span>
      </div>
      <div className="market-session-grid mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {states.map(({ session, state }) => (
          <article key={session.name} className={`market-session-card rounded border p-3 ${state.isOpen ? "border-terminal-green/40 bg-terminal-green/10" : state.preOpen ? "border-terminal-amber/50 bg-terminal-amber/10" : "border-terminal-line bg-terminal-bg/45"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-terminal-text">{session.name}</h3>
                <p className="mt-1 text-xs text-terminal-muted">{session.city} / {state.time}</p>
              </div>
              <span className={state.isOpen ? "text-terminal-green" : state.preOpen ? "text-terminal-amber" : "text-terminal-muted"}>
                {state.preOpen ? <Bell className="h-4 w-4" /> : state.isOpen ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </span>
            </div>
            <p className={`mt-4 font-mono text-xs uppercase ${state.isOpen ? "text-terminal-green" : state.preOpen ? "text-terminal-amber" : "text-terminal-muted"}`}>{state.label}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-terminal-muted"><Clock3 className="h-3.5 w-3.5" />{state.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
