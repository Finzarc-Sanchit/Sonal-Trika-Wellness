/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion } from 'motion/react';

interface StardustBackgroundProps {
  className?: string;
  count?: number;
  opacity?: number;
}

export default function StardustBackground({
  className = '',
  count = 48,
  opacity = 0.45,
}: StardustBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 6,
        duration: 4 + Math.random() * 8,
        drift: 12 + Math.random() * 28,
      })),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-[#CBBD93]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 3}px rgba(203, 189, 147, 0.6)`,
          }}
          animate={{
            y: [0, -p.drift, 0],
            x: [0, p.drift * 0.3, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
