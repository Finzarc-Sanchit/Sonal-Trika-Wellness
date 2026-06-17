/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollTypewriterHeadlineProps {
  lineOne: string;
  lineTwoPrefix: string;
  lineTwoHighlight: string;
  highlightColor?: string;
  highlightClassName?: string;
  speed?: number;
  className?: string;
  lineClassName?: string;
  triggerRef?: RefObject<HTMLElement | null>;
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
  triggerRef: externalTriggerRef,
}: ScrollTypewriterHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [lineOneCount, setLineOneCount] = useState(0);
  const [lineTwoCount, setLineTwoCount] = useState(0);

  const lineTwoFull = lineTwoPrefix + lineTwoHighlight;
  const lineOneDone = lineOne.length === 0 || lineOneCount >= lineOne.length;
  const lineTwoDone = lineTwoCount >= lineTwoFull.length;
  const typingLineTwo = lineOneDone && !lineTwoDone;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const trigger = externalTriggerRef?.current ?? el;
    const st = ScrollTrigger.create({
      trigger,
      start: 'top 78%',
      once: true,
      onEnter: () => setStarted(true),
    });

    const onReveal = () => setStarted(true);
    window.addEventListener('founder-section-reveal', onReveal);

    return () => {
      st.kill();
      window.removeEventListener('founder-section-reveal', onReveal);
    };
  }, [externalTriggerRef]);

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
