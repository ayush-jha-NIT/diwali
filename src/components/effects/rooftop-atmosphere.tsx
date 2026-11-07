/** Stable procedural rooftop ambience, no image downloads or WebGL. */
const stars = Array.from({ length: 71 }, (_, i) => ({
  id: i, x: (i * 61.33 + 7.2) % 100, y: (i * 47.37 + 11.4) % 76,
  size: i % 11 === 0 ? 3 : (i % 4 === 0 ? 2 : 1),
  delay: -((i * 17) % 31) / 4, duration: 3.5 + (i % 8) * .65,
}));
const windows = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: (i * 23.47 + 4.2) % 96,
  bottom: 5 + (i % 4) * 11,
  opacity: .23 + (i % 6) * .11,
}));
export function RooftopAtmosphere() {
  return (
    <div className="sky-v2__atmosphere" aria-hidden="true">
      <div className="sky-v2__nebula sky-v2__nebula--violet"/>
      <div className="sky-v2__nebula sky-v2__nebula--amber"/>
      <div className="sky-v2__moon"><span/></div>
      <svg className="sky-v2__horizon" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <linearGradient id="roof-city" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#29213c"/><stop offset="1" stopColor="#0a0c22"/>
          </linearGradient>
          <linearGradient id="roof-parapet" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#54405b"/><stop offset=".4" stopColor="#251d39"/><stop offset="1" stopColor="#090b1c"/>
          </linearGradient>
        </defs>
        <path d="M0 440H66V379H98V353H140V386H193V430H246V343H300V318H333V359H388V434H471V391H510V335H546V390H620V441H676V361H729V323H747V378H825V434H875V359H908V327H938V361H978V437H1039V389H1073V346H1117V388H1180V438H1227V359H1270V377H1310V435H1400V650H0Z" fill="url(#roof-city)" opacity=".82"/>
        <path d="M0 499H1400V650H0Z" fill="url(#roof-parapet)"/>
        <path d="M0 497H1400" stroke="#d0a47b" strokeOpacity=".5" strokeWidth="5"/>
        <path d="M0 515H1400" stroke="#21172c" strokeOpacity=".65" strokeWidth="9"/>
        <g stroke="#e4b67b" strokeOpacity=".14" strokeWidth="2" fill="none">
          <path d="M0 544H1400 M0 593H1400 M105 500L13 650 M390 500L340 650 M720 500L760 650 M1110 500L1190 650"/>
        </g>
        <g fill="#edca92" opacity=".37">
          <rect x="272" y="374" width="6" height="13" rx="1"/>
          <rect x="319" y="387" width="6" height="13" rx="1"/>
          <rect x="687" y="398" width="6" height="13" rx="1"/>
          <rect x="889" y="385" width="6" height="13" rx="1"/>
          <rect x="1083" y="396" width="6" height="13" rx="1"/>
          <rect x="1252" y="404" width="6" height="13" rx="1"/>
        </g>
      </svg>
      {stars.map(star=>(
        <i
          key={star.id}
          className="sky-v2__ambient-star"
          style={{
            left: star.x+"%", top:star.y+"%",
            width:star.size+"px",height:star.size+"px",
            animationDelay:star.delay+"s",animationDuration:star.duration+"s",
          }}
        />
      ))}
      {windows.map(window=>(
        <i
          key={window.id}
          className="sky-v2__window"
          style={{
            left: window.left+"%",bottom:window.bottom+"%",
            opacity:window.opacity,
          }}
        />
      ))}
    </div>
  );
}
