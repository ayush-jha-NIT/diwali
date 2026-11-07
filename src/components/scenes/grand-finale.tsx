"use client";

import { useCallback, useState } from "react";
import { RotateCcw, Sparkles } from "lucide-react";
import { FireworksCanvas } from "@/components/effects/fireworks-canvas";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const dust = Array.from({ length: 32 }, (_, i) => ({
  x: (i * 53.71 + 12.6) % 100,
  y: (i * 31.23 + 6.1) % 100,
  delay: -((i * 11) % 17) / 3,
}));

export function GrandFinale({ replay }: { replay: () => void }) {
  const reducedMotion = useReducedMotion();
  const [canvasFailed, setCanvasFailed] = useState(false);
  const showStaticName = reducedMotion || canvasFailed;
  const onUnavailable = useCallback(() => setCanvasFailed(true), []);

  return (
    <section className="scene finale finale--phase7" aria-label="A Diwali surprise for KUHU">
      <div className="finale-v2__background" aria-hidden="true">
        <div className="finale-v2__glow finale-v2__glow--left" />
        <div className="finale-v2__glow finale-v2__glow--right" />
        <div className="finale-v2__moon" />
        {dust.map((point, i) => (
          <i key={i} className="finale-v2__star" style={{
            left: point.x + "%",
            top: point.y + "%",
            animationDelay: point.delay + "s",
          }} />
        ))}
        <svg className="finale-v2__silhouette" viewBox="0 0 1400 210" preserveAspectRatio="none" focusable="false">
          <path d="M0 175V134H72V122H103V88H134V125H224V145H289V114H323V86H349V114H441V149H527V104H563V70H583V102H642V145H723V118H762V92H788V118H859V140H925V119H962V86H987V117H1067V142H1159V116H1203V89H1234V123H1320V110H1400V210Z" fill="#090d22" />
          <path d="M0 159H1400" stroke="#b37c82" strokeOpacity=".19" strokeWidth="2"/>
        </svg>
      </div>
      {!showStaticName && <FireworksCanvas onUnavailable={onUnavailable} />}

      <div className="finale-v2__content">
        <div className="finale-v2__heading">
          <span className="eyebrow finale-v2__eyebrow">
            <Sparkles size={13} aria-hidden="true" />
            THE SKY BELONGS TO YOU
          </span>
          <div className="finale-v2__ornament" aria-hidden="true">✧ &nbsp; ✦ &nbsp; ✧</div>
          <h1 className="finale-v2__greeting">Happy <em>Diwali,</em></h1>
          <p className="finale-v2__subheading">For the one who makes everything a little brighter.</p>
        </div>

        <div className="finale-v2__name-slot">
          {showStaticName
            ? <h2 className="finale__static-name finale-v2__static-name">KUHU</h2>
            : <h2 className="sr-only">KUHU</h2>}
        </div>

        <div className="finale-v2__closing">
          <div className="finale-v2__message-ornament" aria-hidden="true">✦</div>
          <p className="finale-v2__message">
            Waise Diwali ki lights bhi thodi jealous hongi...
            <span> tum bina switch ke hi sab kuch brighten kar deti ho.</span>
          </p>
          <p className="finale-v2__signature">With a little magic, <strong>Ayush</strong></p>
          <button className="outline-button finale-v2__replay" type="button" onClick={replay}>
            <RotateCcw size={16} aria-hidden="true" />
            Replay the magic
          </button>
          <span className="finale-v2__closing-note">A LITTLE MAGIC. JUST FOR YOU.</span>
        </div>
      </div>
    </section>
  );
}
