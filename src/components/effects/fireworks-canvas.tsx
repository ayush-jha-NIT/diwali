"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type NameParticle = Point & {
  startX: number; startY: number; targetX: number; targetY: number;
  size: number; tint: string; phase: number;
};
type Ember = Point & {
  vx: number; vy: number; age: number; life: number; size: number; color: string;
};
type Firework = { x: number; y: number; count: number; tint: number };

const NAME = "KUHU";
const PALETTE = ["#ffdfa0", "#f4c46e", "#e996c8", "#8dd9ea", "#f3c2fb"] as const;
const REF_WIDTH = 166;
const REF_HEIGHT = 204;
const SHOTS: Firework[] = [
  { x: .17, y: .28, count: 86, tint: 0 },
  { x: .82, y: .33, count: 85, tint: 2 },
  { x: .37, y: .20, count: 72, tint: 3 },
  { x: .68, y: .19, count: 76, tint: 4 },
  { x: .08, y: .48, count: 72, tint: 1 },
  { x: .91, y: .48, count: 75, tint: 3 },
];

function rng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Rasterize EACH character separately, sample its opaque pixels, then assign
 * a per-character particle quota. Unlike sampling a full word and cutting to
 * a global cap, this guarantees K-U-H-U is represented evenly on tiny phones.
 */
function createNameParticles(
  width: number,
  height: number,
  target: DOMRect,
  canvasBounds: DOMRect,
): NameParticle[] {
  const sampleCanvas = document.createElement("canvas");
  sampleCanvas.width = REF_WIDTH;
  sampleCanvas.height = REF_HEIGHT;
  const sample = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!sample) return [];

  const relativeX = target.left - canvasBounds.left + target.width / 2;
  const relativeY = target.top - canvasBounds.top + target.height / 2;
  const maxTextWidth = Math.min(target.width * .9, 760);
  const scale = Math.min(maxTextWidth / (REF_WIDTH * NAME.length), target.height * .78 / REF_HEIGHT);
  const startOfWord = relativeX - REF_WIDTH * NAME.length * scale / 2;
  const perLetter = width <= 600 ? 185 : width <= 960 ? 275 : 345;
  const random = rng(0x26f4c46e + width * 17 + height);
  const particles: NameParticle[] = [];

  for (let index = 0; index < NAME.length; index++) {
    sample.clearRect(0, 0, REF_WIDTH, REF_HEIGHT);
    sample.fillStyle = "#ffffff";
    sample.textAlign = "center";
    sample.textBaseline = "middle";
    sample.font = "700 173px Georgia, serif";
    sample.fillText(NAME[index], REF_WIDTH / 2, REF_HEIGHT / 2 + 8);

    const pixels = sample.getImageData(0, 0, REF_WIDTH, REF_HEIGHT).data;
    const candidates: Point[] = [];
    for (let y = 0; y < REF_HEIGHT; y += 3) {
      for (let x = 0; x < REF_WIDTH; x += 3) {
        if (pixels[(y * REF_WIDTH + x) * 4 + 3] > 100) {
          candidates.push({ x, y });
        }
      }
    }

    // Seeded Fisher–Yates avoids random topology and makes QA reproducible.
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const limit = Math.min(candidates.length, perLetter);
    for (let i = 0; i < limit; i++) {
      const point = candidates[i];
      const targetX = startOfWord + (index * REF_WIDTH + point.x) * scale;
      const targetY = relativeY + (point.y - REF_HEIGHT / 2) * scale;
      const sourceAngle = random() * Math.PI * 2;
      const sourceRadius = (width < 600 ? 90 : 230) + random() * Math.min(width * .45, 280);

      particles.push({
        x: 0, y: 0,
        startX: targetX + Math.cos(sourceAngle) * sourceRadius,
        startY: targetY + Math.sin(sourceAngle) * sourceRadius,
        targetX, targetY,
        size: (width < 600 ? .85 : 1.15) + random() * 1.1,
        tint: PALETTE[(i + index * 3) % PALETTE.length],
        phase: random() * Math.PI * 2,
      });
    }
  }
  return particles;
}

