/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import Badge from './Badge';
import FloatingSearch from './FloatingSearch';

interface HeroContentProps {
  badgeText: string;
  badgeIcon: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  searchPlaceholder: string;
  searchHint: string;
  onSearchSubmit: (query: string) => void;
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick: () => void;
  scrollYOffset: number; // For scroll parallax content movement
  parallaxStrength: number;
}

export default function HeroContent({
  badgeText,
  badgeIcon,
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaUrl,
  secondaryCtaText,
  secondaryCtaUrl,
  searchPlaceholder,
  searchHint,
  onSearchSubmit,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
  scrollYOffset,
  parallaxStrength,
}: HeroContentProps) {
  
  // Calculate depth effects based on scroll translation
  const translateContentY = scrollYOffset * parallaxStrength * 0.45;
  const contentOpacity = Math.max(0, 1 - scrollYOffset * 0.0022);
  const scaleContent = Math.max(0.92, 1 - scrollYOffset * 0.0006);

  // Splitting headline into words for premium staggered entrance animation
  const headingWords = headline ? headline.split(' ') : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 35, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div
      id="hero-content-viewport"
      className="relative z-20 flex flex-col items-center justify-center text-center px-4 md:px-8 max-w-5xl mx-auto w-full select-none"
      style={{
        transform: `translate3d(0, ${translateContentY}px, 0) scale(${scaleContent})`,
        opacity: contentOpacity,
        willChange: 'transform, opacity',
      }}
    >
      <motion.div
        id="animated-hero-stack"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-6 md:gap-10 w-full"
      >
        
        {/* PREMIUM BADGE AREA */}
        {badgeText && (
          <motion.div variants={itemFadeUp} className="will-change-transform-opacity">
            <Badge 
              iconName={badgeIcon} 
              text={badgeText} 
              onClick={() => {
                alert(`Interactive custom frame callback: Clicked "${badgeText}"`);
              }}
            />
          </motion.div>
        )}

        {/* HEADLINE SECTION (Staggered Characters/Words with Blur reduction) */}
        <div id="staggered-headline" className="overflow-hidden py-1">
          <motion.h1 
            variants={itemFadeUp}
            className="font-display font-medium tracking-tight text-white leading-[1.1] text-4xl sm:text-5xl md:text-6xl xl:text-7xl break-words"
          >
            {headingWords.map((word, wordIdx) => (
              <motion.span
                id={`headline-word-${wordIdx}`}
                key={wordIdx}
                className="inline-block mr-[0.25em] last:mr-0 cursor-default hover:text-zinc-300 transition-colors duration-300 hover:scale-[1.02]"
                variants={wordVariants}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* SUBHEADLINE (Animate after with delay, maintain readability) */}
        {subheadline && (
          <motion.p
            id="hero-subheadline"
            variants={itemFadeUp}
            className="font-sans font-normal text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed will-change-transform-opacity"
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTA BUTTONS (Hover lift, scale, subtle glow effects) */}
        <motion.div
          id="cta-buttons-container"
          variants={itemFadeUp}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center w-full max-w-md sm:max-w-none px-4 will-change-transform-opacity"
        >
          {primaryCtaText && (
            <button
              id="hero-primary-cta"
              onClick={onPrimaryCtaClick}
              className="group relative w-full sm:w-auto px-8 py-4 rounded-full text-sm font-sans font-medium text-black bg-white hover:bg-zinc-100 shadow-[0_10px_35px_-5px_rgba(255,255,255,0.22)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.35)] hover:-translate-y-1 hover:scale-[1.03] active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-100 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <span>{primaryCtaText}</span>
              <Compass className="w-4 h-4 text-neutral-950 group-hover:rotate-95 transition-transform duration-500" />
            </button>
          )}

          {secondaryCtaText && (
            <button
              id="hero-secondary-cta"
              onClick={onSecondaryCtaClick}
              className="group w-full sm:w-auto px-8 py-4 rounded-full text-sm font-sans font-medium text-white glass-effect hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:scale-[1.03] active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{secondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          )}
        </motion.div>

        {/* MODULAR FLOATING SEARCH INTERFACE */}
        <FloatingSearch
          placeholder={searchPlaceholder}
          hintText={searchHint}
          onSearchSubmit={onSearchSubmit}
          aiBrandText="✦ Frame Playground Enabled"
        />

      </motion.div>
    </div>
  );
}
