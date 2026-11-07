"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Diya } from "@/components/effects/diya";
import { InvitationAtmosphere } from "@/components/effects/invitation-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

/**
 * Chapter 1 is deliberately anonymous. The recipient's name must only become
 * visible in the final fireworks reveal.
 */
export function Invitation({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const navigating = useRef(false);

  useGSAP(() => {
    // Respect OS settings synchronously; don't let a GSAP "from" tween flash
    // content invisible while React's motion-preference hook catches up.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro
      .fromTo(".invitation-art__distant-halo", { autoAlpha: 0, scale: .78 }, {
        autoAlpha: 1, scale: 1, duration: 1.35, ease: "power2.out",
      }, 0)
      .fromTo(".invitation-art__trail", { autoAlpha: 0, scale: .45, x: -140, y: -165 }, {
        autoAlpha: 1, scale: 1, x: 0, y: 0, duration: 1.25, ease: "power2.inOut",
      }, .12)
      .fromTo(".invitation-art__diya", { autoAlpha: 0, y: 43, scale: .83, filter: "brightness(0.25)" }, {
        autoAlpha: 1, y: 0, scale: 1, filter: "brightness(1)", duration: 1.18, ease: "back.out(1.2)",
        clearProps: "filter",
      }, .75)
      .fromTo(".invitation-art__bloom", { opacity: 0, scale: .2 }, {
        opacity: .8, scale: 1.25, duration: 1.15, ease: "power2.out",
      }, 1.15)
      .to(".invitation-art__bloom", { opacity: .23, scale: 1, duration: 1 }, 2.0)
      .fromTo(".invitation-art__mandala", { autoAlpha: 0, rotation: -26, scale: .86 }, {
        autoAlpha: .8, rotation: 0, scale: 1, duration: 1.75, ease: "power2.out",
      }, 1.12)
      .fromTo(".invitation__kicker", { autoAlpha: 0, y: 15 }, {
        autoAlpha: 1, y: 0, duration: .7,
      }, .85)
      .fromTo(".invitation__title-line", { autoAlpha: 0, y: 35, filter: "blur(7px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .95, stagger: .14,
        clearProps: "filter",
      }, 1.12)
      .fromTo(".invitation__rule", { scaleX: 0, autoAlpha: 0 }, {
        scaleX: 1, autoAlpha: 1, transformOrigin: "left center", duration: .8,
      }, 1.65)
      .fromTo(".invitation__copy", { autoAlpha: 0, y: 18 }, {
        autoAlpha: 1, y: 0, duration: .85,
      }, 1.72)
      .fromTo(".invitation__button", { autoAlpha: 0, y: 15, scale: .95 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: .75,
      }, 1.93)
      .fromTo(".invitation__microcopy", { autoAlpha: 0, y: 9 }, {
        autoAlpha: 1, y: 0, duration: .65,
      }, 2.12)
      .fromTo(".invitation-art__caption", { autoAlpha: 0 }, {
        autoAlpha: 1, duration: .8,
      }, 2.15);

    gsap.to(".invitation-art__mandala-inner", {
      rotation: 360, transformOrigin: "50% 50%", duration: 50,
      ease: "none", repeat: -1,
    });
    gsap.to(".invitation-art__mandala-outer", {
      rotation: -360, transformOrigin: "50% 50%", duration: 75,
      ease: "none", repeat: -1,
    });
    gsap.to(".invitation-art__diya", {
      y: -8, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true,
    });
  }, { scope: root });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = root.current?.getBoundingClientRect();
    if (!bounds || !root.current) return;
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    root.current.style.setProperty("--parallax-x", (x * 13).toFixed(2) + "px");
    root.current.style.setProperty("--parallax-y", (y * 10).toFixed(2) + "px");
  };

  const resetPointer = () => {
    root.current?.style.setProperty("--parallax-x", "0px");
    root.current?.style.setProperty("--parallax-y", "0px");
  };

  const enter = () => {
    if (navigating.current) return;
    navigating.current = true;
    playChime(740);
    onNext();
  };

  return (
    <section
      className="scene invitation invitation--phase1"
      ref={root}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="A secret Diwali invitation"
    >
      <InvitationAtmosphere />

      <div className="invitation__frame" aria-hidden="true">
        <span className="invitation__frame-top" />
        <span className="invitation__frame-bottom" />
      </div>

      <div className="invitation__layout">
        <div className="invitation__editorial">
          <div className="invitation__kicker">
            <span className="invitation__kicker-star">✦</span>
            <span>A LITTLE SOMETHING, JUST FOR YOU</span>
          </div>

          <h1 className="invitation__title">
            <span className="invitation__title-line">Someone left</span>
            <span className="invitation__title-line">a <em>little magic</em></span>
            <span className="invitation__title-line">for you tonight.</span>
          </h1>

          <span className="invitation__rule" aria-hidden="true"><span>✧</span></span>

          <p className="invitation__copy">
            Kuch raatein sirf roshni se nahi, kisi ki muskaan se
            <span> khaas banti hain.</span>
            <br />
            Aaj ki raat mein tumhare liye ek chhota sa surprise hai.
          </p>

          <button
            type="button"
            className="gold-button invitation__button"
            onClick={enter}
            aria-label="Discover your surprise"
          >
            <span>Discover your surprise</span>
            <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className="invitation__microcopy">
            <Sparkles size={12} strokeWidth={1.6} aria-hidden="true" />
            <span>MADE OF STARS, LIGHT &amp; A LITTLE BIT OF HEART</span>
          </div>
        </div>

        <div className="invitation-art" aria-hidden="true">
          <div className="invitation-art__distant-halo" />
          <div className="invitation-art__bloom" />
          <svg className="invitation-art__mandala" viewBox="0 0 560 560" fill="none" focusable="false">
            <g className="invitation-art__mandala-outer" stroke="#D9A96D" strokeWidth=".9">
              <circle cx="280" cy="280" r="228" strokeOpacity=".33" />
              <circle cx="280" cy="280" r="244" strokeOpacity=".12" strokeDasharray="2 16" />
              {Array.from({ length: 16 }, (_, i) => {
                const angle = (i * Math.PI) / 8;
                const x1 = 280 + 227 * Math.cos(angle);
                const y1 = 280 + 227 * Math.sin(angle);
                const x2 = 280 + 236 * Math.cos(angle);
                const y2 = 280 + 236 * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity=".56" />;
              })}
              <path d="M280 27L285 39L280 51L275 39Z M280 509L285 521L280 533L275 521Z M27 280L39 285L51 280L39 275Z M509 280L521 285L533 280L521 275Z" fill="#E9BF81" strokeOpacity=".9" fillOpacity=".44" />
            </g>
            <g className="invitation-art__mandala-inner" stroke="#D9A96D">
              <circle cx="280" cy="280" r="172" strokeOpacity=".34" strokeWidth="1.3" />
              <circle cx="280" cy="280" r="184" strokeOpacity=".26" strokeDasharray="1 11" />
              <circle cx="280" cy="280" r="209" strokeOpacity=".17" />
              {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * Math.PI) / 6;
                const x = 280 + 196 * Math.cos(angle);
                const y = 280 + 196 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="2.5" fill="#F4C46E" stroke="none" fillOpacity=".65" />;
              })}
            </g>
          </svg>
          <div className="invitation-art__trail"><span /><span /><span /><span /><span /></div>
          <div className="invitation-art__diya"><Diya /></div>
          <div className="invitation-art__reflection" />
          <div className="invitation-art__caption">
            <span className="invitation-art__caption-line" />
            <span>EVERY BEAUTIFUL STORY BEGINS WITH A SPARK</span>
            <span className="invitation-art__caption-line" />
          </div>
        </div>
      </div>

      <div className="invitation__bottom-mark" aria-hidden="true">
        <span>✧</span><span>01</span><span>✧</span>
      </div>
    </section>
  );
}
