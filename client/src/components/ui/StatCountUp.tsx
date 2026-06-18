/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useInViewOnce } from '../../hooks/useInViewOnce';

export type StatCountUpFormat = 'number' | 'plus' | 'range';

interface StatCountUpProps {
  from: number;
  to: number;
  format?: StatCountUpFormat;
  prefix?: string;
  duration?: number;
  className?: string;
}

function formatValue(n: number, format: StatCountUpFormat, prefix: string) {
  if (format === 'plus') return `${Math.round(n)}+`;
  if (format === 'range') return `${prefix}${Math.round(n)}`;
  return String(Math.round(n));
}

export default function StatCountUp({
  from,
  to,
  format = 'number',
  prefix = '',
  duration = 1.8,
  className = '',
}: StatCountUpProps) {
  const { ref, isInView } = useInViewOnce<HTMLParagraphElement>(0.1);
  const valueRef = useRef({ val: from });
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    valueRef.current.val = from;
    el.textContent = formatValue(from, format, prefix);
  }, [from, format, prefix, ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isInView || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      el.textContent = formatValue(to, format, prefix);
      return;
    }

    valueRef.current.val = from;
    el.textContent = formatValue(from, format, prefix);

    const tween = gsap.to(valueRef.current, {
      val: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = formatValue(valueRef.current.val, format, prefix);
      },
    });

    return () => {
      tween.kill();
    };
  }, [from, to, format, prefix, duration, isInView, ref]);

  return <p ref={ref} className={className} />;
}
