# Phase 7 Release: The Sky Belongs to You

## Particle finale
KUHU is assembled from individually sampled particle targets. Each letter has an equal particle quota, preserving legibility on mobile. Deterministic seeded sampling, fireworks bursts and glowing particles combine into the finale; no static text image or HTML name overlay is used during normal animation.

The 2D canvas uses adaptive frame caps (mobile 30 FPS, desktop 60 FPS), limited device pixel ratio, a strict fireworks particle budget, and animation lifecycle cleanup. Resize and orientation changes resample targets to fit the name slot. Reduced-motion users or unsupported canvas engines see a readable gold text alternative.

## Share readiness
The link preview includes a diya illustration and mysterious message without revealing KUHU. Open Graph/Twitter metadata and an app icon are included. Search engine indexing is disabled. The experience needs no login, APIs, payments, external images, audio permissions or cookies.

## Tests and release gates
The entire seven-scene journey runs from initial invitation to end and replay. Dedicated tests check actual canvas pixels, particle counts, name assembly completion, reduced-motion fallback, 320 to 1920 px layout, PNG share image, no-index metadata, and fresh-visitor opening. CI must pass TypeScript, ESLint, production build, Chromium e2e and public URL verification.

Canonical share URL: https://diwali-kuhu.vercel.app

Physical-device iOS Safari and Android Chrome testing is outside browser emulation and is not claimed.
