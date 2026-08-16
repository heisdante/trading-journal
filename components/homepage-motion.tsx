"use client";

import { useEffect } from "react";

export function HomepageMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      const handlePointerMove = (event: PointerEvent) => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      };

      window.addEventListener("pointermove", handlePointerMove, { passive: true });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.setAttribute("data-in-view", "true");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
      );

      document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        observer.disconnect();
      };
    }

    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.setAttribute("data-in-view", "true");
    });
  }, []);

  return null;
}
