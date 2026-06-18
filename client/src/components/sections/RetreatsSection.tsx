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
import { ArrowRight } from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import SectionReveal from '../ui/SectionReveal';
import RetreatAmbientBackground from '../ui/RetreatAmbientBackground';
import RetreatDestinationCard from '../ui/RetreatDestinationCard';
import RetreatTypewriterHeadline from '../ui/RetreatTypewriterHeadline';
import { RETREAT_LOCATIONS } from '../../data/retreatLocations';
import { openConnectPanel } from '../../utils/serviceCta';

const MARQUEE_DURATION = 55;

function DesktopMarqueeTrack() {
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const duplicated = [...RETREAT_LOCATIONS, ...RETREAT_LOCATIONS];

  useEffect(() => {
    if (reducedMotion) return;
    if (paused) {
      controls.stop();
      return;
    }
    controls.start({
      x: ['0%', '-50%'],
      transition: {
        duration: MARQUEE_DURATION,
        ease: 'linear',
        repeat: Number.POSITIVE_INFINITY,
      },
    });
  }, [controls, paused, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="hidden md:flex justify-center gap-6 px-6 overflow-x-auto scrollbar-hide pb-6">
        {RETREAT_LOCATIONS.map((loc, i) => (
          <RetreatDestinationCard key={loc.slug} location={loc} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="hidden md:block relative retreat-marquee-mask w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex items-stretch gap-6 w-max py-2"
        animate={controls}
        initial={{ x: '0%' }}
      >
        {duplicated.map((loc, i) => (
          <RetreatDestinationCard
            key={`${loc.slug}-${i}`}
            location={loc}
            index={i % RETREAT_LOCATIONS.length}
          />
        ))}
      </motion.div>
    </div>
  );
}

function MobileScrollTrack() {
  return (
    <div className="md:hidden relative w-full px-4 sm:px-6">
      {/* Dynamic, auto-scaling vertical grid context designed cleanly for compact views */}
      <div className="flex flex-col items-center gap-6 w-full">
        {RETREAT_LOCATIONS.map((loc, i) => (
          <div
            key={loc.slug}
            className="w-full max-w-sm sm:max-w-md [&>.retreat-card]:w-full"
          >
            <RetreatDestinationCard
              location={loc}
              index={i}
              animateIn
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RetreatsSection() {
  return (
    <section id="retreats" className="relative overflow-hidden py-16 md:py-[120px]">
      <RetreatAmbientBackground />

      <div className="relative z-10 flex flex-col">
        <Container className="w-full">
          <SectionReveal>
            <div className="mb-10 md:mb-16 text-left max-w-xl">
              <SectionLabel dotColor="#7A8B6F">Retreats</SectionLabel>
              <RetreatTypewriterHeadline
                text="Immersive healing destinations"
                className="text-left mx-0 max-w-none"
              />
              <p className="mt-4 md:mt-5 font-sans text-body-sm text-[#888888] leading-relaxed">
                Multi-day immersions in nature — gong ceremonies, sound baths, and deep nervous system
                restoration in carefully chosen destinations.
              </p>
            </div>
          </SectionReveal>
        </Container>

        <div className="relative w-full mt-2">
          <DesktopMarqueeTrack />
          <MobileScrollTrack />
        </div>

        <Container className="w-full">
          <SectionReveal delay={0.15}>
            <div className="mt-10 md:mt-12 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  openConnectPanel({
                    service: 'Retreat',
                    action: 'Reserve Your Spot',
                    showRetreatPicker: true,
                  })
                }
                className="inline-flex items-center justify-center gap-2 bg-[#A55A42] text-white font-sans text-body-sm font-medium tracking-tight rounded-[24px] px-[38px] py-3 shadow-[0_4px_8px_rgba(0,0,0,0.1)] hover:bg-[#8e4a35] transition-colors duration-500 cursor-pointer"
              >
                Reserve Your Spot
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </SectionReveal>
        </Container>
      </div>
    </section>
  );
}