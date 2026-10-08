"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    if (pending) return;
    setPending(true);
    setLogoutError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/login");
      router.refresh();
    } catch {
      setPending(false);
      setLogoutError("Could not sign out. Try again.");
    }
  }

  return (<>
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      aria-label={pending ? "Signing out" : "Log out"}
      className={`inline-flex h-10 items-center gap-2 rounded border border-terminal-line text-sm text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan disabled:cursor-wait disabled:opacity-60 ${compact ? "w-10 justify-center" : "px-3"}`}
      title="Log out"
    >
      <LogOut className="h-4 w-4" />
      {compact ? null : pending ? "Signing out…" : "Logout"}
    </button>
    {logoutError && <span role="alert" className="px-2 text-xs text-terminal-red">{logoutError}</span>}
  </>);
}
