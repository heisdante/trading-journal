"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label="Log out"
      className={`inline-flex h-10 items-center gap-2 rounded border border-terminal-line text-sm text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan ${compact ? "w-10 justify-center" : "px-3"}`}
      title="Log out"
    >
      <LogOut className="h-4 w-4" />
      {compact ? null : "Logout"}
    </button>
  );
}
