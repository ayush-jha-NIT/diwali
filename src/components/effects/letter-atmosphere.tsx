/**
 * No downloaded media: deterministic floating lights and SVG lanterns keep
 * the personal letter lightweight, stable during SSR, and available offline.
 */
const lights = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: (i * 57.31 + 12.8) % 100,
  y: (i * 43.37 + 10.1) % 100,
  size: i % 9 === 0 ? 3 : 1 + (i % 2),
  delay: -((i * 7) % 23) / 3,
  duration: 4 + (i % 7) * 1.3,
}));

export function LetterAtmosphere() {
  return (
    <div className="letter-v2__atmosphere" aria-hidden="true">
      <div className="letter-v2__aurora" />
      <div className="letter-v2__warm-pool" />
      <div className="letter-v2__moon" />
      <svg className="letter-v2__architecture" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <linearGradient id="letter-arch" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#32203e" /><stop offset="1" stopColor="#100d26" />
          </linearGradient>
          <linearGradient id="letter-floor" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#3d293c" /><stop offset="1" stopColor="#0d1025" />
          </linearGradient>
        </defs>
        <path d="M0 0H280V380Q280 235 140 235Q0 235 0 380Z M1120 0H1400V380Q1400 235 1260 235Q1120 235 1120 380Z" fill="url(#letter-arch)" />
        <path d="M0 365H1400V700H0Z" fill="url(#letter-floor)" opacity=".73"/>
        <g fill="none" stroke="#d4a779" strokeOpacity=".18" strokeWidth="2">
          <path d="M15 0V360M268 0V365M1133 0V360M1385 0V365"/>
          <path d="M42 355V343Q42 248 140 248Q238 248 238 343V355 M1162 355V343Q1162 248 1260 248Q1358 248 1358 343V355"/>
          <path d="M0 62H280M1120 62H1400M0 485H1400M0 570H1400"/>
          <path d="M420 366L165 700M980 366L1230 700"/>
        </g>
        <g fill="#ebb57b" opacity=".45">
          <rect x="57" y="319" width="15" height="23" rx="8"/>
          <rect x="207" y="319" width="15" height="23" rx="8"/>
          <rect x="1177" y="319" width="15" height="23" rx="8"/>
          <rect x="1327" y="319" width="15" height="23" rx="8"/>
        </g>
      </svg>
      <span className="letter-v2__lantern letter-v2__lantern--left"><i /></span>
      <span className="letter-v2__lantern letter-v2__lantern--right"><i /></span>
      {lights.map(light => (
        <i
          key={light.id}
          className="letter-v2__mote"
          style={{
            left: light.x + "%",
            top: light.y + "%",
            width: light.size + "px",
            height: light.size + "px",
            animationDelay: light.delay + "s",
            animationDuration: light.duration + "s",
          }}
        />
      ))}
    </div>
  );
}
