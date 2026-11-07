import type { CSSProperties } from "react";

const fireflies = Array.from({ length: 46 }, (_, index) => ({
  id: index,
  x: (index * 53.37 + 9.7) % 100,
  y: (index * 31.19 + 13.4) % 90,
  delay: -((index * 7) % 31) / 3,
  duration: 3.4 + (index % 7) * 0.8,
  size: index % 9 === 0 ? 3 : index % 3 === 0 ? 2 : 1,
}));

const petals = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  x: (index * 37.71 + 11) % 100,
  y: (index * 59.17 + 9) % 100,
  delay: -(index % 8) * 1.2,
  duration: 12 + (index % 7) * 1.6,
}));

/**
 * Lightweight SVG garden scenery, with ambient fireflies and flower petals.
 * No background image downloads, WebGL, network access or random values.
 */
export function DiyaGardenAtmosphere() {
  return (
    <div className="diya-garden__atmosphere" aria-hidden="true">
      <div className="diya-garden__sky-glow" />
      <div className="diya-garden__moon-glow" />
      <svg className="diya-garden__backdrop" viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="garden-horizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#222344" />
            <stop offset="58%" stopColor="#1c2035" />
            <stop offset="100%" stopColor="#0a1124" />
          </linearGradient>
          <linearGradient id="garden-pool" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2c2d43" />
            <stop offset="45%" stopColor="#13172b" />
            <stop offset="100%" stopColor="#0c1025" />
          </linearGradient>
          <radialGradient id="garden-water-glow">
            <stop offset="0%" stopColor="#f0bf7a" stopOpacity=".18" />
            <stop offset="100%" stopColor="#f0bf7a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M0 300 Q160 235 280 279 Q430 209 620 260 Q840 211 1000 253 Q1100 219 1200 266 V560 H0Z" fill="url(#garden-horizon)" />
        <path d="M0 336 Q160 296 300 323 Q470 272 620 325 Q830 266 1020 306 Q1150 285 1200 303 V560 H0Z" fill="#10172a" opacity=".87" />
        <g fill="#14182d" stroke="#bda077" strokeOpacity=".13" strokeWidth="2">
          <path d="M72 319 V222 L113 222 L113 203 L133 182 L153 203 L153 222 L194 222 V325 Z" />
          <path d="M490 302 V232 L520 232 L520 213 L555 190 L590 213 L590 232 L621 232 V307Z" />
          <path d="M991 319 V223 L1027 223 L1027 200 L1050 182 L1073 200 L1073 223 L1115 223 V323Z" />
        </g>
        <g fill="#e4b67f" opacity=".49">
          <rect x="124" y="244" width="17" height="23" rx="8"/>
          <rect x="547" y="240" width="16" height="24" rx="8"/>
          <rect x="1042" y="242" width="17" height="23" rx="8"/>
        </g>
        <path d="M0 380 Q245 361 500 376 Q710 364 1200 383 V560 H0Z" fill="url(#garden-pool)" />
        <ellipse cx="600" cy="438" rx="475" ry="121" fill="url(#garden-water-glow)" />
        <g stroke="#efba79" strokeWidth="1.3" opacity=".19" fill="none">
          <path d="M64 400 Q180 394 273 400 M387 415 Q530 408 684 415 M781 395 Q950 389 1121 397" />
          <path d="M166 447 Q360 438 557 449 M626 459 Q841 448 1023 454" />
          <path d="M71 498 Q230 491 396 500 M445 486 Q679 475 852 488" />
        </g>
        <path d="M0 345 Q225 365 412 344 Q600 359 794 341 Q1012 356 1200 334" fill="none" stroke="#62516d" strokeWidth="14" strokeLinecap="round" opacity=".7" />
        <path d="M0 345 Q225 365 412 344 Q600 359 794 341 Q1012 356 1200 334" fill="none" stroke="#b78d70" strokeWidth="2" opacity=".31" />
        <g stroke="#8e7386" strokeOpacity=".4" strokeWidth="6">
          <path d="M48 342 V385 M200 355 V389 M348 352 V381 M499 351 V382 M653 352 V385 M807 352 V383 M961 350 V384 M1100 344 V377"/>
        </g>
        <g fill="#0b1425" opacity=".97">
          <path d="M0 560 V320 Q27 286 57 302 Q70 240 92 275 Q107 241 136 274 Q164 266 178 295 Q204 276 230 318 V560Z" />
          <path d="M1200 560 V311 Q1175 276 1157 303 Q1149 252 1117 279 Q1092 241 1078 269 Q1042 257 1017 305 Q997 276 972 325 V560Z" />
        </g>
        <g stroke="#254332" strokeWidth="3" fill="none" opacity=".7">
          <path d="M42 560 Q10 476 89 415 M85 560 Q76 505 145 459 M1152 560 Q1183 465 1087 407 M1093 560 Q1111 494 1035 464"/>
          <path d="M37 540 Q12 515 19 483 M68 506 Q94 481 109 479 M1148 539 Q1176 504 1162 486"/>
        </g>
        <g fill="#c18d97" opacity=".44">
          <circle cx="89" cy="415" r="4"/>
          <circle cx="145" cy="459" r="3"/>
          <circle cx="1087" cy="407" r="4"/>
          <circle cx="1035" cy="464" r="3"/>
        </g>
      </svg>
      <div className="diya-garden__pool-shimmer" />
      <div className="diya-garden__horizon-lights" />
      {fireflies.map((fly) => (
        <span
          className="diya-garden__firefly"
          key={fly.id}
          style={{
            left: fly.x + "%",
            top: fly.y + "%",
            width: fly.size + "px",
            height: fly.size + "px",
            animationDelay: fly.delay + "s",
            animationDuration: fly.duration + "s",
          }}
        />
      ))}
      {petals.map((petal) => (
        <span
          className="diya-garden__petal"
          key={petal.id}
          style={{
            left: petal.x + "%",
            top: petal.y + "%",
            animationDelay: petal.delay + "s",
            animationDuration: petal.duration + "s",
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
