/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  partOne: string;
  partTwo: string;
  speed?: number;
  delay?: number;
  gapClassName?: string;
  className?: string;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

function GradientLetter({
  letter,
  index,
  visible,
}: {
  letter: string;
  index: number;
  visible: boolean;
}) {
  if (letter === ' ') {
    return <span className="inline-block w-[0.3em]" />;
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 18, scale: 0.85, filter: 'blur(6px)' }}
      animate={
        visible
          ? {
              opacity: 1,
              y: [18, -3, 0],
              scale: 1,
              filter: 'blur(0px)',
            }
          : { opacity: 0, y: 18, scale: 0.85, filter: 'blur(6px)' }
      }
      transition={{
        duration: 0.65,
        delay: index * 0.06,
        ease: EASE,
      }}
      className="inline-block bg-gradient-to-br from-[#A55A42] via-[#8C82B6] to-[#F2B5A0] bg-clip-text text-transparent"
      style={{
        textShadow: '0 0 24px rgba(140, 130, 182, 0.15)',
      }}
    >
      {letter}
    </motion.span>
  );
}

export default function TypewriterText({
  partOne,
  partTwo,
  speed = 46,
  delay = 400,
  gapClassName = 'mx-[0.35em] md:mx-[0.5em]',
  className = '',
}: TypewriterTextProps) {
  const full = partOne + partTwo;
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started || count >= full.length) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [started, count, full.length, speed]);

  const oneVisible = partOne.slice(0, Math.min(count, partOne.length));
  const twoCount = Math.max(0, count - partOne.length);
  const twoChars = partTwo.split('');
  const showGap = count > partOne.length;

  return (
    <span className={`inline-flex items-baseline whitespace-nowrap ${className}`}>
      <span>{oneVisible}</span>
      {showGap && <span className={gapClassName} aria-hidden />}
      <span className="inline-flex">
        {twoChars.map((char, i) => (
          <GradientLetter
            key={`${char}-${i}`}
            letter={char}
            index={i}
            visible={i < twoCount}
          />
        ))}
      </span>
      <span
        className={`ml-1 inline-block w-[2px] h-[0.85em] bg-gradient-to-b from-[#8C82B6] to-[#A55A42] ${
          count < full.length ? 'animate-pulse' : 'opacity-0'
        }`}
        aria-hidden
      />
    </span>
  );
}
