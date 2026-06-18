/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useCallback, Fragment } from 'react';
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

interface MobileServiceCardProps {
  item: ServiceCard;
  onPrimaryCta: (item: ServiceCard) => void;
  onSecondaryCta: (item: ServiceCard) => void;
}

function MobileServiceCard({ item, onPrimaryCta, onSecondaryCta }: MobileServiceCardProps) {
  return (
    <div id={item.id} className="flex flex-col gap-4 scroll-mt-24">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-lg">
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent p-6">
          <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a1999b]">
            {item.duration} · {item.category}
          </p>
          <h2 className="mb-3 font-display text-2xl text-white">{item.title}</h2>
          <p className="font-sans text-sm leading-relaxed text-[#F8F5F0]/80">{item.description}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => onPrimaryCta(item)}
          aria-label={`${item.primaryCta} — ${item.title}`}
          className="min-h-[44px] cursor-pointer bg-[#8C82B6] px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:bg-[#7a72a6]"
        >
          {item.primaryCta}
        </button>
        {item.secondaryCta && (
          <button
            type="button"
            onClick={() => onSecondaryCta(item)}
            aria-label={`${item.secondaryCta} — ${item.title}`}
            className="min-h-[44px] cursor-pointer bg-[#2B2B2B] px-6 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#F8F5F0] shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:bg-[#3d3d3d]"
          >
            {item.secondaryCta}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ServicesSection({
  onPrimaryCta = handleServicePrimaryCta,
  onSecondaryCta,
  onLearnMore,
}: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const resolveSecondaryCta = useCallback(
    (item: ServiceCard) => {
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
    },
    [onSecondaryCta, onLearnMore],
  );

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
              <div className="services-group-header grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:grid-cols-[minmax(0,1fr)_320px] gap-4 md:gap-8 lg:gap-10 md:items-start">
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
                  <p className="font-sans text-body-sm text-[#888888] max-w-none md:max-w-[320px] leading-relaxed md:pt-7 min-w-0 line-clamp-3">
                    {group.subtext}
                  </p>
                )}
              </div>
            </Container>

            <div className="hidden md:block">
              <LiquidGallery
                items={group.items}
                compact={group.compact}
                onPrimaryCta={onPrimaryCta}
                onSecondaryCta={resolveSecondaryCta}
              />
            </div>

            <div className="mt-6 block w-full px-4 md:hidden">
              <div className="flex flex-col gap-4">
                {group.items.map((item) => (
                  <Fragment key={item.id}>
                    <MobileServiceCard
                      item={item}
                      onPrimaryCta={onPrimaryCta}
                      onSecondaryCta={resolveSecondaryCta}
                    />
                  </Fragment>
                ))}
              </div>
            </div>
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
