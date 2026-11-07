"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { FireworksCanvas } from "@/components/effects/fireworks-canvas";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function GrandFinale({ replay }: { replay: () => void }) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="scene finale">
      {!reducedMotion && <FireworksCanvas />}
      <div className="finale__content">
        <span className="eyebrow finale__eyebrow"><Sparkles size={13} /> FOR THE ONE WHO MAKES EVERYTHING BRIGHTER</span>
        <h1 className="finale__greeting">Happy Diwali,</h1>
        {reducedMotion ? <h2 className="finale__static-name">KUHU</h2> : <span className="sr-only">KUHU</span>}
        <p className="finale__message">
          Diwali ki lights bhi thodi jealous hongi... tum bina switch ke hi sab kuch brighten kar deti ho.
        </p>
        <p className="finale__signature">With a little magic, Ayush</p>
        <button className="outline-button" onClick={replay} type="button">
          <RotateCcw size={16} /> Replay the magic
        </button>
      </div>
    </section>
  );
}
