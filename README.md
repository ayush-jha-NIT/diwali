# The Last Spark

A cinematic seven-scene Diwali surprise for **KUHU**, from **Ayush**. Built as a continuous interactive story, with playable puzzles, a Hinglish note and a name reveal made from animated firework particles.

## Stack
Next.js App Router, React 19, TypeScript, Tailwind CSS 4, GSAP, canvas particles, with Three.js and React Three Fiber available for later advanced WebGL effects.

## Run locally
Requires Node.js 20.9+ (Node.js 22 recommended).

1. Clone this repository.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

Validation: `npm run typecheck`, `npm run lint`, `npm run build`.

## Scenes
1. **Secret Invitation**: a glowing diya and personal entrance.
2. **Lost Diyas**: light any three lamps.
3. **Enchanted Rangoli**: complete four missing petals.
4. **Wishing Stars**: connect five stars in order.
5. **Hidden Letter**: unseal a romantic Hinglish note.
6. **Final Spark**: launch a golden skyshot.
7. **Grand Finale**: fireworks become the particle-formed name **KUHU**.

## Features
- Responsive single-route experience; keyboard-accessible interactive elements.
- Progress is saved to localStorage so accidental refreshes preserve the chapter.
- Optional synthesized chimes, muted by default.
- Reduced-motion option follows the operating system and uses static name lettering.
- No backend or environment variables required.
- Metadata discourages search indexing to keep the reveal less discoverable.

## Deployment
Import this repository into Vercel, select its main branch and the Next.js preset. Deploy with no environment variables.

## Status
Interactive initial implementation. Production build, mobile visual QA, high-end effects polishing, comprehensive audio design and Vercel deployment verification remain to be completed.