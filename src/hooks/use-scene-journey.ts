"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { readProgress, resetProgress, saveProgress } from "@/lib/scene-storage";
import { experience } from "@/config/experience";

/**
 * Coordinates scene changes through a single transition layer instead of
 * performing abrupt React unmounts. Both the content stage and the veil stay
 * mounted for the entire visit, so GSAP can animate them safely.
 */
export function useSceneJourney() {
  const [scene, setScene] = useState(0);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const animationRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const initialFrame = window.requestAnimationFrame(() => {
      setScene(readProgress());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(initialFrame);
  }, []);

  useEffect(() => {
    return () => {
      animationRef.current?.kill();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const moveTo = useCallback((target: number, restart = false) => {
    if (navigatingRef.current) return;
    const next = Math.max(0, Math.min(experience.scenes.length - 1, target));
    if (next === scene && !restart) return;

    navigatingRef.current = true;
    const stage = stageRef.current;
    const veil = veilRef.current;

    const changeScene = () => {
      if (restart) resetProgress();
      else saveProgress(next);
      setScene(next);
      window.scrollTo({ top: 0, behavior: "auto" });
      rafRef.current = window.requestAnimationFrame(() => stageRef.current?.focus());
    };

    if (reducedMotion || !ready || !stage || !veil) {
      changeScene();
      navigatingRef.current = false;
      return;
    }

    const out = gsap.timeline({
      onComplete: () => {
        changeScene();
        rafRef.current = window.requestAnimationFrame(() => {
          if (!stageRef.current || !veilRef.current) {
            navigatingRef.current = false;
            return;
          }
          const incoming = gsap.timeline({
            onComplete: () => {
              navigatingRef.current = false;
              animationRef.current = null;
            },
          });
          incoming
            .to(veilRef.current, {
              autoAlpha: 0,
              duration: 0.65,
              ease: "power2.inOut",
            }, 0)
            .fromTo(stageRef.current, {
              autoAlpha: 0,
              scale: 1.018,
              y: 20,
              filter: "blur(12px)",
            }, {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "power3.out",
              clearProps: "transform,filter",
            }, 0.13);
          animationRef.current = incoming;
        });
      },
    });

    out.to(stage, {
      autoAlpha: 0,
      y: -16,
      scale: 0.986,
      filter: "blur(13px)",
      duration: 0.52,
      ease: "power2.inOut",
    }, 0).to(veil, {
      autoAlpha: 1,
      duration: 0.46,
      ease: "power2.inOut",
    }, 0.11);

    animationRef.current = out;
  }, [ready, reducedMotion, scene]);

  const nextScene = useCallback(() => moveTo(scene + 1), [moveTo, scene]);
  const replay = useCallback(() => moveTo(0, true), [moveTo]);

  return {
    scene,
    ready,
    stageRef,
    veilRef,
    nextScene,
    replay,
  };
}
