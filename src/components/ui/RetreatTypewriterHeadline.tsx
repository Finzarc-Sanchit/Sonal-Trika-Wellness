/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface RetreatTypewriterHeadlineProps {
  text: string;
  speed?: number;
  className?: string;
}

export default function RetreatTypewriterHeadline({
  text,
  speed = 42,
  className = '',
}: RetreatTypewriterHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!inView || done) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [inView, count, done, speed, text.length]);

  return (
    <h2
      ref={ref}
      className={`font-display text-[40px] md:text-[48px] leading-[1.05] tracking-tight text-[#2B2B2B] ${className || 'text-center max-w-3xl mx-auto'}`}
    >
      <span>{text.slice(0, count)}</span>
      {!done && inView && (
        <motion.span
          className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-[#A55A42]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden
        />
      )}
    </h2>
  );
}
