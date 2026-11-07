"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, KeyRound, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Diya } from "@/components/effects/diya";
import { DiyaGardenAtmosphere } from "@/components/effects/diya-garden-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

const REQUIRED_DIYAS = 3;

/** Five placements are deliberately separated for small-screen accessibility. */
const lamps = [
  { x: 19, y: 50, delay: 0 },
  { x: 50, y: 27, delay: -1.1 },
  { x: 81, y: 50, delay: -0.6 },
  { x: 34, y: 77, delay: -1.7 },
  { x: 67, y: 77, delay: -0.9 },
] as const;

export function LostDiyas({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const [lit, setLit] = useState<number[]>([]);
  const completed = lit.length === REQUIRED_DIYAS;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .fromTo(".diya-garden__kicker", { autoAlpha: 0, y: 16 }, {
        autoAlpha: 1, y: 0, duration: 0.7,
      }, 0.05)
      .fromTo(".diya-garden__title", { autoAlpha: 0, y: 25, filter: "blur(8px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", clearProps: "filter", duration: 0.95,
      }, 0.20)
      .fromTo(".diya-garden__description", { autoAlpha: 0, y: 12 }, {
        autoAlpha: 1, y: 0, duration: 0.7,
      }, 0.58)
      .fromTo(".diya-garden__world", { autoAlpha: 0, y: 17 }, {
        autoAlpha: 1, y: 0, duration: 1.1,
      }, 0.42)
      .fromTo(".diya-garden__lamp-figure", { autoAlpha: 0, scale: 0.72, y: 18 }, {
        autoAlpha: 1, scale: 1, y: 0, duration: 0.85, stagger: 0.115,
        ease: "back.out(1.4)", clearProps: "transform",
      }, 0.93)
      .fromTo(".diya-garden__controls", { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: 0.75,
      }, 1.1);
  }, { scope: root });

  const light = (index: number) => {
    if (lit.includes(index) || completed) return;
    setLit((current) => {
      if (current.length >= REQUIRED_DIYAS || current.includes(index)) return current;
      return [...current, index];
    });
    playChime(525 + lit.length * 145);
  };

  return (
    <section className="scene puzzle-scene diya-garden" ref={root} aria-label="The Lost Diyas puzzle">
      <div className="diya-garden__header">
        <span className="eyebrow diya-garden__kicker">
          <span className="diya-garden__eyebrow-star">✦</span>
          CHAPTER ONE / THE LOST DIYAS
        </span>
        <h1 className="diya-garden__title">
          Wake the sleeping <em>garden.</em>
        </h1>
        <p className="diya-garden__description">
          Kuch roshniyaan bas kisi ke aane ka intezaar karti hain.
          <br className="diya-garden__description-break" />
          <span> Tap any three diyas and watch this place come alive.</span>
        </p>
      </div>

      <div
        className={"puzzle-world diya-garden__world" + (completed ? " diya-garden__world--complete" : "")}
        role="group"
        aria-label="Light any three diyas"
        style={{ "--garden-glow": String(0.09 + Math.min(3, lit.length) * 0.16) } as CSSProperties}
      >
        <DiyaGardenAtmosphere />

        <div className="diya-garden__scene-border" aria-hidden="true" />
        <div className="diya-garden__overline" aria-hidden="true">
          <span>✧</span><span>THE GARDEN OF LITTLE LIGHTS</span><span>✧</span>
        </div>

        {lamps.map((lamp, index) => {
          const isLit = lit.includes(index);
          return (
            <button
              type="button"
              key={index}
              onClick={() => light(index)}
              disabled={isLit || completed}
              className={"diya-garden__lamp" + (isLit ? " diya-garden__lamp--lit" : "")}
              style={{
                left: lamp.x + "%",
                top: lamp.y + "%",
                "--float-delay": lamp.delay + "s",
              } as CSSProperties}
              aria-label={"Diya " + (index + 1) + (isLit ? " lit" : " unlit")}
              aria-pressed={isLit}
            >
              <span className="diya-garden__lamp-figure">
                <span className="diya-garden__pedestal" />
                <span className="diya-garden__lamp-aura" />
                <Diya small lit={isLit} />
                {isLit && <span className="diya-garden__flame-spark" aria-hidden="true">✦</span>}
              </span>
              <span className="diya-garden__lamp-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}

        {lit.map((index) => {
          const lamp = lamps[index];
          return (
            <span
              className="diya-garden__butterfly"
              key={"butterfly-" + index}
              style={{
                left: lamp.x + "%",
                top: Math.max(5, lamp.y - 15) + "%",
                "--butterfly-delay": index * 0.25 + "s",
              } as CSSProperties}
              aria-hidden="true"
            >
              <span className="diya-garden__butterfly-wing diya-garden__butterfly-wing--left" />
              <span className="diya-garden__butterfly-wing diya-garden__butterfly-wing--right" />
            </span>
          );
        })}

        {completed && (
          <div className="diya-garden__completion" aria-hidden="true">
            <div className="diya-garden__relic-halo" />
            <div className="diya-garden__relic">
              <Sparkles className="diya-garden__relic-spark" size={24} strokeWidth={1.3} />
              <KeyRound size={40} strokeWidth={1.15} />
            </div>
            <div className="diya-garden__relic-caption">THE GATE IS OPEN</div>
          </div>
        )}

        <div className="diya-garden__waterline" aria-hidden="true" />
        <div className="diya-garden__corner diya-garden__corner--left" aria-hidden="true">✧</div>
        <div className="diya-garden__corner diya-garden__corner--right" aria-hidden="true">✧</div>
      </div>

      <div className="diya-garden__controls">
        <div className="diya-garden__progress" role="status" aria-live="polite" aria-atomic="true">
          <span className="diya-garden__progress-copy">
            {completed ? "You found the light. Beautifully done." : lit.length + " / 3 diyas lit"}
          </span>
          <div className="diya-garden__progress-pips" aria-hidden="true">
            {Array.from({ length: REQUIRED_DIYAS }, (_, index) => (
              <span
                className={"diya-garden__progress-pip" + (index < lit.length ? " diya-garden__progress-pip--lit" : "")}
                key={index}
              >
                ✦
              </span>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="gold-button diya-garden__continue"
          disabled={!completed}
          onClick={onNext}
        >
          <span>Follow the glow</span>
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      <div className="diya-garden__footnote" aria-hidden="true">
        <span>✧</span><span>LIGHTS HAVE A WAY OF FINDING US</span><span>✧</span>
      </div>
    </section>
  );
}
