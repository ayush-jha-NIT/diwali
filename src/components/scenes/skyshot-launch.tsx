"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import type { SceneProps } from "@/components/experience/experience";

export function SkyshotLaunch({ onNext, playChime }: SceneProps) {
  const [launched, setLaunched] = useState(false);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!launched) return;
    const timeout = window.setTimeout(onNext, 2900);
    return () => window.clearTimeout(timeout);
  }, [launched, onNext]);

  const launch = () => {
    if (launched) return;
    setLaunched(true);
    playChime(930);
  };

  return (
    <section className={"scene skyshot-scene " + (launched ? "skyshot-scene--launched" : "")}>
      <div className="scene-heading skyshot-scene__heading">
        <span className="eyebrow">CHAPTER FIVE · THE FINAL SPARK</span>
        <h1>One last <em>wish.</em></h1>
        <p>This one is yours. Send it to the stars.</p>
      </div>
      <div className="skyshot-scene__sky" aria-hidden="true">
        <span className="skyshot-scene__moon" />
        <span className="skyshot-scene__rocket"><Sparkles size={30} fill="currentColor" /></span>
        <span className="skyshot-scene__rooftop" />
      </div>
      <div className="skyshot-scene__launch-zone"
        onPointerDown={(event) => { startY.current = event.clientY; }}
        onPointerUp={(event) => { if (startY.current !== null && startY.current - event.clientY > 44) launch(); startY.current = null; }}
      >
        {!launched && (
          <button type="button" className="gold-button skyshot-scene__launch" onClick={launch}>
            <ArrowUp size={19} /> Swipe up or tap to launch
          </button>
        )}
        {launched && <span className="skyshot-scene__launch-caption">Your wish is flying...</span>}
      </div>
    </section>
  );
}
