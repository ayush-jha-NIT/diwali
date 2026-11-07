# Phase 1: The Secret Invitation

## Experience
The first scene opens as a mysterious Diwali invitation without disclosing KUHU's identity. A spark travels toward a floating diya; its flame illuminates the scene while a thin ornamental mandala slowly turns. The title and Hinglish message appear in restrained staggered motion, with one accessible CTA opening chapter two.

## UI system
- Desktop: editorial message paired with hand-drawn ornamental diya artwork.
- Mobile: vertically stacked artwork, message and CTA.
- Full-screen background: deterministic fireflies, crescent-like moon glow, distant city silhouette, purple haze.
- Accent colors: gold and rose against the project's midnight purple.
- Pointer parallax is desktop mouse-only and disabled by reduced-motion preference.
- No fetched images, video or font assets beyond the existing Next.js fonts.
- KUHU's name remains hidden until the final fireworks scene.

## Motion and interaction
- GSAP provides the intro sequence, from spark to diya, mandala and typographic reveal.
- All GSAP animations live inside the React-scoped context and clean up on scene transitions.
- OS prefers-reduced-motion disables decorative motion and leaves the title and CTA accessible.
- Interactive CTA plays an optional chime only if the user enabled sound.
- Scene navigation reuses the Phase 0 animated portal wipe and progress storage.

## QA
- TypeScript, ESLint and Next.js production build must pass.
- Existing seven-chapter browser integration tests must pass.
- Phase 1 tests cover desktop + mobile animations, reduced motion, keyboard navigation, identity secrecy and widths from 320 to 1920.
- Preserve screenshots as CI artifacts for visual review.
- Verify the production URL returns the new build with Git integration.

## Beyond Phase 1
Further tuning of puzzles, the letter, skyshot and finale belongs to their own phases. Do not treat placeholder chapter effects as final production VFX.
