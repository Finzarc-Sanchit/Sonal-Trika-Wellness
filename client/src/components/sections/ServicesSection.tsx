/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from 'motion/react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import LiquidGallery from '../ui/LiquidGallery';
import ServiceTypewriterHeadline from '../ui/ServiceTypewriterHeadline';
import { SERVICE_GROUPS, type ServiceCard } from '../../data/servicesData';
import {
  handleServicePrimaryCta,
  handleServiceSecondaryCta,
  openConnectPanel,
} from '../../utils/serviceCta';
import { shouldDisableHeavyMotion } from '../../utils/performance';

const LEARN_MORE_CTAS = ['Learn More', 'View Curriculum', 'Module Details'];

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  onPrimaryCta?: (item: ServiceCard) => void;
  onSecondaryCta?: (item: ServiceCard) => void;
  onLearnMore?: (item: ServiceCard) => void;
}

const GROUP_HEADLINES: Record<string, { text: string; accentWord?: string }> = {
  individual: { text: 'One-to-one restoration', accentWord: 'restoration' },
  group: { text: 'Collective healing experiences', accentWord: 'healing' },
  teaching: { text: 'Learn the craft of sacred sound', accentWord: 'sacred' },
};

export default function ServicesSection({
  onPrimaryCta = handleServicePrimaryCta,
  onSecondaryCta,
  onLearnMore,
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || shouldDisableHeavyMotion()) return;

    const ctx = gsap.context(() => {
      if (parallaxBgRef.current) {
        gsap.to(parallaxBgRef.current, {
          y: 100,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      groupRefs.current.forEach((groupEl, i) => {
        if (!groupEl) return;

        const header = groupEl.querySelector('.services-group-header');
        const gallery = groupEl.querySelector('.liquid-gallery-container');

        if (header) {
          gsap.fromTo(
            header,
            { y: 60, opacity: 0.6 },
            {
              y: -20 * (i + 1),
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: groupEl,
                start: 'top 90%',
                end: 'bottom 30%',
                scrub: 0.8,
              },
            },
          );
        }

        if (gallery) {
          gsap.fromTo(
            gallery,
            { y: 80 + i * 20 },
            {
              y: -40 - i * 15,
              ease: 'none',
              scrollTrigger: {
                trigger: groupEl,
                start: 'top 95%',
                end: 'bottom 10%',
                scrub: 1.4,
              },
            },
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="services-offerings"
      ref={sectionRef}
      className="relative py-20 md:py-[120px] bg-white overflow-hidden"
    >
      <div
        ref={parallaxBgRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full bg-[#8C82B6]/8 blur-[100px]" />
        <div className="absolute top-[40%] -left-32 w-[360px] h-[360px] rounded-full bg-[#A55A42]/6 blur-[90px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[280px] h-[280px] rounded-full bg-[#F2B5A0]/10 blur-[80px]" />
      </div>

      {SERVICE_GROUPS.map((group, groupIdx) => {
        const headline = GROUP_HEADLINES[group.id];

        return (
          <div
            key={group.id}
            id={group.id}
            ref={(el) => {
              groupRefs.current[groupIdx] = el;
            }}
            className={groupIdx > 0 ? 'relative z-10 mt-16 md:mt-[120px] scroll-mt-24' : 'relative z-10 scroll-mt-24'}
          >
            <Container className="mb-8 md:mb-12">
              <div className="services-group-header flex min-w-0 flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="min-w-0">
                  <SectionLabel dotColor={group.accentColor}>{group.label}</SectionLabel>
                  {headline && (
                    <ServiceTypewriterHeadline
                      text={headline.text}
                      accentWord={headline.accentWord}
                    />
                  )}
                </div>
                {group.subtext && (
                  <p className="font-sans text-body-sm text-[#888888] max-w-sm leading-relaxed italic md:mb-1 min-w-0 text-balance">
                    {group.subtext}
                  </p>
                )}
              </div>
            </Container>

            <LiquidGallery
              items={group.items}
              compact={group.compact}
              onPrimaryCta={onPrimaryCta}
              onSecondaryCta={(item) => {
                if (item.secondaryHref) {
                  onSecondaryCta?.(item);
                  return;
                }
                if (
                  item.learnMore &&
                  item.secondaryCta &&
                  LEARN_MORE_CTAS.includes(item.secondaryCta) &&
                  onLearnMore
                ) {
                  onLearnMore(item);
                  return;
                }
                if (onSecondaryCta) {
                  onSecondaryCta(item);
                  return;
                }
                handleServiceSecondaryCta(item, onLearnMore);
              }}
            />
          </div>
        );
      })}

      <Container className="relative z-10 mt-16 md:mt-[120px]">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() =>
              openConnectPanel({ service: 'General Inquiry', action: 'Begin Your Healing Journey' })
            }
            className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2B2B2B] border-b-2 border-[#2B2B2B] pb-2 hover:text-[#8C82B6] hover:border-[#8C82B6] transition-all duration-500 cursor-pointer"
          >
            Begin Your Healing Journey
          </button>
        </div>
      </Container>
    </section>
  );
}
