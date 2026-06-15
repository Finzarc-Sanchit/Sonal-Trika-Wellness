/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'motion/react';
import type { Testimonial } from '../../data/testimonials';

export const TESTIMONIAL_CARD_WIDTH = 360;
export const TESTIMONIAL_CARD_GAP = 24;
/** Visible width: 2 full cards + half of third */
export const TESTIMONIAL_VIEWPORT_WIDTH =
  TESTIMONIAL_CARD_WIDTH * 2.5 + TESTIMONIAL_CARD_GAP * 2;

interface HorizontalTestimonialMarqueeProps {
  testimonials: Testimonial[];
  duration?: number;
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
}: HorizontalTestimonialMarqueeProps) {
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const loop = [...testimonials, ...testimonials];

  useEffect(() => {
    if (reducedMotion) return;
    if (paused) {
      controls.stop();
      return;
    }
    controls.start({
      x: ['-50%', '0%'],
      transition: {
        duration,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
      },
    });
  }, [controls, paused, reducedMotion, duration]);

  if (reducedMotion) {
    return (
      <div
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
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
      className="testimonial-horizontal-mask relative overflow-hidden"
      style={{
        width: '100%',
        maxWidth: TESTIMONIAL_VIEWPORT_WIDTH,
        minHeight: 280,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <motion.div
        className="flex w-max items-stretch py-2"
        style={{ gap: TESTIMONIAL_CARD_GAP }}
        animate={controls}
        initial={{ x: '-50%' }}
      >
        {loop.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
