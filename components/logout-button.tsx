"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
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
      className="inline-flex h-10 items-center gap-2 rounded border border-terminal-line px-3 text-sm text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan"
      title="Log out"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