export function FireworksCanvas({ onUnavailable }: { onUnavailable?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const failureCallback = useRef(onUnavailable);
  failureCallback.current = onUnavailable;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      failureCallback.current?.();
      return;
    }

    let raf = 0;
    let previousFrame = 0;
    let startedAt = 0;
    let width = 0;
    let height = 0;
    let mobile = false;
    let name: NameParticle[] = [];
    let embers: Ember[] = [];
    let shot = 0;
    let nextAmbient = 5600;
    let complete = false;
    let visible = !document.hidden;
    const random = rng(0x7a11da1);
    let disposed = false;

    const emit = (x: number, y: number, count: number, colorIndex: number) => {
      const available = (mobile ? 310 : 540) - embers.length;
      const total = Math.max(0, Math.min(count, available));
      const color = PALETTE[colorIndex % PALETTE.length];
      for (let i = 0; i < total; i++) {
        const angle = i / total * Math.PI * 2 + random() * .09;
        const speed = (mobile ? 46 : 66) + random() * (mobile ? 110 : 168);
        embers.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 1.15 + random() * .7,
          size: .75 + random() * (mobile ? 1.4 : 2.0),
          color,
        });
      }
    };

    const resize = () => {
      if (disposed) return;
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(bounds.width));
      height = Math.max(1, Math.floor(bounds.height));
      mobile = width <= 600;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const nameSlot = canvas.parentElement?.querySelector<HTMLElement>(".finale-v2__name-slot");
      if (!nameSlot) {
        failureCallback.current?.();
        return;
      }
      try {
        name = createNameParticles(width, height, nameSlot.getBoundingClientRect(), bounds);
      } catch {
        name = [];
      }
      if (!name.length) {
        failureCallback.current?.();
        return;
      }
      canvas.dataset.particleCount = String(name.length);
      canvas.dataset.revealState = complete ? "complete" : "assembling";
      embers = [];
    };

    const paint = (now: number) => {
      if (disposed || !visible) return;
      raf = requestAnimationFrame(paint);
      const interval = mobile ? 1000 / 30 : 1000 / 60;
      if (now - previousFrame < interval) return;
      const dt = clamp((now - (previousFrame || now)) / 1000, .001, .05);
      previousFrame = now;
      const elapsed = now - startedAt;
      ctx.clearRect(0, 0, width, height);

      // The first bursts precede the four letters; later bursts frame them.
      const timings = [320, 850, 1650, 2450, 3200, 4050];
      while (shot < SHOTS.length && elapsed >= timings[shot]) {
        const item = SHOTS[shot++];
        emit(item.x * width, item.y * height, item.count, item.tint);
      }
      if (elapsed > nextAmbient) {
        emit((.12 + random() * .76) * width, (.12 + random() * .42) * height,
          mobile ? 56 : 78, Math.floor(random() * PALETTE.length));
        nextAmbient = elapsed + 1600 + random() * 900;
      }

      ctx.globalCompositeOperation = "lighter";
      const friction = Math.pow(.984, dt * 60);
      const stillAlive: Ember[] = [];
      for (const ember of embers) {
        ember.age += dt;
        if (ember.age >= ember.life) continue;
        const tailX = ember.x;
        const tailY = ember.y;
        ember.x += ember.vx * dt;
        ember.y += ember.vy * dt;
        ember.vx *= friction;
        ember.vy = ember.vy * friction + 22 * dt;
        const alpha = Math.pow(1 - ember.age / ember.life, 1.25);
        ctx.globalAlpha = alpha * .92;
        ctx.strokeStyle = ember.color;
        ctx.lineWidth = ember.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ember.x, ember.y);
        ctx.stroke();
        ctx.fillStyle = ember.color;
        ctx.beginPath();
        ctx.arc(ember.x, ember.y, Math.max(.55, ember.size * .65), 0, Math.PI * 2);
        ctx.fill();
        stillAlive.push(ember);
      }
      embers = stillAlive;

      // Actual particle targets, rather than text drawn behind a particle mask.
      const progress = clamp((elapsed - 680) / 3350, 0, 1);
      const ease = 1 - Math.pow(1 - progress, 3.2);
      for (const point of name) {
        const float = Math.sin(elapsed * .0018 + point.phase) * (.75 + (1 - ease) * 4);
        const x = point.startX + (point.targetX - point.startX) * ease;
        const y = point.startY + (point.targetY - point.startY) * ease + float;
        const twinkle = .77 + Math.sin(elapsed * .004 + point.phase) * .21;
        ctx.globalAlpha = (.18 + ease * .82) * twinkle;
        ctx.fillStyle = point.tint;
        ctx.beginPath();
        ctx.arc(x, y, point.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!complete && progress >= 1) {
        complete = true;
        canvas.dataset.revealState = "complete";
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !disposed) {
        previousFrame = 0;
        // Resume without skipping the reveal while the tab was hidden.
        startedAt = performance.now() - (canvas.dataset.revealState === "complete" ? 4600 : 0);
        raf = requestAnimationFrame(paint);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    startedAt = performance.now();
    if (visible) raf = requestAnimationFrame(paint);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fireworks-canvas finale-v2__canvas"
      data-reveal-state="assembling"
      aria-hidden="true"
    />
  );
}
