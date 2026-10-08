"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  ".app-surface",
  ".terminal-panel",
  ".app-reminder",
  ".app-page-heading",
  "tbody tr",
  "form label",
].join(",");

export function AppMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    elements.forEach((element, index) => {
      element.dataset.appReveal = "true";
      element.style.setProperty("--reveal-delay", `${Math.min(index * 28, 220)}ms`);
    });

    if (reduceMotion) {
      elements.forEach((element) => {
        element.dataset.appInView = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-app-in-view", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
