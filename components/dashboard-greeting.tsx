"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";
import { FormActionButton } from "@/components/form-action-button";
import { saveTimezoneAction } from "@/lib/profile/actions";
import { availableTimezones } from "@/lib/timezones";

export function DashboardGreeting({ fullName, savedTimezone }: { fullName: string | null; savedTimezone: string | null }) {
  const firstName = fullName?.trim().split(/\s+/)[0] || "Trader";
  const [now, setNow] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState(savedTimezone ?? "UTC");
  const [timezones, setTimezones] = useState([savedTimezone ?? "UTC"]);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const initial = savedTimezone ?? detected;
    setTimezone(initial);
    setTimezones(availableTimezones(initial, detected));
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, [savedTimezone]);

  const hour = now ? Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: timezone }).formatToParts(now).find((part) => part.type === "hour")?.value ?? 12) : null;
  const greeting = hour === null ? "Welcome back" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const localDate = now ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: timezone }).format(now) : "Your journal is ready for the next decision";
  const localTime = now ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: timezone }).format(now) : null;

  return <>
    <h1>{greeting}, {firstName}<span>.</span></h1>
    <p className="pulse-greeting-date">{localDate}{localTime ? ` · ${localTime} local time` : ""}</p>
    {now && <form action={saveTimezoneAction} className="pulse-timezone-form">
      <Clock3 aria-hidden="true" size={15} />
      <label className="sr-only" htmlFor="dashboard-timezone">Greeting timezone</label>
      <select id="dashboard-timezone" name="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} aria-label="Greeting timezone">
        {timezones.map((zone) => <option key={zone} value={zone}>{zone.replaceAll("_", " ")}</option>)}
      </select>
      {(timezone !== savedTimezone || !savedTimezone) && <FormActionButton pendingText="Saving…" className="pulse-timezone-save">Save timezone</FormActionButton>}
    </form>}
  </>;
}
