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

interface VerticalTestimonialMarqueeProps {
  testimonials: Testimonial[];
  duration?: number;
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="mx-auto w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-sm border border-[#D8C5A4]/40 shadow-[0_8px_32px_rgba(140,130,182,0.08)] p-6 md:p-8">
      <div className="flex items-center gap-4 mb-5">
        <img
          src={item.src}
          alt={item.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-[#8C82B6]/20"
          loading="lazy"
        />
        <div>
          <h3 className="font-display text-xl tracking-tight text-[#2B2B2B]">
            {item.name}
          </h3>
          <p className="font-sans text-caption text-[#888888]">{item.designation}</p>
        </div>
      </div>
      <p className="font-sans text-body-sm text-[#2B2B2B]/85 leading-relaxed italic">
        &ldquo;{item.quote}&rdquo;
      </p>
    </article>
  );
}

export default function VerticalTestimonialMarquee({
  testimonials,
  duration = 52,
}: VerticalTestimonialMarqueeProps) {
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
      y: ['0%', '-50%'],
      transition: {
        duration,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
      },
    });
  }, [controls, paused, reducedMotion, duration]);

  if (reducedMotion) {
    return (
      <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
        {testimonials.slice(0, 4).map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto w-full max-w-md h-[520px] md:h-[580px] overflow-hidden testimonial-vertical-mask"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <motion.div
        className="flex flex-col gap-6 py-2"
        animate={controls}
        initial={{ y: '0%' }}
      >
        {loop.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
