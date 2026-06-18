/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { useInViewOnce } from '../../hooks/useInViewOnce';

interface ScrollTypewriterHeadlineProps {
  lineOne: string;
  lineTwoPrefix: string;
  lineTwoHighlight: string;
  highlightColor?: string;
  highlightClassName?: string;
  speed?: number;
  className?: string;
  lineClassName?: string;
}

export default function ScrollTypewriterHeadline({
  lineOne,
  lineTwoPrefix,
  lineTwoHighlight,
  highlightColor = '#8C82B6',
  highlightClassName,
  speed = 52,
  className = '',
  lineClassName = '',
}: ScrollTypewriterHeadlineProps) {
  const { ref: containerRef, isInView } = useInViewOnce<HTMLDivElement>(0.1);
  const [started, setStarted] = useState(false);
  const [lineOneCount, setLineOneCount] = useState(0);
  const [lineTwoCount, setLineTwoCount] = useState(0);

  const lineTwoFull = lineTwoPrefix + lineTwoHighlight;
  const lineOneDone = lineOne.length === 0 || lineOneCount >= lineOne.length;
  const lineTwoDone = lineTwoCount >= lineTwoFull.length;
  const typingLineTwo = lineOneDone && !lineTwoDone;

  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  useEffect(() => {
    const onReveal = () => setStarted(true);
    window.addEventListener('founder-section-reveal', onReveal);
    return () => window.removeEventListener('founder-section-reveal', onReveal);
  }, []);

  useEffect(() => {
    if (!started || lineOneDone) return;
    const timer = window.setTimeout(() => setLineOneCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [started, lineOneCount, lineOne.length, lineOneDone, speed]);

  useEffect(() => {
    if (!lineOneDone || lineTwoDone || !started) return;
    const timer = window.setTimeout(() => setLineTwoCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [lineOneDone, lineTwoCount, lineTwoFull.length, lineTwoDone, started, speed]);

  const lineTwoVisible = lineTwoFull.slice(0, lineTwoCount);
  const prefixVisible = lineTwoVisible.slice(0, lineTwoPrefix.length);
  const highlightVisible = lineTwoVisible.slice(lineTwoPrefix.length);

  return (
    <div ref={containerRef} className={className}>
      {lineOne.length > 0 && (
        <p className={`${lineClassName} mb-1`}>
          {lineOne.slice(0, lineOneCount)}
          {!lineOneDone && started && <Cursor />}
        </p>
      )}
      <p className={lineClassName}>
        {prefixVisible}
        {highlightVisible && (
          highlightClassName ? (
            <span className={highlightClassName}>{highlightVisible}</span>
          ) : (
            <span style={{ color: highlightColor }}>{highlightVisible}</span>
          )
        )}
        {typingLineTwo && <Cursor />}
      </p>
    </div>
  );
}

function Cursor() {
  return (
    <span
      className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-[#8C82B6] align-middle"
      aria-hidden
    />
  );
}
