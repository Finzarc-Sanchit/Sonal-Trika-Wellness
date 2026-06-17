/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface ConcentricArcsProps {
  className?: string;
  variant?: 'warm' | 'violet' | 'sage';
  opacity?: number;
}

export default function ConcentricArcs({
  className = '',
  variant = 'warm',
  opacity = 0.25,
}: ConcentricArcsProps) {
  const strokes = {
    warm: ['#D8C5A4', '#A55A42', '#aa8855'],
    violet: ['#5c2999', '#7A8B6F', '#D8C5A4'],
    sage: ['#7A8B6F', '#D8C5A4', '#A55A42'],
  }[variant];

  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 400 400"
      fill="none"
      aria-hidden
      style={{ opacity }}
    >
      {[160, 120, 80, 40].map((r, i) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke={strokes[i % strokes.length]}
          strokeWidth="1.5"
        />
      ))}
      <path
        d="M 200 40 A 160 160 0 0 1 360 200"
        stroke={strokes[0]}
        strokeWidth="1.5"
      />
      <path
        d="M 40 200 A 160 160 0 0 1 200 360"
        stroke={strokes[1]}
        strokeWidth="1.5"
      />
    </svg>
  );
}
