"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LOOP_SECONDS, PIANO_SCORE, type PianoNote } from "@/lib/original-piano-score";

// When this user-provided recording is installed under public/audio,
// it replaces the original piano everywhere on the website.
export const HEERIYE_TRACK = "/audio/heeriye-flute-cover.mp3";
type PlaybackState = "checking" | "playing" | "tap" | "muted";
type Source = "heeriye" | "piano-fallback";
type PianoEngine = { context: AudioContext; gain: GainNode; interval: number };

function sceneVolume(scene: number) {
  if (scene === 4) return .105; // The personal letter
  if (scene === 5) return .16;  // Rocket launch
  if (scene === 6) return .19;  // Fireworks
  return .16;
}

function schedulePianoNote(context: AudioContext, output: GainNode, note: PianoNote, at: number) {
  const begin = at + note.at;
  const pad = note.role === "pad";
  const lead = note.role === "melody";
  const duration = note.duration;
  const volume = pad ? .018 : lead ? .19 : note.role === "bass" ? .075 : .072;
  const attack = pad ? .17 : .012;
  const envelope = context.createGain();
  envelope.gain.setValueAtTime(.00001, begin);
  envelope.gain.exponentialRampToValueAtTime(volume, begin + attack);
  envelope.gain.exponentialRampToValueAtTime(
    Math.max(.00002, volume * (pad ? .58 : .28)), begin + Math.max(attack + .06, duration * .45),
  );
  envelope.gain.exponentialRampToValueAtTime(.00001, begin + duration);
  envelope.connect(output);

  const main = context.createOscillator();
  main.type = "sine";
  main.frequency.value = note.frequency;
  main.connect(envelope);
  main.start(begin);
  main.stop(begin + duration + .02);

  if (!pad) {
    const overtone = context.createOscillator();
    const overtoneGain = context.createGain();
    overtone.type = "sine";
    overtone.frequency.value = note.frequency * (lead ? 2.005 : 2);
    overtoneGain.gain.value = lead ? .21 : .13;
    overtone.connect(overtoneGain);
    overtoneGain.connect(envelope);
    overtone.start(begin);
    overtone.stop(begin + duration + .02);
    overtone.onended = () => { overtone.disconnect(); overtoneGain.disconnect(); };
  }
  main.onended = () => { main.disconnect(); envelope.disconnect(); };
}

