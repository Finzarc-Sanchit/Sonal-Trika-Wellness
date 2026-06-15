/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface CardMeshOverlayProps {
  className?: string;
}

export default function CardMeshOverlay({ className = '' }: CardMeshOverlayProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <motion.div
        className="absolute inset-0 mix-blend-soft-light opacity-90"
        animate={
          reducedMotion
            ? undefined
            : {
                backgroundPosition: [
                  '0% 0%, 100% 100%, 50% 50%',
                  '100% 50%, 0% 50%, 80% 20%',
                  '50% 100%, 50% 0%, 20% 80%',
                  '0% 0%, 100% 100%, 50% 50%',
                ],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 14,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
              }
        }
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(165, 90, 66, 0.38) 0%, transparent 42%),
            radial-gradient(circle at 80% 80%, rgba(122, 139, 111, 0.35) 0%, transparent 45%),
            radial-gradient(circle at 60% 30%, rgba(216, 197, 164, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, rgba(140, 130, 182, 0.22) 0%, transparent 38%)
          `,
          backgroundSize: '180% 180%, 160% 160%, 200% 200%, 170% 170%',
          backgroundPosition: '0% 0%, 100% 100%, 50% 50%, 30% 70%',
        }}
      />

      <motion.svg
        viewBox="0 0 340 520"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-[0.22]"
        animate={
          reducedMotion
            ? undefined
            : {
                x: [0, -8, 4, 0],
                y: [0, 6, -4, 0],
              }
        }
        transition={
          reducedMotion
            ? undefined
            : {
                duration: 18,
                ease: 'easeInOut',
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      >
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 6 }, (_, col) => {
            const x = col * 68 + 10;
            const y = row * 58 + 10;
            const nextX = (col + 1) * 68 + 10;
            const nextY = (row + 1) * 58 + 10;
            return (
              <g key={`${row}-${col}`}>
                {col < 5 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={nextX}
                    y2={y + (row % 2 === 0 ? 6 : -6)}
                    stroke="rgba(248, 245, 240, 0.55)"
                    strokeWidth="0.75"
                  />
                )}
                {row < 8 && (
                  <line
                    x1={x}
                    y1={y}
                    x2={x + (col % 2 === 0 ? 8 : -8)}
                    y2={nextY}
                    stroke="rgba(216, 197, 164, 0.45)"
                    strokeWidth="0.75"
                  />
                )}
              </g>
            );
          }),
        )}
      </motion.svg>
    </div>
  );
}
