/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ImageZoomRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ImageZoomReveal({
  children,
  className = '',
  delay = 0,
}: ImageZoomRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { scale: 1.18, y: 24, opacity: 0.6 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 1.2,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: wrap,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        },
      );
    }, wrap);

    const scheduleRefresh = () => {
      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
    };

    wrap.querySelectorAll('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', scheduleRefresh, { once: true });
      img.addEventListener('error', scheduleRefresh, { once: true });
    });

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}
