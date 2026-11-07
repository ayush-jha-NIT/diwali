"use client";

import { useCallback, useRef, useState } from "react";

type BrowserAudioContext = typeof AudioContext;

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  const playChime = useCallback((pitch = 660) => {
    if (!soundEnabled) return;
    const AudioContextConstructor: BrowserAudioContext | undefined =
      window.AudioContext;
    if (!AudioContextConstructor) return;

    try {
      const context = contextRef.current ?? new AudioContextConstructor();
      contextRef.current = context;
      if (context.state === "suspended") void context.resume();
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(pitch, now);
      oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.35, now + 0.18);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.45);
    } catch {
      // Audio must never block puzzles or animations.
    }
  }, [soundEnabled]);

  return { soundEnabled, setSoundEnabled, playChime };
}
