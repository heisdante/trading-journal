"use client";

import { useFormStatus } from "react-dom";

export function FormActionButton({ children, pendingText = "Saving…", className }: { children: React.ReactNode; pendingText?: string; className: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-live="polite" className={`${className} disabled:cursor-wait disabled:opacity-60`}>{pending ? pendingText : children}</button>;
}
