const stars = Array.from({ length: 75 }, (_, i) => {
  const seed = (i * 73 + 19) % 101;
  return {
    id: i,
    x: (i * 43.79 + 8) % 100,
    y: (i * 19.37 + 13) % 100,
    size: i % 11 === 0 ? 3 : i % 4 === 0 ? 2 : 1,
    delay: (seed % 23) / 4,
    duration: 2.6 + (i % 6) * 0.7,
  };
});

export function SparkField() {
  return (
    <div className="spark-field" aria-hidden="true">
      {stars.map((star) => (
        <span
          className="spark-point"
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
