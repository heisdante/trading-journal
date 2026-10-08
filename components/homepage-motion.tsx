"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomepageMotion() {
  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(".landing [data-reveal]", { clearProps: "all" });
      return;
    }

    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero-copy > *", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.09 })
      .from(".hero-window", { y: 38, x: 18, rotateY: -4, autoAlpha: 0, duration: 1.1 }, 0.2)
      .from(".hero-float-card", { y: 12, autoAlpha: 0, duration: 0.65 }, 0.75);

    gsap.utils.toArray<HTMLElement>(".landing [data-reveal]").forEach((element) => {
      if (element.closest(".hero-story")) return;
      gsap.from(element, {
        y: 32,
        autoAlpha: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    gsap.to(".hero-window", {
      y: 68,
      ease: "none",
      scrollTrigger: { trigger: ".hero-story", start: "top top", end: "bottom top", scrub: 0.7 },
    });

    gsap.utils.toArray<HTMLElement>(".landing .card-photo").forEach((element) => {
      gsap.to(element, {
        yPercent: -9,
        ease: "none",
        scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: 0.7 },
      });
    });

    ScrollTrigger.refresh();
  }, { scope: typeof document === "undefined" ? undefined : document.querySelector(".landing") ?? undefined });

  return null;
}
