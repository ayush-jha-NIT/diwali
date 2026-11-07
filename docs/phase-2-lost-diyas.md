# Phase 2: The Lost Diyas

## Story
The garden is asleep beneath a violet midnight sky. Five floating diyas are positioned around a dark reflecting pool. KUHU is never named or spoiled here. The viewer lights any three; each ignites with a bright golden aura and releases a magical butterfly. The pool and the horizon warm with each step. Completing three reveals a floating gold key, the promise of the next scene, and unlocks **Follow the glow**.

## Visual direction
- Midnight purple garden, glowing moon, distant pavilion silhouettes and soft water reflections.
- Hand-built responsive scenery using gradients, SVG, transparent foliage, fireflies and drifting flower petals.
- Five tappable diyas with floating plinths, shimmering metal bowls and individual numbers.
- Strong golden light blooms on successful taps and a subtle key-reveal animation.
- Lightweight animation: CSS ambient motion, GSAP scene entrance, three opt-in chimes.
- No third-party asset or image requests.

## Interaction contract
- Exactly three unique taps required; five available choices.
- Previously lit diyas cannot be counted again.
- Remaining unlit diyas become disabled after the third successful activation.
- CTA remains disabled until success, then proceeds directly to the existing Rangoli scene.
- Progress is announced by a polite aria-live status area; buttons have descriptive labels and aria-pressed state.
- No auto-advance. The viewer controls the pace of the reveal.
- Honors OS reduced-motion preference and supports keyboard input.
- Chapter index is persisted by the global scene controller; individual puzzle taps reset if the page is refreshed while still in this chapter.

## Quality gates
- The prior full journey and Phase 1 tests remain green.
- Dedicated Phase 2 tests cover the gate, alternate 3-of-5 choice, keyboard, accessibility labels, completion state, and no accidental KUHU reveal.
- Mobile and desktop screenshot captures for a dark garden and completed key scene.
- Responsive acceptance at 320, 360, 390, 430, 768, 1024, 1366 and 1920px widths without horizontal overflow or clipped controls.
- GitHub Actions TypeScript, ESLint, Next.js production build, Playwright and public Vercel URL health check.

## Scope boundaries
The following Rangoli, Wishing Stars, Letter, Skyshot and grand finale retain their current functional MVP. Their final cinematic polish belongs to their own development phases.
