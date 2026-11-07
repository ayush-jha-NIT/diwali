"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SceneProps } from "@/components/experience/experience";

const petals = Array.from({ length: 8 }, (_, index) => {
  const angle = (index * Math.PI) / 4;
  return {
    index,
    x: 50 + Math.sin(angle) * 33,
    y: 50 - Math.cos(angle) * 33,
  };
});
const missing = [1, 3, 5, 7];

export function Rangoli({ onNext, playChime }: SceneProps) {
  const [placed, setPlaced] = useState<number[]>([]);
  const completed = placed.length === 4;

  return (
    <section className="scene puzzle-scene">
      <div className="scene-heading">
        <span className="eyebrow">CHAPTER TWO · THE ENCHANTED RANGOLI</span>
        <h1>Every piece has <em>a place.</em></h1>
        <p>Four missing petals ko touch karo. Rangoli complete hote hi ek naya raasta khulega.</p>
      </div>
      <div className={"puzzle-world rangoli-world " + (completed ? "rangoli-world--complete" : "")}>
        <div className="rangoli-world__mandala" aria-hidden="true" />
        <div className="rangoli-world__center" aria-hidden="true">✦</div>
        {petals.map(({ index, x, y }) => {
          const active = !missing.includes(index) || placed.includes(index);
          return (
            <button
              key={index}
              type="button"
              className={"rangoli-petal " + (active ? "rangoli-petal--active" : "rangoli-petal--missing")}
              style={{ left: x + "%", top: y + "%", transform: "translate(-50%, -50%) rotate(" + (index * 45) + "deg)" }}
              disabled={active || completed}
              aria-label={"Petal " + (index + 1) + (active ? " complete" : " missing")}
              onClick={() => { setPlaced((current) => [...current, index]); playChime(540 + index * 35); }}
            >
              <span>✦</span>
            </button>
          );
        })}
      </div>
      <div className="puzzle-controls">
        <p className="puzzle-progress">{completed ? "Perfect. Some things are meant to fit together." : placed.length + " / 4 missing petals found"}</p>
        <button className="gold-button" disabled={!completed} onClick={onNext} type="button">
          Follow the petals <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
