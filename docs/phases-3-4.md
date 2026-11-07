# Phase 3 & Phase 4 delivery notes

## Phase 3: Enchanted Rangoli

A moonlit courtyard with a hand-built floral rangoli. Eight petal sockets surround a glowing center; four are missing. Each can be completed either by tapping its glowing position or by dragging the corresponding numbered color from the tray. Completed petals become inert and cannot be counted twice. On the fourth placement, a golden light wave and illuminated lotus appear, revealing the CTA that leads to the Wishing Stars.

- Components: src/components/scenes/rangoli.tsx, src/components/effects/rangoli-atmosphere.tsx.
- Motion: GSAP chapter entrance, CSS ambient particles and light effects.
- Interaction: pointer drag-and-drop, tap, keyboard Enter, fixed hit areas, unique completion and sound cue.
- Reduced motion: operating-system preference removes decorative animation but preserves completion.
- Accessibility: labeled buttons, disabled states, polite live progress and visually distinguishable targets.

## Phase 4: Wishing Stars

A layered midnight-blue galaxy with 74 lightweight light motes, pastel nebula, distant mountains and five constellation stars. The viewer touches them from left to right in strict sequence. Lines form between the activated stars. When all five connect, a shooting-star animation delivers a glowing gift box. The Make a wish CTA then opens the Hidden Letter.

- Components: src/components/scenes/wishing-stars.tsx, src/components/effects/wishing-sky-atmosphere.tsx.
- Animation: GSAP entrance with stable button hitboxes, glowing line segments, nebula, meteor and gift.
- Accessibility: labeled star buttons and status, keyboard support, reduced-motion mode.
- No reveal of KUHU until the final scene.

## Regression, QA and release

- Existing 26 end-to-end tests for the seven-scene journey, invitation and diyas must remain green.
- New browser tests cover Rangoli 4-of-4 unique completion, actual mouse drag, tap/keyboard, gate and next scene.
- New tests cover star sequence gating, five connections, gift reveal and next scene.
- Both include reduced-motion and animated-interaction tests, phone and desktop screenshots, and eight viewport sizes.
- GitHub Actions validates TypeScript, lint, Next.js production build, Playwright and the public Vercel page.
- Later phases still required: Hidden Letter, Skyshot Launch and particle Fireworks Finale cinematic finishing.
