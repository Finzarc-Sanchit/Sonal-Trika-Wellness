/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const LINE_ONE = 'Modalities for';
const LINE_TWO_PREFIX = 'deep ';
const ACCENT_WORD = 'restoration';
const LINE_TWO_FULL = LINE_TWO_PREFIX + ACCENT_WORD;

interface ExperiencesTypewriterHeadlineProps {
  speed?: number;
  className?: string;
}

function Cursor() {
  return (
    <motion.span
      className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-[#A55A42]"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
      aria-hidden
    />
  );
}

export default function ExperiencesTypewriterHeadline({
  speed = 40,
  className = '',
}: ExperiencesTypewriterHeadlineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reducedMotion = useReducedMotion();
  const [lineOneCount, setLineOneCount] = useState(0);
  const [lineTwoCount, setLineTwoCount] = useState(0);

  const lineOneDone = lineOneCount >= LINE_ONE.length;
  const lineTwoDone = lineTwoCount >= LINE_TWO_FULL.length;
  const started = inView || reducedMotion;

  useEffect(() => {
    if (!started || reducedMotion) {
      setLineOneCount(LINE_ONE.length);
      setLineTwoCount(LINE_TWO_FULL.length);
      return;
    }
    if (!lineOneDone) {
      const timer = window.setTimeout(() => setLineOneCount((c) => c + 1), speed);
      return () => window.clearTimeout(timer);
    }
  }, [started, lineOneDone, speed, reducedMotion]);

  useEffect(() => {
    if (!started || reducedMotion || !lineOneDone || lineTwoDone) return;
    const timer = window.setTimeout(() => setLineTwoCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [started, lineOneDone, lineTwoDone, speed, reducedMotion]);

  const lineTwoVisible = LINE_TWO_FULL.slice(0, lineTwoCount);
  const prefixVisible = lineTwoVisible.slice(0, LINE_TWO_PREFIX.length);
  const accentVisible = lineTwoVisible.slice(LINE_TWO_PREFIX.length);
  const typingLineTwo = lineOneDone && !lineTwoDone && started && !reducedMotion;

  return (
    <div
      ref={ref}
      className={`font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.04] tracking-tight text-[#2B2B2B] max-w-2xl ${className}`}
    >
      <p className="mb-0">
        {LINE_ONE.slice(0, lineOneCount)}
        {!lineOneDone && started && !reducedMotion && <Cursor />}
      </p>
      <p className="mt-0">
        {prefixVisible}
        {accentVisible && (
          <em className="italic font-light text-[#A55A42]">{accentVisible}</em>
        )}
        {typingLineTwo && <Cursor />}
      </p>
    </div>
  );
}
