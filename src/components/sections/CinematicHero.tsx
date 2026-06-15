/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import SeamlessVideo from '../ui/SeamlessVideo';
import GradientButton from '../ui/GradientButton';
import TextType from '../ui/TextType';

const HERO_HEADLINE = 'True healing begins when the mind settles into sound';
const HERO_SUBTEXT =
  'The truest healing begins when the external noise fades, and the body feels safe enough to resonate with peace.';

const heroTextStyle = {
  color: '#FFFFFF',
  fontWeight: 600,
  textShadow: '0 2px 24px rgba(0, 0, 0, 0.45)',
};

interface CinematicHeroProps {
  videoSrc: string;
  scrollY: number;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CinematicHero({
  videoSrc,
  scrollY,
  onPrimaryCtaClick,
  onSecondaryCtaClick,
}: CinematicHeroProps) {
  const contentOpacity = Math.max(0, 1 - scrollY * 0.002);
  const contentY = scrollY * 0.35;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2, delayChildren: 0.15 },
    },
  };

  const fadeUpBlur = {
    hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1, ease },
    },
  };

  return (
    <section
      id="hero-root-stage"
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
    >
      <SeamlessVideo src={videoSrc} parallaxY={scrollY * 0.15} />

      <div className="absolute inset-0 z-[1] bg-black/35 pointer-events-none" aria-hidden />

      <motion.div
        className="relative z-10 flex h-full items-end md:items-center px-6 md:px-12 xl:px-20 pt-24 pb-20 md:pb-16"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(0, ${contentY}px, 0)`,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl">
          <motion.p
            variants={fadeUpBlur}
            className="font-sans text-xs md:text-sm uppercase tracking-[0.35em] mb-6 md:mb-8"
            style={heroTextStyle}
          >
            Trika Wellness
          </motion.p>

          <motion.div variants={fadeUpBlur} className="mb-8 md:mb-10">
            <TextType
              as="h1"
              text={[HERO_HEADLINE]}
              loop={false}
              showCursor
              cursorCharacter="|"
              typingSpeed={55}
              initialDelay={600}
              startOnVisible
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.08] tracking-tight"
              style={heroTextStyle}
              cursorClassName="font-light text-white/80"
            />
          </motion.div>

          <motion.p
            variants={fadeUpBlur}
            className="font-display text-base md:text-xl max-w-xl leading-relaxed mb-8 md:mb-10"
            style={heroTextStyle}
          >
            {HERO_SUBTEXT}
          </motion.p>

          <motion.div
            variants={fadeUpBlur}
            className="flex flex-col sm:flex-row gap-4"
          >
            <GradientButton
              variant="primary"
              onClick={onPrimaryCtaClick}
              icon={
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              }
            >
              Begin Your Healing Journey
            </GradientButton>
            <GradientButton variant="secondary" onClick={onSecondaryCtaClick}>
              Our Services
            </GradientButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
        style={{ opacity: Math.max(0, 1 - scrollY * 0.005) }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span
          className="font-sans text-[10px] uppercase tracking-[0.3em]"
          style={heroTextStyle}
        >
          Scroll
        </span>
        <div
          className="w-px h-8"
          style={{
            background: 'linear-gradient(to bottom, #FFFFFF, transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}
