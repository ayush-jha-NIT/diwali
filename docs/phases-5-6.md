# Phases 5 & 6: Hidden Letter and Final Spark

## Phase 5: The Hidden Letter
A moonlit courtyard with hanging lanterns, a hand-crafted embossed envelope, crossed ribbons and a heart-shaped wax seal. Activating the seal begins a timed flap-unfold animation. The envelope is replaced with warm parchment featuring the existing approved Hinglish note, preserved exactly in meaning and emotional tone. The sender signs the note as Ayush; KUHU's name stays concealed until the final fireworks.

- One-time open interaction with explicit sealed, opening, and open states.
- Native button activation (mouse, tap, keyboard), opt-in chime.
- Cleared animation timer on unmount; reduced-motion mode opens immediately.
- Focus moves to the readable note with a labeled region.
- Existing "There's one more thing" CTA proceeds to Phase 6.
- All visual assets use procedural SVG, CSS and deterministic particles.

## Phase 6: The Final Spark
An illuminated rooftop at night with distant architecture, horizon city lights, a moon, two ornamental orbits, a 71-point starfield and a custom CSS rocket. The user may click the launch button or swipe up over the launch zone to ignite the skyshot. A short ignition phase precedes the rocket's upward flight; the flare pauses briefly before transitioning to the existing Grand Finale.

- Native touch/mouse pointer swipe (threshold: 44 px upward) and keyboard button fallback.
- A guard prevents double launches; timer is cleaned up on unmount.
- Reduced motion skips extended flight and enters the finale promptly.
- Rocket drawn with CSS layers, not a static icon.
- The next chapter remains the existing Grand Finale; particle VFX polish belongs to Phase 7.

## QA gates
- All prior seven-scene integration tests remain green.
- Dedicated letter tests: seal behavior, content, reading focus, repeated activation, mobile/desktop screenshots, responsive widths.
- Dedicated rocket tests: actual upward swipe, tap and keyboard, short/downward gesture rejection, single launch, responsive widths, finale transition.
- GitHub Actions: typecheck, ESLint, Next.js build, Playwright and public Vercel URL smoke test.
- Run screenshots across Chromium mobile and desktop emulation. Physical-device Safari/Android checks remain a separate release task.
