"use client";

import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Diya } from "@/components/effects/diya";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { SceneProps } from "@/components/experience/experience";

export function Invitation({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    // Avoid a flash of hidden content before React resolves motion preferences.
    if (reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".invitation__overline", { opacity: 0, y: 22, duration: 0.8, delay: 0.25 })
      .from(".invitation__title", { opacity: 0, y: 48, filter: "blur(12px)", duration: 1.3 }, "-=0.34")
      .from(".invitation__copy", { opacity: 0, y: 24, duration: 0.85 }, "-=0.6")
      .from(".invitation__button", { opacity: 0, y: 18, scale: 0.96, duration: 0.85 }, "-=0.4")
      .from(".invitation__aside", { opacity: 0, duration: 1 }, "-=0.35");
  }, { scope: root, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <section className="scene invitation" ref={root}>
      <div className="invitation__orbit invitation__orbit--one" aria-hidden="true" />
      <div className="invitation__orbit invitation__orbit--two" aria-hidden="true" />
      <div className="invitation__content">
        <div className="invitation__light">
          <span className="invitation__light-ring" />
          <Diya />
        </div>
        <div className="invitation__overline"><Sparkles size={13} /> A PRIVATE LITTLE UNIVERSE <Sparkles size={13} /></div>
        <h1 className="invitation__title">
          Someone left a <em>little magic</em> for you tonight.
        </h1>
        <p className="invitation__copy">
          Kuch raatein bas khaas hoti hain. Aur kuch surprises... sirf ek special insaan ke liye.
        </p>
        <button className="gold-button invitation__button" type="button" onClick={() => { playChime(740); onNext(); }}>
          Discover your surprise <ArrowUpRight size={19} strokeWidth={1.8} />
        </button>
        <div className="invitation__aside">HEADPHONES RECOMMENDED &nbsp; · &nbsp; TAKE YOUR TIME</div>
      </div>
      <span className="invitation__corner invitation__corner--left" aria-hidden="true">✧</span>
      <span className="invitation__corner invitation__corner--right" aria-hidden="true">✧</span>
    </section>
  );
}
