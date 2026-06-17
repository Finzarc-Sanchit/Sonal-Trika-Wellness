/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface ServiceTypewriterHeadlineProps {
  text: string;
  speed?: number;
  className?: string;
  accentWord?: string;
}

export default function ServiceTypewriterHeadline({
  text,
  speed = 38,
  className = '',
  accentWord,
}: ServiceTypewriterHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!inView || done) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [inView, count, done, speed, text.length]);

  const renderText = () => {
    if (!accentWord || !text.includes(accentWord)) {
      return text.slice(0, count);
    }

    const idx = text.indexOf(accentWord);
    const before = text.slice(0, Math.min(count, idx));
    const accentLen = Math.max(0, Math.min(count - idx, accentWord.length));
    const afterStart = idx + accentWord.length;
    const after = count > afterStart ? text.slice(afterStart, count) : '';

    return (
      <>
        {before}
        {accentLen > 0 && (
          <span className="italic font-light text-[#8C82B6]">
            {accentWord.slice(0, accentLen)}
          </span>
        )}
        {after}
      </>
    );
  };

  return (
    <h3
      ref={ref}
      className={`font-display text-[clamp(1.5rem,5vw,3rem)] leading-[1.05] tracking-tight text-[#2B2B2B] text-balance min-w-0 ${className}`}
    >
      <span>{renderText()}</span>
      {!done && inView && (
        <motion.span
          className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-[#A55A42]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden
        />
      )}
    </h3>
  );
}
