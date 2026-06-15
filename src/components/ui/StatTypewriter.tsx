/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatTypewriterProps {
  value: string;
  speed?: number;
  className?: string;
}

export default function StatTypewriter({
  value,
  speed = 80,
  className = '',
}: StatTypewriterProps) {
  const triggerRef = useRef<HTMLParagraphElement>(null);
  const [started, setStarted] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => setStarted(true),
    });

    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!started || count >= value.length) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), speed);
    return () => window.clearTimeout(timer);
  }, [started, count, value.length, speed]);

  const done = count >= value.length;

  return (
    <p ref={triggerRef} className={className}>
      {value.slice(0, count)}
      {!done && started && (
        <span
          className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-[#D8C5A4] align-middle"
          aria-hidden
        />
      )}
    </p>
  );
}
