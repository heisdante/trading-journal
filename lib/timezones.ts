const fallbackTimezones = [
  "Africa/Lagos", "Africa/Johannesburg", "America/Chicago", "America/Los_Angeles",
  "America/New_York", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore",
  "Asia/Tokyo", "Australia/Sydney", "Europe/London", "Europe/Paris",
];

export function availableTimezones(...extra: Array<string | null | undefined>) {
  const supported = (Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.("timeZone") ?? fallbackTimezones;
  return Array.from(new Set(["UTC", ...supported, ...extra.filter((zone): zone is string => Boolean(zone))])).sort((a, b) => a.localeCompare(b));
}
