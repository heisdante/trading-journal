"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

export function DashboardGreeting({ fullName, savedTimezone }: { fullName: string | null; savedTimezone: string | null }) {
  const firstName = fullName?.trim().split(/\s+/)[0] || "Trader";
  const [now, setNow] = useState<Date | null>(null);
  const timezone = savedTimezone ?? "UTC";

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = now ? Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: timezone }).formatToParts(now).find((part) => part.type === "hour")?.value ?? 12) : null;
  const greeting = hour === null ? "Welcome back" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const localDate = now ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: timezone }).format(now) : "Your journal is ready for the next decision";
  const localTime = now ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: timezone }).format(now) : null;

  return <>
    <h1>{greeting}, {firstName}<span>.</span></h1>
    <p className="pulse-greeting-date">{localDate}{localTime ? ` · ${localTime} local time` : ""}</p>
    <Link href="/profile" className="pulse-greeting-timezone"><Clock3 aria-hidden="true" size={14} /> {timezone.replaceAll("_", " ")} <span>· Change in Settings</span></Link>
  </>;
}
