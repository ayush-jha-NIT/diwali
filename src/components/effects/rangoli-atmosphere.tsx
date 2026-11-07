/**
 * Procedural courtyard backdrop. Pure SVG/CSS means no network assets,
 * deterministic rendering, and a lightweight first paint.
 */
const dust = Array.from({ length: 42 }, (_, i) => ({
  id: i,
  x: (i * 47.31 + 9.3) % 100,
  y: (i * 29.77 + 15.6) % 100,
  delay: -((i * 11) % 31) / 5,
  duration: 3.8 + (i % 9) * 0.55,
}));

export function RangoliAtmosphere() {
  return (
    <div className="rangoli-v2__atmosphere" aria-hidden="true">
      <div className="rangoli-v2__warm-haze" />
      <div className="rangoli-v2__moon" />
      <svg className="rangoli-v2__courtyard" viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="courtyard-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#161327" />
            <stop offset=".6" stopColor="#392344" />
            <stop offset="1" stopColor="#161127" />
          </linearGradient>
          <linearGradient id="courtyard-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#36243b" />
            <stop offset="1" stopColor="#111327" />
          </linearGradient>
          <linearGradient id="courtyard-arch" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#39233f" />
            <stop offset="1" stopColor="#0e1024" />
          </linearGradient>
        </defs>
        <rect width="1200" height="620" fill="url(#courtyard-sky)" />
        <path d="M0 0H240V330Q240 220 140 220Q40 220 40 330V0 M960 0H1200V330Q1200 220 1100 220Q1000 220 1000 330V0" fill="url(#courtyard-arch)" />
        <g stroke="#d4a778" strokeOpacity=".23" fill="none" strokeWidth="3">
          <path d="M18 0V345 M258 0V350 M942 0V350 M1182 0V345" />
          <path d="M57 345V318Q57 232 140 232Q223 232 223 318V345 M977 345V318Q977 232 1060 232Q1143 232 1143 318V345" />
          <path d="M0 48H260 M940 48H1200" />
        </g>
        <g fill="#f5c37d" fillOpacity=".56">
          <rect x="65" y="283" width="11" height="19" rx="5" />
          <rect x="198" y="283" width="11" height="19" rx="5" />
          <rect x="993" y="283" width="11" height="19" rx="5" />
          <rect x="1126" y="283" width="11" height="19" rx="5" />
        </g>
        <path d="M0 350Q300 320 600 357Q900 324 1200 350V620H0Z" fill="url(#courtyard-floor)"/>
        <g stroke="#c99b7d" strokeOpacity=".14" fill="none">
          <path d="M0 412H1200 M0 490H1200 M0 585H1200" />
          <path d="M280 350L-60 620 M460 350L310 620 M740 350L860 620 M920 350L1260 620"/>
        </g>
        <g fill="#482a40" opacity=".9">
          <path d="M0 620V395Q27 361 57 380Q78 337 103 369Q132 360 160 393V620Z" />
          <path d="M1200 620V395Q1173 361 1143 380Q1122 337 1097 369Q1068 360 1040 393V620Z" />
        </g>
      </svg>
      <div className="rangoli-v2__floor-glow" />
      {dust.map((particle) => (
        <i
          className="rangoli-v2__dust"
          key={particle.id}
          style={{
            left: particle.x + "%",
            top: particle.y + "%",
            animationDelay: particle.delay + "s",
            animationDuration: particle.duration + "s",
          }}
        />
      ))}
    </div>
  );
}
