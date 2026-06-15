/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Reference-style editorial quote: large mark, vertical rule, highlighted phrase.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface EditorialQuoteProps {
  children: ReactNode;
  accentColor?: string;
  markColor?: string;
  className?: string;
}

export default function EditorialQuote({
  children,
  accentColor = '#A55A42',
  markColor = 'rgba(140, 130, 182, 0.18)',
  className = '',
}: EditorialQuoteProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => setVisible(true),
    });

    const onReveal = () => setVisible(true);
    window.addEventListener('founder-section-reveal', onReveal);

    return () => {
      st.kill();
      window.removeEventListener('founder-section-reveal', onReveal);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`relative pl-8 md:pl-10 transition-all duration-1000 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      <span
        className="absolute left-0 top-0 font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none select-none pointer-events-none"
        style={{ color: markColor }}
        aria-hidden
      >
        &ldquo;
      </span>

      <div
        className="absolute left-[18px] md:left-[22px] top-2 bottom-0 w-[2px]"
        style={{ backgroundColor: accentColor }}
        aria-hidden
      />

      <p className="font-sans text-[clamp(0.95rem,1.35vw,1.125rem)] leading-[1.72] tracking-[0.02em] text-[#2B2B2B]">
        {children}
      </p>
    </div>
  );
}
