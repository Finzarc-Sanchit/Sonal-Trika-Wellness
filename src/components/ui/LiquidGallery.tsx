/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import type { ServiceCard } from '../../data/servicesData';
import {
  handleServicePrimaryCta,
  handleServiceSecondaryCta,
} from '../../utils/serviceCta';

interface LiquidGalleryProps {
  items: ServiceCard[];
  compact?: boolean;
  onPrimaryCta?: (item: ServiceCard) => void;
  onSecondaryCta?: (item: ServiceCard) => void;
}

function LiquidGalleryItem({
  item,
  onPrimaryCta,
  onSecondaryCta,
}: {
  item: ServiceCard;
  onPrimaryCta?: (item: ServiceCard) => void;
  onSecondaryCta?: (item: ServiceCard) => void;
}) {
  const itemRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const panTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotion = useReducedMotion();

  const handlePrimaryClick = () => {
    if (onPrimaryCta) {
      onPrimaryCta(item);
      return;
    }
    handleServicePrimaryCta(item);
  };

  const handleSecondaryClick = () => {
    if (onSecondaryCta) {
      onSecondaryCta(item);
      return;
    }
    handleServiceSecondaryCta(item);
  };

  const handleMouseEnter = useCallback(() => {
    itemRef.current?.classList.remove('is-nav-target');

    if (reducedMotion || !imgRef.current) return;

    panTimelineRef.current?.kill();

    const moveX = (Math.random() - 0.5) * 10;
    const moveY = (Math.random() - 0.5) * 10;

    panTimelineRef.current = gsap.timeline({ repeat: -1, yoyo: true });
    panTimelineRef.current.to(imgRef.current, {
      scale: 1.25,
      xPercent: moveX,
      yPercent: moveY,
      duration: 12,
      ease: 'sine.inOut',
    });
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion || !imgRef.current) return;

    panTimelineRef.current?.kill();
    panTimelineRef.current = null;

    gsap.to(imgRef.current, {
      scale: 1.1,
      xPercent: 0,
      yPercent: 0,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, [reducedMotion]);

  return (
    <article
      ref={itemRef}
      id={item.id}
      className="liquid-gallery-item group scroll-mt-24"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label={item.title}
    >
      <div className="liquid-gallery-image-wrapper">
        <img
          ref={imgRef}
          src={item.imageSrc}
          alt={item.imageAlt}
          className="liquid-gallery-image"
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3 className="liquid-gallery-vertical-title font-display text-[clamp(1.25rem,2vw,2.5rem)] leading-none">
        {item.verticalTitle}
      </h3>

      <div className="liquid-gallery-mask bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent">
        <p className="liquid-gallery-meta mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#878384]">
          {item.duration} · {item.category}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,3vw,3rem)] leading-[1.05] text-[#F8F5F0] mb-6">
          {item.title}
        </h2>
        <p className="liquid-gallery-mobile-desc font-sans text-[#F8F5F0]/70 max-w-md leading-relaxed md:hidden">
          {item.description}
        </p>
        <p className="font-sans text-body-sm text-[#F8F5F0]/70 max-w-md mb-8 leading-relaxed hidden md:block">
          {item.description}
        </p>
      </div>

      <div className="liquid-gallery-cta-bar">
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="min-h-[44px] px-6 py-2.5 bg-[#F8F5F0] text-[#2B2B2B] font-sans text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300 cursor-pointer"
        >
          {item.primaryCta}
        </button>
        {item.secondaryCta && (
          <button
            type="button"
            onClick={handleSecondaryClick}
            className="min-h-[44px] font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#F8F5F0] border-b border-[#F8F5F0] pb-1 hover:text-white hover:border-white transition-all cursor-pointer"
          >
            {item.secondaryCta}
          </button>
        )}
      </div>
    </article>
  );
}

export default function LiquidGallery({
  items,
  compact = false,
  onPrimaryCta,
  onSecondaryCta,
}: LiquidGalleryProps) {
  return (
    <div
      className={`liquid-gallery-container liquid-stretch ${
        compact ? 'liquid-gallery-compact' : ''
      }`}
    >
      {items.map((item) => (
        <LiquidGalleryItem
          key={item.id}
          item={item}
          onPrimaryCta={onPrimaryCta}
          onSecondaryCta={onSecondaryCta}
        />
      ))}
    </div>
  );
}
