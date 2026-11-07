"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { experience } from "@/config/experience";
import { useSound } from "@/hooks/use-sound";
import { SparkField } from "@/components/effects/spark-field";
import { useSceneJourney } from "@/hooks/use-scene-journey";
import { Invitation } from "@/components/scenes/invitation";
import { LostDiyas } from "@/components/scenes/lost-diyas";
import { Rangoli } from "@/components/scenes/rangoli";
import { WishingStars } from "@/components/scenes/wishing-stars";
import { HiddenLetter } from "@/components/scenes/hidden-letter";
import { SkyshotLaunch } from "@/components/scenes/skyshot-launch";
import { GrandFinale } from "@/components/scenes/grand-finale";

export type SceneProps = {
  onNext: () => void;
  playChime: (pitch?: number) => void;
};

export function Experience() {
  const { scene, ready, stageRef, veilRef, nextScene, replay } = useSceneJourney();
  const { soundEnabled, setSoundEnabled, playChime } = useSound();

  const current = experience.scenes[scene];

  return (
    <div className="experience">
      <div className="experience__aurora" aria-hidden="true" />
      <SparkField />
      <header className="site-header">
        <div className="site-brand" aria-label="The Last Spark">
          <span className="site-brand__icon">✦</span>
          <span>THE LAST SPARK</span>
        </div>
        <div className="site-actions">
          <span className="chapter-counter" aria-label={"Chapter " + (scene + 1) + " of 7"}>
            {String(scene + 1).padStart(2, "0")} <span>/ 07</span>
          </span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSoundEnabled((enabled) => !enabled)}
            aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          {scene > 0 && (
            <button type="button" className="icon-button" onClick={replay} aria-label="Restart experience" title="Restart">
              <RotateCcw size={17} />
            </button>
          )}
        </div>
      </header>

      <main className="scene-shell" aria-live="polite">
        <div className="scene-transition__veil" aria-hidden="true" ref={veilRef} />
        {ready && (
          <div className="scene-transition__stage" ref={stageRef} tabIndex={-1} data-scene={current.id} aria-label={current.title}>
            <div key={scene} className="scene-enter">
            {scene === 0 && <Invitation onNext={nextScene} playChime={playChime} />}
            {scene === 1 && <LostDiyas onNext={nextScene} playChime={playChime} />}
            {scene === 2 && <Rangoli onNext={nextScene} playChime={playChime} />}
            {scene === 3 && <WishingStars onNext={nextScene} playChime={playChime} />}
            {scene === 4 && <HiddenLetter onNext={nextScene} playChime={playChime} />}
            {scene === 5 && <SkyshotLaunch onNext={nextScene} playChime={playChime} />}
            {scene === 6 && <GrandFinale replay={replay} />}
            </div>
          </div>
        )}
      </main>

      <footer className="experience-footer">
        <span>{current.subtitle}</span>
        <span className="footer-dots" aria-hidden="true">
          {experience.scenes.map((chapter, i) => (
            <span key={chapter.id} className={"footer-dot " + (i <= scene ? "footer-dot--active" : "")} />
          ))}
        </span>
        <span>made with a little magic</span>
      </footer>
    </div>
  );
}
