"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, LockKeyhole, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LetterAtmosphere } from "@/components/effects/letter-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

type LetterState = "sealed" | "opening" | "open";

export function HiddenLetter({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const [state, setState] = useState<LetterState>("sealed");
  const isOpen = state === "open";

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".letter-v2__kicker", { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .65 }, .1)
      .fromTo(".letter-v2__title", { autoAlpha: 0, y: 26, filter: "blur(7px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", clearProps: "filter", duration: .94,
      }, .22)
      .fromTo(".letter-v2__subtitle", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .65 }, .56)
      .fromTo(".letter-v2__envelope-stage", { autoAlpha: 0, y: 32, scale: .89 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 1.25, ease: "back.out(1.15)",
      }, .60)
      .fromTo(".letter-v2__hint", { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: .75 }, 1.24);
  }, { scope: root });

  useEffect(() => {
    if (!isOpen) return;
    // Focus the opened note so keyboard and assistive-technology users
    // understand that the interactive envelope was replaced by readable text.
    const frame = window.requestAnimationFrame(() => contentRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const unseal = () => {
    if (state !== "sealed") return;
    setState("opening");
    playChime(840);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timerRef.current = window.setTimeout(() => {
      setState("open");
      timerRef.current = null;
    }, reduced ? 0 : 1080);
  };

  return (
    <section
      className={"scene letter-scene letter-v2 letter-v2--" + state}
      ref={root}
      aria-label="The Hidden Letter"
    >
      <LetterAtmosphere />
      <div className="letter-v2__header">
        <span className="eyebrow letter-v2__kicker"><Sparkles size={14} aria-hidden="true"/> CHAPTER FOUR / THE HIDDEN LETTER</span>
        <h1 className="letter-v2__title">Some things are <em>better handwritten.</em></h1>
        <p className="letter-v2__subtitle">Kuch baatein postcards mein nahi, sirf dil mein hoti hain.</p>
      </div>

      {!isOpen ? (
        <div className="letter-v2__envelope-stage">
          <div className="letter-v2__halo" aria-hidden="true"/>
          <div className="letter-v2__ornament letter-v2__ornament--top" aria-hidden="true">✦ ✧ ✦</div>
          <button
            type="button"
            className="letter-v2__envelope"
            aria-label="Open the letter"
            aria-disabled={state === "opening"}
            onClick={unseal}
          >
            <span className="letter-v2__envelope-shadow" aria-hidden="true"/>
            <span className="letter-v2__envelope-body" aria-hidden="true"/>
            <span className="letter-v2__envelope-fold-left" aria-hidden="true"/>
            <span className="letter-v2__envelope-fold-right" aria-hidden="true"/>
            <span className="letter-v2__envelope-flap" aria-hidden="true"/>
            <span className="letter-v2__envelope-inner" aria-hidden="true">
              <Heart size={28} strokeWidth={1.15}/>
            </span>
            <span className="letter-v2__wax-seal" aria-hidden="true"><Heart size={23} fill="currentColor" strokeWidth={1.1}/></span>
            <span className="letter-v2__ribbon letter-v2__ribbon--vertical" aria-hidden="true"/>
            <span className="letter-v2__ribbon letter-v2__ribbon--horizontal" aria-hidden="true"/>
            <span className="letter-v2__shine" aria-hidden="true"/>
          </button>
          <p className="letter-v2__hint" role="status">
            {state === "opening" ? "Unsealing a little bit of magic..." : "TAP THE WAX SEAL TO UNFOLD"}
          </p>
          <div className="letter-v2__ornament letter-v2__ornament--bottom" aria-hidden="true">✧</div>
        </div>
      ) : (
        <div className="letter-v2__paper-wrap">
          <div className="letter-v2__paper-spark letter-v2__paper-spark--one" aria-hidden="true">✦</div>
          <div className="letter-v2__paper-spark letter-v2__paper-spark--two" aria-hidden="true">✧</div>
          <div
            className="letter-v2__paper"
            ref={contentRef}
            tabIndex={-1}
            role="region"
            aria-label="Your personal Diwali letter from Ayush"
          >
            <div className="letter-v2__paper-border" aria-hidden="true"/>
            <div className="letter-v2__paper-top"><span>✦</span> A LITTLE NOTE FROM THE HEART <span>✦</span></div>
            <p className="letter-v2__salutation">For someone who makes ordinary days special,</p>
            <div className="letter-v2__paper-copy">
              <p>Diwali pe har jagah lights lagti hain, but kuch log bina kisi light ke bhi din bright kar dete hain.</p>
              <p>Tum unhi special logon mein se ho.</p>
              <p>Bas ek chhoti si wish: tumhari smile kabhi kam na ho, aur har naya din tumhare liye kuch beautiful lekar aaye.</p>
              <p>Waise... ek last surprise abhi baaki hai.</p>
            </div>
            <span className="letter-v2__signature">With a little magic,<strong>Ayush</strong></span>
            <div className="letter-v2__paper-divider" aria-hidden="true">✧ ✦ ✧</div>
            <button className="gold-button letter-v2__continue" type="button" onClick={onNext}>
              There&apos;s one more thing <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
      <p className="letter-v2__footer" aria-hidden="true">SOME WORDS SHINE BRIGHTER THAN FIREWORKS</p>
    </section>
  );
}
