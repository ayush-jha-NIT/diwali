"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Diya } from "@/components/effects/diya";
import type { SceneProps } from "@/components/experience/experience";

const lamps = [
  { x: 18, y: 41 }, { x: 50, y: 23 }, { x: 81, y: 43 },
  { x: 32, y: 77 }, { x: 70, y: 75 },
];

export function LostDiyas({ onNext, playChime }: SceneProps) {
  const [lit, setLit] = useState<number[]>([]);
  const completed = lit.length >= 3;

  const light = (index: number) => {
    if (completed || lit.includes(index)) return;
    setLit((value) => [...value, index]);
    playChime(490 + (lit.length * 170));
  };

  return (
    <section className="scene puzzle-scene">
      <div className="scene-heading">
        <span className="eyebrow">CHAPTER ONE · THE LOST DIYAS</span>
        <h1>Bring back the <em>light.</em></h1>
        <p>Is magical garden mein kuch diyas apni roshni kho baithe hain. Any three diyas ko touch karke light karo.</p>
      </div>
      <div className="puzzle-world diya-world" role="group" aria-label="Light any three diyas">
        <div className="diya-world__water" aria-hidden="true" />
        <div className="diya-world__moon" aria-hidden="true" />
        {lamps.map((lamp, index) => {
          const isLit = lit.includes(index);
          return (
            <button
              type="button"
              key={index}
              onClick={() => light(index)}
              disabled={isLit || completed}
              className={"floating-lamp " + (isLit ? "floating-lamp--lit" : "")}
              style={{ left: lamp.x + "%", top: lamp.y + "%" }}
              aria-label={"Diya " + (index + 1) + (isLit ? " lit" : " unlit")}
            >
              <Diya small lit={isLit} />
            </button>
          );
        })}
        {completed && <div className="puzzle-world__reward" aria-hidden="true"><Sparkles size={35} /></div>}
      </div>
      <div className="puzzle-controls">
        <p className="puzzle-progress">{completed ? "You found the light. Beautifully done." : lit.length + " / 3 diyas lit"}</p>
        <button className="gold-button" disabled={!completed} onClick={onNext} type="button">
          Follow the glow <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
