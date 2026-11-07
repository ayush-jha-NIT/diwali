"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LOOP_SECONDS, PIANO_SCORE, type PianoNote } from "@/lib/original-piano-score";

type MusicEngine = {
  context: AudioContext;
  gain: GainNode;
  interval: number;
};

/** Master values are deliberately restrained so the note stays readable. */
function sceneMusicVolume(scene: number) {
  if (scene === 4) return .075; // The Hidden Letter: nearly whispered
  if (scene === 5) return .11;  // Rocket: a little more spacious
  if (scene === 6) return .15;  // Fireworks: gentle emotional lift
  return .135;
}

function scheduleNote(
  context: AudioContext, output: GainNode, note: PianoNote, at: number,
) {
  const start = at + note.at;
  const duration = note.duration;
  const isPad = note.role === "pad";
  const isLead = note.role === "melody";
  const gain = context.createGain();
  const loudness = isPad ? .018 : isLead ? .19 : note.role === "bass" ? .075 : .072;
  const attack = isPad ? .17 : .012;
  gain.gain.setValueAtTime(.00001, start);
  gain.gain.exponentialRampToValueAtTime(loudness, start + attack);
  gain.gain.exponentialRampToValueAtTime(
    Math.max(.00002, loudness * (isPad ? .58 : .28)), start + Math.max(attack + .06, duration * .45),
  );
  gain.gain.exponentialRampToValueAtTime(.00001, start + duration);
  gain.connect(output);

  const fundamentals = context.createOscillator();
  fundamentals.type = "sine";
  fundamentals.frequency.value = note.frequency;
  fundamentals.connect(gain);
  fundamentals.start(start);
  fundamentals.stop(start + duration + .02);

  if (!isPad) {
    const harmonic = context.createOscillator();
    const harmonicGain = context.createGain();
    harmonic.type = "sine";
    harmonic.frequency.value = note.frequency * (isLead ? 2.005 : 2);
    harmonicGain.gain.value = isLead ? .21 : .13;
    harmonic.connect(harmonicGain);
    harmonicGain.connect(gain);
    harmonic.start(start);
    harmonic.stop(start + duration + .02);
  }

  fundamentals.onended = () => {
    fundamentals.disconnect();
    gain.disconnect();
  };
}

/**
 * Original generative piano soundtrack (not a recording of "Heeriye").
 * Starts synchronously from user interaction because mobile autoplay is blocked.
 */
export function useSound(scene: number) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const enabledRef = useRef(false);
  const userMutedRef = useRef(false);
  const engineRef = useRef<MusicEngine | null>(null);
  const sceneRef = useRef(scene);

  const stop = useCallback(() => {
    const engine = engineRef.current;
    engineRef.current = null;
    if (!engine) return;
    window.clearInterval(engine.interval);
    try {
      engine.gain.gain.setTargetAtTime(.00001, engine.context.currentTime, .025);
      void engine.context.close().catch(() => undefined);
    } catch {
      // The page must remain navigable if browser audio is unavailable.
    }
  }, []);

  const start = useCallback(() => {
    if (engineRef.current || typeof window === "undefined" || !window.AudioContext) return;
    try {
      const context = new window.AudioContext();
      const gain = context.createGain();
      gain.gain.value = sceneMusicVolume(sceneRef.current);
      gain.connect(context.destination);
      let nextLoop = context.currentTime + .08;

      const scheduleAhead = () => {
        if (context.state === "closed") return;
        while (nextLoop < context.currentTime + 2.5) {
          for (const note of PIANO_SCORE) scheduleNote(context, gain, note, nextLoop);
          nextLoop += LOOP_SECONDS;
        }
      };
      scheduleAhead();
      const interval = window.setInterval(scheduleAhead, 700);
      engineRef.current = { context, gain, interval };
      if (context.state === "suspended") void context.resume().catch(() => undefined);
    } catch {
      stop();
    }
  }, [stop]);

  const toggleSound = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    userMutedRef.current = !next;
    if (next) start();
    else stop();
    setSoundEnabled(next);
  }, [start, stop]);

  const startExperienceMusic = useCallback(() => {
    // Respect the recipient's explicit decision to mute before continuing.
    if (userMutedRef.current) return;
    enabledRef.current = true;
    start(); // Called directly by the invitation button's user gesture.
    setSoundEnabled(true);
  }, [start]);

  const playChime = useCallback((pitch = 660) => {
    if (!enabledRef.current) return;
    try {
      const context = engineRef.current?.context;
      if (!context || context.state === "closed") return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(pitch, now);
      oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.28, now + .17);
      gain.gain.setValueAtTime(.00001, now);
      gain.gain.exponentialRampToValueAtTime(.054, now + .014);
      gain.gain.exponentialRampToValueAtTime(.00001, now + .39);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + .41);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    } catch {
      // No audio failures should interrupt the interactions.
    }
  }, []);

  useEffect(() => {
    sceneRef.current = scene;
    const engine = engineRef.current;
    if (!engine) return;
    const time = engine.context.currentTime;
    engine.gain.gain.setTargetAtTime(sceneMusicVolume(scene), time, .85);
  }, [scene]);

  useEffect(() => {
    const onVisibility = () => {
      const engine = engineRef.current;
      if (!engine) return;
      if (document.hidden) void engine.context.suspend().catch(() => undefined);
      else if (enabledRef.current) void engine.context.resume().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [stop]);

  return { soundEnabled, toggleSound, startExperienceMusic, playChime };
}
