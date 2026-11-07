"use client";

import { useEffect, useRef } from "react";

type LetterParticle = {
  x: number; y: number; targetX: number; targetY: number;
  size: number; color: string; drift: number;
};
type BurstParticle = {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; color: string; size: number;
};

const COLORS = ["#ffd88d", "#f4c46e", "#e996c8", "#8dd9ea", "#e7a7ff"];

function createLetterParticles(width: number, height: number): LetterParticle[] {
  const offscreen = document.createElement("canvas");
  offscreen.width = Math.max(1, Math.round(width));
  offscreen.height = Math.max(1, Math.round(height));
  const context = offscreen.getContext("2d", { willReadFrequently: true });
  if (!context) return [];

  const fontSize = Math.min(166, Math.max(52, width / 3.25));
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 " + fontSize + "px Georgia, serif";
  context.fillText("KUHU", width / 2, height * 0.49);

  const { data } = context.getImageData(0, 0, offscreen.width, offscreen.height);
  const points: Array<{ x: number; y: number }> = [];
  const step = width < 600 ? 3 : 4;
  for (let y = 0; y < offscreen.height; y += step) {
    for (let x = 0; x < offscreen.width; x += step) {
      if (data[(y * offscreen.width + x) * 4 + 3] > 125) {
        points.push({ x, y });
      }
    }
  }

  // Shuffle before limiting particles so all four letters remain visible.
  for (let i = points.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  return points.slice(0, width < 600 ? 740 : 1250).map((point, i) => ({
    x: width / 2 + (Math.random() - 0.5) * width * 0.85,
    y: height * 0.34 + (Math.random() - 0.5) * height * 0.66,
    targetX: point.x,
    targetY: point.y,
    size: 1.0 + Math.random() * 1.65,
    color: COLORS[i % COLORS.length],
    drift: Math.random() * Math.PI * 2,
  }));
}

export function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let letters: LetterParticle[] = [];
    let embers: BurstParticle[] = [];
    let frame = 0;
    let burstAt = 0;
    const startedAt = performance.now();
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas || !context) return;
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(320, bounds.width);
      height = Math.max(400, bounds.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      letters = createLetterParticles(width, height);
      embers = [];
    }

    function burst(x: number, y: number, count: number) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.4 + Math.random() * 3.7;
        embers.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 48 + Math.random() * 36,
          color,
          size: 0.8 + Math.random() * 1.8,
        });
      }
    }

    function draw(now: number) {
      if (!context) return;
      const elapsed = now - startedAt;
      context.globalCompositeOperation = "source-over";
      context.fillStyle = "rgba(9, 11, 32, 0.24)";
      context.fillRect(0, 0, width, height);

      if (!prefersReducedMotion && elapsed > 250 && elapsed > burstAt) {
        const early = elapsed < 2600;
        burst(width * (0.14 + Math.random() * 0.72), height * (0.12 + Math.random() * 0.52), early ? 105 : 68);
        burstAt = elapsed + (early ? 650 : 1550);
      }

      context.globalCompositeOperation = "lighter";
      embers = embers.filter((ember) => ember.life < ember.maxLife);
      embers.forEach((ember) => {
        ember.life += 1;
        ember.x += ember.vx;
        ember.y += ember.vy;
        ember.vx *= 0.987;
        ember.vy = ember.vy * 0.987 + 0.012;
        context.globalAlpha = Math.max(0, 1 - ember.life / ember.maxLife);
        context.fillStyle = ember.color;
        context.beginPath();
        context.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
        context.fill();
      });

      const reveal = prefersReducedMotion ? 1 : Math.min(1, Math.max(0, (elapsed - 1750) / 2400));
      letters.forEach((letter) => {
        const easing = prefersReducedMotion ? 1 : 0.025 + reveal * 0.065;
        letter.x += (letter.targetX - letter.x) * easing;
        letter.y += (letter.targetY - letter.y) * easing;
        const shimmer = 0.68 + Math.sin(elapsed * 0.003 + letter.drift) * 0.32;
        context.globalAlpha = Math.max(0.1, (0.22 + reveal * 0.78) * shimmer);
        context.fillStyle = letter.color;
        context.beginPath();
        context.arc(letter.x, letter.y, letter.size, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      frame = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="fireworks-canvas" ref={canvasRef} aria-hidden="true" />;
}
