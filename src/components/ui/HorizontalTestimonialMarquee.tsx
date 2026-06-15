/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { Testimonial } from '../../data/testimonials';
import {
  onBackgroundMediaPause,
  onBackgroundMediaResume,
} from '../../utils/backgroundMedia';

export const TESTIMONIAL_CARD_WIDTH = 360;
export const TESTIMONIAL_CARD_GAP = 24;
/** Visible width: 2 full cards + half of third */
export const TESTIMONIAL_VIEWPORT_WIDTH =
  TESTIMONIAL_CARD_WIDTH * 2.5 + TESTIMONIAL_CARD_GAP * 2;

const RESUME_AUTO_MS = 2000;

interface HorizontalTestimonialMarqueeProps {
  testimonials: Testimonial[];
  duration?: number;
  /** Stops auto-scroll RAF (e.g. when a video modal is open). */
  paused?: boolean;
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article
      className="shrink-0 rounded-2xl border border-[#D8C5A4]/40 bg-white/90 p-6 shadow-[0_8px_32px_rgba(140,130,182,0.08)] backdrop-blur-sm md:p-8"
      style={{ width: TESTIMONIAL_CARD_WIDTH }}
    >
      <div className="mb-5 flex items-center gap-4">
        <img
          src={item.src}
          alt={item.name}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-[#8C82B6]/20"
          loading="lazy"
        />
        <div>
          <h3 className="font-display text-xl tracking-tight text-[#2B2B2B]">
            {item.name}
          </h3>
          <p className="font-sans text-caption text-[#888888]">{item.designation}</p>
        </div>
      </div>
      <p className="font-sans text-body-sm italic leading-relaxed text-[#2B2B2B]/85">
        &ldquo;{item.quote}&rdquo;
      </p>
    </article>
  );
}

export default function HorizontalTestimonialMarquee({
  testimonials,
  duration = 80,
  paused = false,
}: HorizontalTestimonialMarqueeProps) {
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [manual, setManual] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [busPaused, setBusPaused] = useState(false);
  const loop = [...testimonials, ...testimonials];

  useEffect(() => {
    const offPause = onBackgroundMediaPause(() => setBusPaused(true));
    const offResume = onBackgroundMediaResume(() => setBusPaused(false));
    return () => {
      offPause();
      offResume();
    };
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = window.setTimeout(() => {
      setManual(false);
    }, RESUME_AUTO_MS);
  }, [clearResumeTimer]);

  const pauseForManual = useCallback(() => {
    setManual(true);
    clearResumeTimer();
  }, [clearResumeTimer]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [clearResumeTimer]);

  const autoActive = !manual && !hoverPaused && !paused && !busPaused;

  useEffect(() => {
    if (reducedMotion || !autoActive) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const el = scrollRef.current;
    if (!el) return;

    lastTickRef.current = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      const halfWidth = el.scrollWidth / 2;
      if (halfWidth <= 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const pxPerMs = halfWidth / (duration * 1000);
      el.scrollLeft += pxPerMs * delta;

      if (el.scrollLeft >= halfWidth) {
        el.scrollLeft -= halfWidth;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [autoActive, reducedMotion, duration, testimonials.length]);

  if (reducedMotion) {
    return (
      <div
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide touch-pan-x"
        style={{ maxWidth: TESTIMONIAL_VIEWPORT_WIDTH }}
      >
        {testimonials.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="testimonial-horizontal-mask relative"
      style={{
        width: '100%',
        maxWidth: TESTIMONIAL_VIEWPORT_WIDTH,
        minHeight: 280,
      }}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => {
        setHoverPaused(false);
        if (manual) scheduleResume();
      }}
    >
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide touch-pan-x py-2"
        style={{ scrollSnapType: manual ? 'x proximity' : 'none' }}
        onPointerDown={pauseForManual}
        onTouchStart={pauseForManual}
        onPointerUp={scheduleResume}
        onTouchEnd={scheduleResume}
      >
        <div
          className="flex w-max items-stretch"
          style={{ gap: TESTIMONIAL_CARD_GAP }}
        >
          {loop.map((item, i) => (
            <TestimonialCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
