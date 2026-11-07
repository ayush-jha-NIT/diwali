"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { ArrowUp, Rocket, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RooftopAtmosphere } from "@/components/effects/rooftop-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

type LaunchState = "ready" | "launched";

export function SkyshotLaunch({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const launchZoneRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{y:number; pointerId:number} | null>(null);
  const launchedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const [state, setState] = useState<LaunchState>("ready");
  const launched = state === "launched";

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".sky-v2__kicker", {autoAlpha:0,y:14}, {autoAlpha:1,y:0,duration:.7}, .04)
      .fromTo(".sky-v2__title", {autoAlpha:0,y:26,filter:"blur(8px)"},{
        autoAlpha:1,y:0,filter:"blur(0px)",clearProps:"filter",duration:.95,
      },.20)
      .fromTo(".sky-v2__subtitle", {autoAlpha:0,y:11}, {autoAlpha:1,y:0,duration:.65},.57)
      .fromTo(".sky-v2__rocket-wrap", {autoAlpha:0,y:48,scale:.78}, {
        autoAlpha:1,y:0,scale:1,duration:1.18,ease:"back.out(1.3)",clearProps:"transform",
      },.76)
      .fromTo(".sky-v2__launch-zone", {autoAlpha:0,y:16}, {
        autoAlpha:1,y:0,duration:.7,
      },1.18);
  }, {scope:root});

  useEffect(() => () => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const launch = useCallback(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;
    setState("launched");
    playChime(930);
    // Reduced-motion mode must not require a prolonged animation.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      onNext();
    }, reduced ? 360 : 3150);
  }, [onNext,playChime]);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (launchedRef.current) return;
    swipeStart.current = {y:event.clientY,pointerId:event.pointerId};
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const previous = swipeStart.current;
    swipeStart.current = null;
    if (!previous || previous.pointerId !== event.pointerId) return;
    if (previous.y - event.clientY > 44) launch();
  };
  const pointerCancel = () => {swipeStart.current=null;};

  return (
    <section
      ref={root}
      className={"scene skyshot-scene sky-v2" + (launched ? " sky-v2--launched" : "")}
      aria-label="The Final Spark rocket launch"
    >
      <RooftopAtmosphere />
      <div className="sky-v2__heading">
        <span className="eyebrow sky-v2__kicker"><Sparkles size={14} aria-hidden="true"/> CHAPTER FIVE / THE FINAL SPARK</span>
        <h1 className="sky-v2__title">Send a wish <em>into forever.</em></h1>
        <p className="sky-v2__subtitle">Ab aasmaan ki baari hai. Ek aakhri spark, ek aakhri surprise.</p>
      </div>
      <div className="sky-v2__stage" aria-hidden="true">
        <div className="sky-v2__launch-orbit sky-v2__launch-orbit--outer"/>
        <div className="sky-v2__launch-orbit sky-v2__launch-orbit--inner"/>
        <div className="sky-v2__rocket-wrap">
          <div className="sky-v2__rocket-aura"/>
          <div className="sky-v2__rocket">
            <div className="sky-v2__rocket-nose"/>
            <div className="sky-v2__rocket-body">
              <div className="sky-v2__rocket-stripe"/>
              <div className="sky-v2__rocket-window"/>
            </div>
            <div className="sky-v2__rocket-fin sky-v2__rocket-fin--left"/>
            <div className="sky-v2__rocket-fin sky-v2__rocket-fin--right"/>
            <div className="sky-v2__rocket-exhaust"/>
            <div className="sky-v2__rocket-trail"/>
            <div className="sky-v2__rocket-sparks"><span/><span/><span/><span/><span/></div>
          </div>
        </div>
        <span className="sky-v2__guide-line"/>
        <span className="sky-v2__roof-light sky-v2__roof-light--left"/>
        <span className="sky-v2__roof-light sky-v2__roof-light--right"/>
        {launched && (
          <div className="sky-v2__explosion">
            <div className="sky-v2__explosion-ring"/>
            <span>✦</span>
          </div>
        )}
      </div>
      <div
        ref={launchZoneRef}
        className="sky-v2__launch-zone"
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        onPointerCancel={pointerCancel}
      >
        {!launched ? (
          <>
            <span className="sky-v2__launch-hint">YOUR SKYSHOT IS READY</span>
            <button type="button" className="gold-button sky-v2__launch-button" onClick={launch}>
              <ArrowUp size={19} aria-hidden="true" />
              Swipe up or tap to launch
              <Rocket size={16} aria-hidden="true" />
            </button>
            <span className="sky-v2__launch-instruction">SWIPE UP HERE OR TAP THE BUTTON</span>
          </>
        ) : (
          <div className="sky-v2__launch-status" role="status" aria-live="polite">
            <Sparkles size={19} aria-hidden="true"/>
            <span>Your wish is flying...</span>
          </div>
        )}
      </div>
      <div className="sky-v2__footer" aria-hidden="true">THE BEST LIGHTS ARE STILL AHEAD</div>
    </section>
  );
}
