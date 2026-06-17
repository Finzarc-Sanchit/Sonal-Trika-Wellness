/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useReducedMotion } from 'motion/react';
import HeroBrandTypewriter from '../ui/HeroBrandTypewriter';
import { shouldDisableHeavyMotion } from '../../utils/performance';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = '/images/services/services-hero.png';

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || shouldDisableHeavyMotion()) return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: 140,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: -60,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[88vh] md:min-h-[92vh] flex items-end overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <img
          src={HERO_IMAGE}
          alt="Sound healing session with singing bowls and gong"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/55 to-[#1A1A1A]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/40 via-transparent to-[#1A1A1A]/30" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-3xl text-left pl-6 md:pl-10 lg:pl-16 xl:pl-20 pb-16 md:pb-24 pt-36 md:pt-44"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-[#D8C5A4] mb-5 md:mb-6 hero-text-contrast"
        >
          Sound Wellness Therapies
        </motion.p>

        <h1 className="font-display text-[clamp(2.75rem,7vw,5rem)] leading-[1.08] tracking-[-0.02em] text-white mb-5 md:mb-7 max-w-4xl hero-headline-contrast">
          <HeroBrandTypewriter />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="font-sans text-body-sm md:text-subheading text-[#F8F5F0]/90 max-w-xl leading-[1.65] md:leading-relaxed hero-text-contrast break-words"
        >
          Curated pathways to restoration — private protocols, collective experiences, and
          teaching designed for depth, not distraction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mt-8 md:mt-10 flex flex-col items-start sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-x-6 sm:gap-y-3"
        >
          <a
            href="#services-offerings"
            className="inline-flex w-full sm:w-auto items-center justify-start px-8 py-3 bg-[#F8F5F0] text-[#2B2B2B] font-sans text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-white transition-colors duration-300"
          >
            Explore Offerings
          </a>
          <button
            type="button"
            onClick={() =>
              document.getElementById('individual')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center justify-start self-start px-8 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#F8F5F0] border-b border-[#F8F5F0] pb-1 hover:text-white hover:border-white transition-all cursor-pointer hero-text-contrast"
          >
            View Individual Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
