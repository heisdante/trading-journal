"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationFeedback() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname, search]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    function handleClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      const current = new URL(window.location.href);
      if (destination.origin !== current.origin || `${destination.pathname}${destination.search}` === `${current.pathname}${current.search}`) return;
      setPending(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setPending(false), 12000);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimeout(timeout);
    };
  }, []);

  return pending ? <div className="navigation-progress" role="progressbar" aria-label="Opening page" aria-valuetext="Loading" /> : null;
}
