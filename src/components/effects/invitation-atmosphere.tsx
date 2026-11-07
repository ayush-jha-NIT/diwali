/**
 * Deterministic visual particles. Stable values avoid hydration mismatches and
 * keep the initial invitation entirely independent of network images/assets.
 */
const emberPoints = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (i * 41.73 + 17) % 100,
  y: (i * 67.91 + 23) % 100,
  size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
  delay: -(i % 13) * 0.7,
  duration: 5.5 + (i % 9) * 1.1,
}));

export function InvitationAtmosphere() {
  return (
    <div className="invitation-art__atmosphere" aria-hidden="true">
      <div className="invitation-art__distant-halo" />
      <div className="invitation-art__nebula invitation-art__nebula--left" />
      <div className="invitation-art__nebula invitation-art__nebula--right" />
      <div className="invitation-art__moon" />
      <div className="invitation-art__haze" />
      <svg className="invitation-art__landscape" viewBox="0 0 1000 300" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="diwali-silhouette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#302544" />
            <stop offset="100%" stopColor="#0a0b1b" />
          </linearGradient>
        </defs>
        <path d="M0 198 L65 198 L65 170 L92 170 L92 150 L113 150 L113 170 L137 170 L137 202 L193 202 L193 143 L225 143 L225 120 L236 98 L247 120 L247 143 L281 143 L281 195 L350 195 L350 163 L380 163 L380 127 L390 114 L400 127 L400 163 L444 163 L444 206 L505 206 L505 145 L529 145 L529 106 L544 79 L559 106 L559 145 L592 145 L592 190 L649 190 L649 168 L677 168 L677 119 L692 94 L707 119 L707 168 L739 168 L739 202 L809 202 L809 158 L843 158 L843 145 L862 145 L862 158 L898 158 L898 187 L950 187 L950 168 L1000 168 L1000 300 L0 300 Z" fill="url(#diwali-silhouette)" />
        <path d="M0 229 Q180 208 330 235 Q540 210 710 233 Q840 211 1000 223 L1000 300 L0 300 Z" fill="#0a0b20" opacity=".85" />
        <g fill="#f4c46e" opacity=".36">
          <rect x="206" y="163" width="3" height="7" rx="1" />
          <rect x="250" y="164" width="3" height="7" rx="1" />
          <rect x="536" y="157" width="4" height="9" rx="1" />
          <rect x="567" y="157" width="4" height="9" rx="1" />
          <rect x="684" y="174" width="3" height="7" rx="1" />
          <rect x="864" y="175" width="3" height="7" rx="1" />
        </g>
      </svg>
      {emberPoints.map((ember) => (
        <span
          key={ember.id}
          className="invitation-art__ember"
          style={{
            left: ember.x + "%",
            top: ember.y + "%",
            width: ember.size + "px",
            height: ember.size + "px",
            animationDelay: ember.delay + "s",
            animationDuration: ember.duration + "s",
          }}
        />
      ))}
    </div>
  );
}
