/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GradientDots } from './gradient-dots';
import StardustBackground from './StardustBackground';

function SoundRipples({ reducedMotion }: { reducedMotion: boolean }) {
  const ripples = [
    { top: '18%', duration: 52, delay: 0, opacity: 0.07 },
    { top: '48%', duration: 58, delay: 8, opacity: 0.06 },
    { top: '72%', duration: 45, delay: 4, opacity: 0.08 },
  ];

  return (
    <>
      {ripples.map((ripple, i) => (
        <motion.div
          key={i}
          className="absolute left-0 w-[200%] h-24 pointer-events-none"
          style={{ top: ripple.top, opacity: ripple.opacity }}
          aria-hidden
          animate={
            reducedMotion
              ? undefined
              : { x: ['0%', '-50%'] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: ripple.duration,
                  delay: ripple.delay,
                  ease: 'linear',
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
        >
          <svg
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            className="w-full h-full"
            aria-hidden
          >
            <path
              d="M0,40 Q150,10 300,40 T600,40 T900,40 T1200,40"
              fill="none"
              stroke={i === 1 ? '#A55A42' : '#7A8B6F'}
              strokeWidth="1.5"
            />
            <path
              d="M0,55 Q150,25 300,55 T600,55 T900,55 T1200,55"
              fill="none"
              stroke="#D8C5A4"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

export default function RetreatAmbientBackground() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none bg-[#f6f3ee]"
      aria-hidden
    >
      {!reducedMotion && (
        <>
          <GradientDots
            backgroundColor="#f6f3ee"
            dotColor="#CBBD93"
            opacity={0.25}
            duration={40}
          />
          <StardustBackground count={36} opacity={0.2} />
          <SoundRipples reducedMotion={false} />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f6f3ee]/40 via-transparent to-[#f6f3ee]/60" />
    </div>
  );
}
