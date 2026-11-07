"use client";

import { useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { RangoliAtmosphere } from "@/components/effects/rangoli-atmosphere";
import type { SceneProps } from "@/components/experience/experience";

const MISSING = [1, 3, 5, 7] as const;
const petalColors = ["#f5c578", "#e69dc4", "#8dd9ea", "#edac8e"];
const petals = Array.from({ length: 8 }, (_, index) => {
  const angle = index * Math.PI / 4;
  return {
    index,
    x: 50 + Math.sin(angle) * 33,
    y: 50 - Math.cos(angle) * 33,
    rotation: index * 45,
  };
});

type DragState = { index: number; x: number; y: number };

export function Rangoli({ onNext, playChime }: SceneProps) {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const dragDistance = useRef(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const completed = placed.length === MISSING.length;

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".rangoli-v2__eyebrow", { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .65 }, .05)
      .fromTo(".rangoli-v2__title", { autoAlpha: 0, y: 26, filter: "blur(7px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", clearProps: "filter", duration: .9,
      }, .18)
      .fromTo(".rangoli-v2__subtitle", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .75 }, .48)
      .fromTo(".rangoli-v2__world", { autoAlpha: 0, scale: .97 }, { autoAlpha: 1, scale: 1, duration: 1.1 }, .41)
      .fromTo(".rangoli-v2__board", { autoAlpha: 0, scale: .74, rotate: -26 }, {
        autoAlpha: 1, scale: 1, rotate: 0, duration: 1.25, ease: "back.out(1.15)", clearProps: "transform",
      }, .64)
      .fromTo(".rangoli-v2__tray", { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: .8 }, .95)
      .fromTo(".rangoli-v2__controls", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: .65 }, 1.1);
  }, { scope: root });

  const place = (index: number) => {
    if (completed || !MISSING.some((missing) => missing === index) || placed.includes(index)) return;
    setPlaced((current) => current.includes(index) ? current : [...current, index]);
    setSelected(null);
    playChime(600 + index * 38);
  };

  const onDragStart = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    if (placed.includes(index) || completed) return;
    // Keep the source button fixed while its separate ghost follows the pointer.
    event.currentTarget.setPointerCapture(event.pointerId);
    dragDistance.current = 0;
    setSelected(index);
    setDragging({ index, x: event.clientX, y: event.clientY });
  };

  const onDragMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    dragDistance.current += Math.abs(event.movementX) + Math.abs(event.movementY);
    setDragging({ ...dragging, x: event.clientX, y: event.clientY });
  };

  const onDragEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const { index } = dragging;
    const slot = board.current?.querySelector<HTMLButtonElement>('[data-slot-index="' + index + '"]');
    const bounds = slot?.getBoundingClientRect();
    if (bounds) {
      const tolerance = 26;
      const inside = event.clientX >= bounds.left - tolerance &&
        event.clientX <= bounds.right + tolerance &&
        event.clientY >= bounds.top - tolerance &&
        event.clientY <= bounds.bottom + tolerance;
      if (inside) place(index);
    }
    setDragging(null);
  };

  return (
    <section className="scene puzzle-scene rangoli-v2" ref={root} aria-label="The Enchanted Rangoli puzzle">
      <div className="rangoli-v2__header">
        <span className="eyebrow rangoli-v2__eyebrow">
          <span aria-hidden="true">✦</span> CHAPTER TWO / THE ENCHANTED RANGOLI
        </span>
        <h1 className="rangoli-v2__title">A little color. <em>A little magic.</em></h1>
        <p className="rangoli-v2__subtitle">
          Rangoli ke chaar rang kho gaye hain. Petals ko unki jagah par drag karo,
          ya glowing spaces ko touch karke complete karo.
        </p>
      </div>

      <div className={"puzzle-world rangoli-v2__world" + (completed ? " rangoli-v2__world--complete" : "")}>
        <RangoliAtmosphere />
        <div className="rangoli-v2__world-label" aria-hidden="true">✧ &nbsp; THE COURTYARD OF COLORS &nbsp; ✧</div>

        <div className="rangoli-v2__board" ref={board} role="group" aria-label="Complete the four missing rangoli petals">
          <span className="rangoli-v2__board-halo" aria-hidden="true" />
          <svg className="rangoli-v2__geometry" viewBox="0 0 400 400" focusable="false" aria-hidden="true">
            <g fill="none" stroke="#f6c980">
              <circle cx="200" cy="200" r="173" strokeOpacity=".42" strokeWidth="1.5"/>
              <circle cx="200" cy="200" r="153" strokeOpacity=".36" strokeDasharray="2 7"/>
              <circle cx="200" cy="200" r="117" strokeOpacity=".45"/>
              <circle cx="200" cy="200" r="87" strokeOpacity=".55" strokeDasharray="2 6"/>
              <circle cx="200" cy="200" r="41" strokeOpacity=".74"/>
              {Array.from({ length: 16 }, (_, i) => {
                const angle = i * Math.PI / 8;
                const x = 200 + Math.sin(angle) * 183;
                const y = 200 - Math.cos(angle) * 183;
                return <circle key={i} cx={x} cy={y} r="2.5" fill="#f6c980" stroke="none" fillOpacity=".6" />;
              })}
            </g>
            <g stroke="#e69dc4" strokeOpacity=".26">
              <path d="M200 19V381M19 200H381M72 72L328 328M328 72L72 328"/>
            </g>
          </svg>

          {petals.map(({ index, x, y, rotation }) => {
            const fixed = !MISSING.some((missing) => missing === index);
            const active = fixed || placed.includes(index);
            return (
              <button
                key={index}
                type="button"
                data-slot-index={index}
                disabled={active || completed}
                aria-label={"Petal " + (index + 1) + (active ? " complete" : " missing")}
                aria-pressed={active}
                className={"rangoli-v2__slot" + (active ? " rangoli-v2__slot--filled" : " rangoli-v2__slot--empty")}
                style={{ left: x + "%", top: y + "%", "--slot-rotation": rotation + "deg" } as CSSProperties}
                onClick={() => place(index)}
              >
                <span className="rangoli-v2__petal-shape" aria-hidden="true">
                  <span className="rangoli-v2__petal-mark">✦</span>
                </span>
              </button>
            );
          })}
          <div className="rangoli-v2__center" aria-hidden="true"><span>✺</span><span>✦</span></div>
          {completed && <div className="rangoli-v2__lotus" aria-hidden="true">
            <span className="rangoli-v2__lotus-aura" />
            <span className="rangoli-v2__lotus-flower">✿</span>
            <span className="rangoli-v2__lotus-tag">BLOOMING WITH MAGIC</span>
          </div>}
        </div>
        <span className="rangoli-v2__floor-spark" aria-hidden="true">✧</span>
      </div>

      <div className="rangoli-v2__tray" role="group" aria-label="Missing petals ready to drag">
        <span className="rangoli-v2__tray-label">THE LOST COLORS</span>
        <div className="rangoli-v2__tray-pieces">
          {MISSING.map((index, piece) => (
            <button
              type="button"
              key={index}
              className={"rangoli-v2__piece" + (placed.includes(index) ? " rangoli-v2__piece--placed" : "") + (selected === index ? " rangoli-v2__piece--selected" : "")}
              disabled={placed.includes(index) || completed}
              aria-label={"Drag petal " + (index + 1) + " to its matching slot"}
              aria-pressed={selected === index}
              style={{ "--piece-color": petalColors[piece] } as CSSProperties}
              onClick={() => setSelected(index)}
              onPointerDown={(event) => onDragStart(index, event)}
              onPointerMove={onDragMove}
              onPointerUp={onDragEnd}
              onPointerCancel={() => setDragging(null)}
            >
              <span className="rangoli-v2__piece-gem" aria-hidden="true">✦</span>
              <span className="rangoli-v2__piece-number">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <span className="rangoli-v2__tray-hint">DRAG OR TAP</span>
      </div>

      {dragging && (
        <div className="rangoli-v2__drag-ghost" style={{
          left: dragging.x + "px", top: dragging.y + "px",
        }} aria-hidden="true">✦</div>
      )}

      <div className="rangoli-v2__controls">
        <div className="rangoli-v2__status" role="status" aria-live="polite" aria-atomic="true">
          {completed ? "Perfect. Some things are meant to fit together." : placed.length + " / 4 missing petals found"}
        </div>
        <div className="rangoli-v2__progress" aria-hidden="true">
          {MISSING.map((index, i) => <span className={i < placed.length ? "rangoli-v2__progress--filled" : ""} key={index}>✦</span>)}
        </div>
        <button className="gold-button rangoli-v2__next" disabled={!completed} onClick={onNext} type="button">
          Follow the petals <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
