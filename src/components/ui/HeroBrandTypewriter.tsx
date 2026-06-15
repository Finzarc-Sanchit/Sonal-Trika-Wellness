/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

const BRAND = 'Trika Wellness';

export default function HeroBrandTypewriter() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const done = count >= BRAND.length;

  useEffect(() => {
    if (!inView || done) return;
    const timer = window.setTimeout(() => setCount((c) => c + 1), 55);
    return () => window.clearTimeout(timer);
  }, [inView, count, done]);

  const typed = BRAND.slice(0, count);
  const wellnessStart = typed.length > 6 ? typed.slice(6) : '';

  return (
    <span ref={ref} className="inline-block">
      <span className="text-white">{typed.length <= 5 ? typed : 'Trika'}</span>
      {typed.length > 5 && <span className="text-white">&nbsp;</span>}
      {wellnessStart && (
        <span className="italic font-light text-[#D8C5A4]">{wellnessStart}</span>
      )}
      {!done && inView && (
        <motion.span
          className="inline-block w-[2px] h-[0.85em] ml-0.5 align-middle bg-[#F2B5A0]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          aria-hidden
        />
      )}
    </span>
  );
}
