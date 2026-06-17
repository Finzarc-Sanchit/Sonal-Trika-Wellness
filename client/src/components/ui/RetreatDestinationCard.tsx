/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import type { RetreatLocation } from '../../data/retreatLocations';
import CardMeshOverlay from './CardMeshOverlay';

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface RetreatDestinationCardProps {
  location: RetreatLocation;
  index: number;
  animateIn?: boolean;
}

function CardContent({ location }: { location: RetreatLocation }) {
  const shellGradient = `linear-gradient(to bottom right, ${location.gradientFrom}, ${location.gradientTo})`;
  const overlayGradient = `linear-gradient(to bottom, color-mix(in srgb, ${location.gradientFrom} 25%, transparent), color-mix(in srgb, ${location.gradientTo} 55%, #2B2B2B))`;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="group shrink-0 w-[300px] md:w-[340px] rounded-[24px] outline-none"
    >
      <div
        className="relative min-h-[480px] md:min-h-[520px] rounded-[24px] overflow-hidden shadow-[0_16px_32px_rgba(0,0,0,0.12)]"
        style={{ background: shellGradient }}
      >
        <img
          src={location.image}
          alt={location.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-[#2B2B2B]/45" />
        <CardMeshOverlay />
        <div
          className="absolute inset-0"
          style={{ background: overlayGradient }}
        />

        <div className="relative z-10 flex h-full min-h-[480px] md:min-h-[520px] flex-col items-center justify-center gap-4 px-7 py-10 text-center">
          <h3 className="font-display text-[32px] md:text-[36px] leading-tight tracking-tight text-white">
            {location.name}
          </h3>

          <p className="font-sans text-caption uppercase tracking-[0.18em] text-[#D8C5A4]/90 max-w-[260px]">
            {location.tagline}
          </p>

          <div className="w-10 h-px bg-white/25 my-1" aria-hidden />

          <p className="font-sans text-body-sm leading-relaxed tracking-tight text-white/90 max-w-[280px]">
            {location.description}
          </p>

          {location.paragraph && (
            <p className="font-sans text-caption leading-relaxed tracking-tight text-white/75 max-w-[280px]">
              {location.paragraph}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function RetreatDestinationCard({
  location,
  index,
  animateIn = false,
}: RetreatDestinationCardProps) {
  if (animateIn) {
    return (
      <motion.div
        className="snap-center shrink-0"
        initial={{ opacity: 0, x: 48 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.08, duration: 0.5, ease: EASE }}
      >
        <CardContent location={location} />
      </motion.div>
    );
  }

  return (
    <div className="shrink-0">
      <CardContent location={location} />
    </div>
  );
}
