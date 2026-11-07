/**
 * Procedural starfield: deterministic positions avoid hydration differences.
 * All glows and light motes are pointer-transparent.
 */
const stars = Array.from({ length: 74 }, (_, index) => ({
  id: index,
  x: (index * 73.137 + 18.4) % 100,
  y: (index * 41.931 + 7.2) % 100,
  delay: -((index * 13) % 31) / 4,
  size: index % 12 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
  duration: 2.8 + (index % 7) * 0.72,
}));

export function WishingSkyAtmosphere() {
  return (
    <div className="wishing-v2__atmosphere" aria-hidden="true">
      <div className="wishing-v2__nebula wishing-v2__nebula--violet" />
      <div className="wishing-v2__nebula wishing-v2__nebula--blue" />
      <div className="wishing-v2__nebula wishing-v2__nebula--rose" />
      <div className="wishing-v2__planet" />
      <svg className="wishing-v2__horizon" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <linearGradient id="wishing-mountain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#252141"/>
            <stop offset="1" stopColor="#0b0d22"/>
          </linearGradient>
        </defs>
        <path d="M0 410L65 353L127 390L219 332L298 402L382 355L459 409L531 373L597 395L689 318L742 383L826 351L904 398L1008 329L1095 385L1200 352V500H0Z" fill="url(#wishing-mountain)" opacity=".72"/>
        <path d="M0 445L109 413L207 434L310 403L423 438L535 414L639 445L758 404L891 436L1014 408L1135 430L1200 412V500H0Z" fill="#0a0d22"/>
        <path d="M0 448Q300 424 600 454Q950 419 1200 445" stroke="#9e8bba" strokeOpacity=".17" strokeWidth="2" fill="none" />
      </svg>
      {stars.map((star) => (
        <span
          className="wishing-v2__ambient-star"
          key={star.id}
          style={{
            left: star.x + "%",
            top: star.y + "%",
            width: star.size + "px",
            height: star.size + "px",
            animationDelay: star.delay + "s",
            animationDuration: star.duration + "s",
          }}
        />
      ))}
    </div>
  );
}
