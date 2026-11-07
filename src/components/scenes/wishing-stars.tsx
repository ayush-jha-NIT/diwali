"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, Gift, Sparkles, Star } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WishingSkyAtmosphere } from "@/components/effects/wishing-sky-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

const stars = [
  { x: 14, y: 65, tone: "#f4c46e" },
  { x: 29, y: 29, tone: "#e9aad5" },
  { x: 51, y: 49, tone: "#8dd9ea" },
  { x: 72, y: 24, tone: "#ffe1ab" },
  { x: 88, y: 65, tone: "#dcb3fc" },
] as const;

export function WishingStars({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const [connected, setConnected] = useState(0);
  const completed = connected === stars.length;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".wishing-v2__eyebrow", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .6 }, .04)
      .fromTo(".wishing-v2__title", { autoAlpha: 0, y: 25, filter: "blur(9px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", clearProps: "filter", duration: .95,
      }, .18)
      .fromTo(".wishing-v2__description", { autoAlpha: 0, y: 13 }, {
        autoAlpha: 1, y: 0, duration: .72,
      }, .52)
      .fromTo(".wishing-v2__world", { autoAlpha: 0, scale: .975 }, {
        autoAlpha: 1, scale: 1, duration: 1.0,
      }, .4)
      .fromTo(".wishing-v2__star-core", { autoAlpha: 0, scale: .35 }, {
        autoAlpha: 1, scale: 1, duration: .8, stagger: .14, ease: "back.out(1.6)",
      }, .88)
      .fromTo(".wishing-v2__controls", { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: .65,
      }, 1.15);
  }, { scope: root });

  const connect = (index: number) => {
    if (completed || index !== connected) return;
    setConnected((current) => current + 1);
    playChime(520 + index * 115);
  };

  return (
    <section className="scene puzzle-scene wishing-v2" ref={root} aria-label="The Wishing Stars puzzle">
      <div className="wishing-v2__header">
        <span className="eyebrow wishing-v2__eyebrow">
          <span aria-hidden="true">✦</span> CHAPTER THREE / THE WISHING STARS
        </span>
        <h1 className="wishing-v2__title">Some wishes are <em>written in stars.</em></h1>
        <p className="wishing-v2__description">
          Har star ek chhoti si wish sambhale hai. Chamakte stars ko
          <span> left se right, ek-ek karke touch karo.</span>
        </p>
      </div>

      <div className={"puzzle-world wishing-v2__world" + (completed ? " wishing-v2__world--complete" : "")}
        role="group" aria-label="Connect five stars in order">
        <WishingSkyAtmosphere />
        <div className="wishing-v2__world-label" aria-hidden="true">✧ &nbsp; A MAP OF LITTLE WISHES &nbsp; ✧</div>
        <svg className="wishing-v2__connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="wishing-path-gold" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5c975"/>
              <stop offset="45%" stopColor="#f3b1d5"/>
              <stop offset="100%" stopColor="#8dd9ea"/>
            </linearGradient>
          </defs>
          {stars.slice(1).map((star, i) => (
            <g key={i}>
              <line className="wishing-v2__line-guide" x1={stars[i].x} y1={stars[i].y} x2={star.x} y2={star.y}/>
              <line className={"wishing-v2__line-active" + (connected > i + 1 ? " wishing-v2__line-active--lit" : "")}
                x1={stars[i].x} y1={stars[i].y} x2={star.x} y2={star.y}/>
            </g>
          ))}
        </svg>

        {stars.map(({ x, y, tone }, index) => {
          const isConnected = index < connected;
          const isNext = index === connected;
          return (
            <button
              key={index}
              type="button"
              aria-label={"Star " + (index + 1) + (isConnected ? " connected" : "")}
              aria-pressed={isConnected}
              disabled={!isNext}
              className={"wishing-v2__star" + (isConnected ? " wishing-v2__star--connected" : "") + (isNext ? " wishing-v2__star--next" : "")}
              style={{ left: x + "%", top: y + "%", "--star-color": tone } as CSSProperties}
              onClick={() => connect(index)}
            >
              <span className="wishing-v2__star-halo" aria-hidden="true" />
              <span className="wishing-v2__star-core">
                <Star size={27} strokeWidth={1.15} fill="currentColor" aria-hidden="true"/>
              </span>
              <span className="wishing-v2__star-index" aria-hidden="true">{String(index + 1).padStart(2,"0")}</span>
              {isNext && <span className="wishing-v2__star-next" aria-hidden="true">NEXT</span>}
            </button>
          );
        })}
        {completed && <>
          <div className="wishing-v2__shooting-star" aria-hidden="true"><span>✦</span></div>
          <div className="wishing-v2__gift" aria-hidden="true">
            <span className="wishing-v2__gift-aura" />
            <span className="wishing-v2__gift-icon"><Gift size={49} strokeWidth={1.1}/><Sparkles size={19}/></span>
            <span className="wishing-v2__gift-caption">A LITTLE SOMETHING AWAITS</span>
          </div>
        </>}
        <div className="wishing-v2__horizon-glimmer" aria-hidden="true" />
      </div>

      <div className="wishing-v2__controls">
        <div className="wishing-v2__status" role="status" aria-live="polite" aria-atomic="true">
          {completed ? "A wish is on its way." : connected + " / 5 stars connected"}
        </div>
        <div className="wishing-v2__progress" aria-hidden="true">
          {stars.map((_, index) => (
            <span key={index} className={index < connected ? "wishing-v2__progress--lit" : ""}>✦</span>
          ))}
        </div>
        <button className="gold-button wishing-v2__next" type="button" disabled={!completed} onClick={onNext}>
          Make a wish <ArrowRight size={18} aria-hidden="true"/>
        </button>
      </div>
    </section>
  );
}
