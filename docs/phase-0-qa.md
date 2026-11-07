# Phase 0 QA and deployment checklist

## Scope
Phase 0 defines the entire experience's foundation: build setup, theme and typography, seven-scene router, reusable GSAP chapter transitions, local persistence, accessible controls, responsive layout, opt-in sound and reduced-motion handling. Scenes 1-7 contain an initial interactive MVP; cinematic quality upgrades belong to later polish phases.

## Automated gates (GitHub Actions)
- TypeScript typecheck
- ESLint
- Next.js production build
- Playwright Chromium smoke tests at 390×844 and 1366×768
- Traverse all seven scenes, solve three puzzles, open the letter, launch the skyshot, verify KUHU
- Verify progress restoration and replay
- Verify opt-in sound controls, responsive horizontal overflow, motion-enabled transition
- Collect screenshots and traces as CI artifacts

## Manual visual review
- Test on an actual iOS Safari device and Android Chrome device when available
- Check focus order, touch targets, zoom at 200%, and portrait/landscape
- Watch finale under low-power conditions for dropped frames
- Confirm the public deployment link opens without Vercel authentication
- Verify actual fireworks look and sound meet the desired visual direction

## Phase 0 completion gate
The code foundation is complete when CI succeeds and Vercel reports a successful production deployment. Real-device visual tests and high-end finishing remain explicitly separate from foundational readiness.
