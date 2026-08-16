"use client";

import { useEffect } from "react";

export function AuthMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll<HTMLElement>("[data-auth-reveal]").forEach((element, index) => {
      element.style.setProperty("--auth-delay", `${index * 60}ms`);
      element.dataset.authInView = "true";
    });

    if (reduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return null;
}
