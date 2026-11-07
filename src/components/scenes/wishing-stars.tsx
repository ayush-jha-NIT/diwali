"use client";

import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import type { SceneProps } from "@/components/experience/experience";

const stars = [
  { x: 15, y: 64 }, { x: 29, y: 28 }, { x: 52, y: 49 },
  { x: 72, y: 23 }, { x: 86, y: 64 },
];

export function WishingStars({ onNext, playChime }: SceneProps) {
  const [connected, setConnected] = useState(0);
  const completed = connected === stars.length;

  return (
    <section className="scene puzzle-scene">
      <div className="scene-heading">
        <span className="eyebrow">CHAPTER THREE · THE WISHING STARS</span>
        <h1>Written in <em>the stars.</em></h1>
        <p>Shining stars ko left se right, ek-ek karke touch karo. Dekho tumhari wish kahan tak jaati hai.</p>
      </div>
      <div className="puzzle-world star-world" role="group" aria-label="Connect five stars in order">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="star-world__connections" aria-hidden="true">
          {stars.slice(1).map((star, index) => (
            <line
              key={index}
              x1={stars[index].x} y1={stars[index].y}
              x2={star.x} y2={star.y}
              className={connected >= index + 2 ? "star-line--visible" : "star-line--hidden"}
            />
          ))}
        </svg>
        {stars.map(({ x, y }, index) => {
          const active = index < connected;
          return (
            <button
              key={index}
              className={"star-target " + (active ? "star-target--active " : "") + (index === connected ? "star-target--next" : "")}
              type="button"
              disabled={index !== connected}
              style={{ left: x + "%", top: y + "%" }}
              aria-label={"Star " + (index + 1) + (active ? " connected" : "")}
              onClick={() => { setConnected((current) => current + 1); playChime(530 + index * 110); }}
            >
              <Star size={32} fill="currentColor" strokeWidth={1} />
            </button>
          );
        })}
        {completed && <div className="star-world__shooting" aria-hidden="true">✧</div>}
      </div>
      <div className="puzzle-controls">
        <p className="puzzle-progress">{completed ? "A wish is on its way." : connected + " / 5 stars connected"}</p>
        <button className="gold-button" disabled={!completed} onClick={onNext} type="button">
          Make a wish <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