export function useSound(scene: number) {
  // Sound is ON by default, as requested. Actual audible autoplay may be
  // blocked by the visitor's browser until a direct user gesture.
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("checking");
  const [source, setSource] = useState<Source>("heeriye");
  const enabledRef = useRef(true);
  const explicitMuteRef = useRef(false);
  const gestureRef = useRef(false);
  const sceneRef = useRef(scene);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<Source>("heeriye");
  const pianoRef = useRef<PianoEngine | null>(null);
  const chimeRef = useRef<AudioContext | null>(null);

  const stopPiano = useCallback(() => {
    const engine = pianoRef.current;
    pianoRef.current = null;
    if (!engine) return;
    window.clearInterval(engine.interval);
    try {
      engine.gain.gain.setTargetAtTime(.00001, engine.context.currentTime, .02);
      void engine.context.close().catch(() => undefined);
    } catch { /* Audio must never block the story. */ }
  }, []);

  const startPianoFallback = useCallback(() => {
    if (typeof window === "undefined" || !window.AudioContext || !enabledRef.current) return;
    const existing = pianoRef.current;
    if (existing) {
      void existing.context.resume().then(() => {
        if (enabledRef.current) setPlaybackState("playing");
      }).catch(() => setPlaybackState("tap"));
      return;
    }
    try {
      const context = new window.AudioContext();
      const gain = context.createGain();
      gain.gain.value = sceneVolume(sceneRef.current);
      gain.connect(context.destination);
      let nextLoop = context.currentTime + .06;
      const schedule = () => {
        if (context.state === "closed") return;
        while (nextLoop < context.currentTime + 2.5) {
          for (const note of PIANO_SCORE) schedulePianoNote(context, gain, note, nextLoop);
          nextLoop += LOOP_SECONDS;
        }
      };
      schedule();
      pianoRef.current = { context, gain, interval: window.setInterval(schedule, 800) };
      if (gestureRef.current) {
        void context.resume().then(() => {
          if (enabledRef.current) setPlaybackState("playing");
        }).catch(() => setPlaybackState("tap"));
      } else {
        // A browser may refuse auto-created Web Audio contexts as well.
        setPlaybackState("tap");
      }
    } catch {
      setPlaybackState("tap");
    }
  }, []);

  const trySong = useCallback(() => {
    const audio = audioRef.current;
    if (!enabledRef.current) return;
    if (sourceRef.current === "piano-fallback") {
      startPianoFallback();
      return;
    }
    if (!audio) return;
    try {
      const started = audio.play();
      if (started) {
        void started.then(() => {
          if (enabledRef.current && sourceRef.current === "heeriye") setPlaybackState("playing");
        }).catch(() => {
          if (enabledRef.current && sourceRef.current === "heeriye") setPlaybackState("tap");
        });
      }
    } catch {
      setPlaybackState("tap");
    }
  }, [startPianoFallback]);

  useEffect(() => {
    const audio = new Audio(HEERIYE_TRACK);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = sceneVolume(sceneRef.current);
    audioRef.current = audio;

    const error = () => {
      if (sourceRef.current !== "heeriye") return;
      // A missing repository media asset should never break the surprise.
      sourceRef.current = "piano-fallback";
      setSource("piano-fallback");
      if (enabledRef.current) startPianoFallback();
    };
    audio.addEventListener("error", error);
    // Attempt audible autoplay on landing, observing the Promise asynchronously.
    // This also avoids synchronous React state changes during effect setup.
    try {
      const attempt = audio.play();
      if (attempt) void attempt.then(() => {
        if (enabledRef.current && sourceRef.current === "heeriye") setPlaybackState("playing");
      }).catch(() => {
        if (enabledRef.current && sourceRef.current === "heeriye") setPlaybackState("tap");
      });
    } catch {
      queueMicrotask(() => { if (enabledRef.current) setPlaybackState("tap"); });
    }

    return () => {
      audio.removeEventListener("error", error);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [startPianoFallback, trySong]);

  const activate = useCallback(() => {
    gestureRef.current = true;
    if (explicitMuteRef.current || !enabledRef.current) return;
    if (sourceRef.current === "piano-fallback") startPianoFallback();
    else trySong(); // Called synchronously inside the first user click.
  }, [trySong, startPianoFallback]);

  const toggleSound = useCallback(() => {
    // If autoplay was blocked, the first sound-button tap starts playback.
    if (enabledRef.current && playbackState === "tap") {
      activate();
      return;
    }
    if (enabledRef.current) {
      enabledRef.current = false;
      explicitMuteRef.current = true;
      audioRef.current?.pause();
      stopPiano();
      const chime = chimeRef.current;
      if (chime && chime.state === "running") void chime.suspend().catch(() => undefined);
      setSoundEnabled(false);
      setPlaybackState("muted");
    } else {
      enabledRef.current = true;
      explicitMuteRef.current = false;
      setSoundEnabled(true);
      activate();
    }
  }, [activate, playbackState, stopPiano]);

  const playChime = useCallback((pitch = 660) => {
    if (!enabledRef.current || typeof window === "undefined" || !window.AudioContext) return;
    try {
      const context = chimeRef.current ?? new AudioContext();
      chimeRef.current = context;
      if (context.state === "suspended") void context.resume().catch(() => undefined);
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, now + .15);
      gain.gain.setValueAtTime(.00001, now);
      gain.gain.exponentialRampToValueAtTime(.032, now + .014);
      gain.gain.exponentialRampToValueAtTime(.00001, now + .35);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start(now);
      osc.stop(now + .38);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    } catch { /* Sound is never required to complete a puzzle. */ }
  }, []);

  useEffect(() => {
    sceneRef.current = scene;
    const audio = audioRef.current;
    if (audio) audio.volume = sceneVolume(scene);
    const piano = pianoRef.current;
    if (piano && piano.context.state !== "closed") {
      piano.gain.gain.setTargetAtTime(sceneVolume(scene), piano.context.currentTime, .85);
    }
  }, [scene]);

  useEffect(() => {
    const change = () => {
      if (document.hidden) {
        audioRef.current?.pause();
        const engine = pianoRef.current;
        if (engine) void engine.context.suspend().catch(() => undefined);
      } else if (enabledRef.current) {
        trySong();
      }
    };
    document.addEventListener("visibilitychange", change);
    return () => {
      document.removeEventListener("visibilitychange", change);
      audioRef.current?.pause();
      stopPiano();
      const chime = chimeRef.current;
      chimeRef.current = null;
      if (chime) void chime.close().catch(() => undefined);
    };
  }, [trySong, stopPiano]);

  return {
    soundEnabled,
    playbackState,
    source,
    toggleSound,
    startExperienceMusic: activate,
    playChime,
  };
}
