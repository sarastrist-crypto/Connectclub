/** Cobbled Works dot-grid "C" mark — 6 dots forming a C shape */
export default function BrandMark({ size = 32 }: { size?: number }) {
  const r = size / 16;
  const dots = [
    [size * 0.25, size * 0.25],
    [size * 0.55, size * 0.25],
    [size * 0.25, size * 0.50],
    [size * 0.25, size * 0.75],
    [size * 0.55, size * 0.75],
  ] as const;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}
