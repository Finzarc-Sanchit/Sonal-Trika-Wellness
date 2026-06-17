/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type StatCountUpFormat = 'number' | 'plus' | 'range';

interface StatCountUpProps {
  from: number;
  to: number;
  format?: StatCountUpFormat;
  prefix?: string;
  duration?: number;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null>;
}

export default function StatCountUp({
  from,
  to,
  format = 'number',
  prefix = '',
  duration = 1.8,
  className = '',
  triggerRef,
}: StatCountUpProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const valueRef = useRef({ val: from });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const trigger = triggerRef?.current ?? el;

    const render = (n: number) => {
      if (format === 'plus') {
        el.textContent = `${Math.round(n)}+`;
      } else if (format === 'range') {
        el.textContent = `${prefix}${Math.round(n)}`;
      } else {
        el.textContent = String(Math.round(n));
      }
    };

    if (reduced) {
      render(to);
      return;
    }

    valueRef.current.val = from;
    render(from);

    const ctx = gsap.context(() => {
      gsap.to(valueRef.current, {
        val: to,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger,
          start: 'top 82%',
          once: true,
        },
        onUpdate: () => render(valueRef.current.val),
      });
    }, el);

    return () => ctx.revert();
  }, [from, to, format, prefix, duration, triggerRef]);

  return <p ref={ref} className={className} />;
}
