/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useLayoutEffect, useRef, Fragment } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FlowArt, { FlowSection } from '../ui/story-scroll';
import ScrollTypewriterHeadline from '../ui/ScrollTypewriterHeadline';
import StatHighlightCard from '../ui/StatHighlightCard';
import ImageZoomReveal from '../ui/ImageZoomReveal';
import FloatingPillarCard from '../ui/FloatingPillarCard';
import CardMeshOverlay from '../ui/CardMeshOverlay';
import ConfettiBackground from '../ui/confetti-background';

gsap.registerPlugin(ScrollTrigger);

const BRIGHT_BG = '#FDF8F0';
const TEXT = '#2B2B2B';
const MUTED = '#666666';
const CAPTION = '#888888';
const ACCENT = '#8C82B6';
const GOLD = '#D8C5A4';

const IMAGES = {
  heroLeft: '/images/about-trika-hero-left.png',
  heroCenter: '/images/about-trika-hero-center.png',
  heroRight: '/images/about-trika-hero-right.png',
  team: '/images/about-trika-team.png',
} as const;

const LEFT_PILLARS = [
  { title: 'Science + Spirituality', body: 'Blend of science and spirituality' },
  { title: 'Clinical Organ Therapy', body: 'Targeted vibration therapy for organs' },
  { title: 'Trauma-Sensitive', body: 'Trauma-sensitive approach' },
] as const;

const RIGHT_PILLARS = [
  { title: 'Curated Journeys', body: 'Curated sound journeys' },
  { title: 'Gong Mastery', body: 'Expert gong mastery' },
  { title: 'Community Healing', body: 'Community + individual healing spaces' },
] as const;

const FOUNDER_PARAGRAPH =
  'Founded in 2023 by Sonia Razdan, Trika bridges eastern vibrational science with modern physiological stress relief — helping corporate leaders, wellness seekers, and retreat participants reconnect with their essential selves.';

const STAT_CARDS = [
  {
    from: 0,
    to: 2023,
    label: 'Founded in Mumbai',
    imageSrc: '/images/sound-healing-studio.png',
  },
  {
    from: 0,
    to: 6,
    format: 'plus' as const,
    label: 'Healing Modalities',
    imageSrc: '/images/about-card-2.png',
  },
  {
    from: 0,
    to: 3,
    label: 'Retreat Destinations',
    imageSrc: '/images/retreats/retreat-rishikesh.png',
  },
  {
    from: 45,
    to: 90,
    prefix: '45–',
    format: 'range' as const,
    label: 'Minute Theta Journeys',
    imageSrc: '/images/sound-healing.png',
  },
];

export default function AboutTrikaWellnessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const flowSectionTwoRef = useRef<HTMLDivElement>(null); // Anchor point for oncoming card slide tracking
  const panel3Ref = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<HTMLUListElement>(null);
  const rightCardsRef = useRef<HTMLUListElement>(null);
  const mobileCardsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const edgeOffset = () => Math.min(window.innerWidth * 0.45, 520);
    const mobileOffset = () => Math.min(window.innerWidth * 0.35, 280);

    const applyHiddenState = (container: HTMLElement | null, fromX: number) => {
      if (!container) return;
      const cards = container.querySelectorAll('.trika-pillar-card');
      if (cards.length === 0) return;
      gsap.set(cards, { x: fromX, opacity: 0 });
    };

    applyHiddenState(leftCardsRef.current, -edgeOffset());
    applyHiddenState(rightCardsRef.current, edgeOffset());

    const mobileCards = mobileCardsRef.current;
    if (mobileCards) {
      const offset = mobileOffset();
      mobileCards.querySelectorAll('.trika-pillar-card').forEach((card, i) => {
        const fromX = i < LEFT_PILLARS.length ? -offset : offset;
        gsap.set(card, { x: fromX, opacity: 0 });
      });
    }

    if (reduced) {
      gsap.set(cluster.querySelectorAll('.trika-pillar-card'), { x: 0, opacity: 1 });
      return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasAnimated) return;

        hasAnimated = true;
        observer.disconnect();

        gsap.to(cluster.querySelectorAll('.trika-pillar-card'), {
          x: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        });
      },
      { root: null, threshold: 0.15 },
    );

    observer.observe(cluster);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(cluster.querySelectorAll('.trika-pillar-card'));
    };
  }, []);

  useLayoutEffect(() => {
    const refreshCall = gsap.delayedCall(0.1, () => ScrollTrigger.refresh()).pause();
    const scheduleRefresh = () => refreshCall.restart(true);

    const observed = new Set<Element>();
    const resizeObserver = new ResizeObserver(scheduleRefresh);

    const observeNode = (node: HTMLElement | null) => {
      if (!node || observed.has(node)) return;
      observed.add(node);
      resizeObserver.observe(node);

      const flowSection = node.closest<HTMLElement>('[data-flow-section]');
      if (flowSection && !observed.has(flowSection)) {
        observed.add(flowSection);
        resizeObserver.observe(flowSection);
      }

      node.querySelectorAll('img').forEach((img) => {
        if (img.complete) return;
        img.addEventListener('load', scheduleRefresh, { once: true });
        img.addEventListener('error', scheduleRefresh, { once: true });
      });
    };

    observeNode(sectionRef.current);
    observeNode(panel1Ref.current);
    observeNode(panel3Ref.current);
    observeNode(flowSectionTwoRef.current);

    scheduleRefresh();

    const onResize = () => scheduleRefresh();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', scheduleRefresh);

    return () => {
      refreshCall.kill();
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', scheduleRefresh);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-trika"
      className="relative w-full overflow-x-hidden border-t border-[#e5e5e5]/40"
      style={{ backgroundColor: BRIGHT_BG, color: TEXT }}
    >
      <FlowArt aria-label="About Trika Wellness story">
        <FlowSection aria-label="Trika Wellness introduction" style={{ backgroundColor: BRIGHT_BG, color: TEXT }}>
          <div ref={panel1Ref} className="flex flex-1 flex-col justify-between gap-10 pt-6 md:pt-10">
            <div className="space-y-6 text-center">
              <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight">
                Designed for modern
                <br />
                nervous systems
              </h2>
              <p className="mx-auto max-w-2xl font-sans text-base leading-relaxed md:text-lg" style={{ color: MUTED }}>
                From clinical sound therapy and gong immersions to corporate wellness programs and private sessions —
                Trika Wellness is a Mumbai sanctuary where ancient vibrational science meets modern nervous system
                recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3" aria-label="Trika Wellness practice imagery">
              <ImageZoomReveal delay={0.1} className="relative h-64 rounded-2xl shadow-lg md:h-80 aspect-[4/3] w-full overflow-hidden">
                <img
                  src={IMAGES.heroLeft}
                  loading="eager"
                  alt="Practitioner leading a sound bath with participants resting in deep relaxation"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>

              <ImageZoomReveal delay={0.2} className="relative z-10 h-72 rounded-2xl shadow-lg md:h-96 md:-translate-y-8 aspect-[4/3] w-full overflow-hidden">
                <img
                  src={IMAGES.heroCenter}
                  loading="eager"
                  alt="Four practitioners seated with singing bowls and gong in a wellness studio"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>

              <ImageZoomReveal delay={0.3} className="relative h-64 rounded-2xl shadow-lg md:h-80 aspect-[4/3] w-full overflow-hidden">
                <img
                  src={IMAGES.heroRight}
                  loading="eager"
                  alt="Practitioner performing crystal singing bowl sound healing session"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>
            </div>
          </div>
        </FlowSection>

        <div ref={flowSectionTwoRef} className="w-full h-full relative">
          <FlowSection
            aria-label="Why choose Trika Wellness"
            style={{
              background: 'linear-gradient(155deg, #DDD5C8 0%, #EDE6DA 28%, #F2EBE3 52%, #E6E0EE 100%)',
              color: TEXT,
            }}
          >
            <div data-panel-three-inner ref={panel3Ref} className="relative flex flex-1 flex-col gap-6">
              <ConfettiBackground particleCount={60} />

              <div className="relative z-10 flex flex-1 flex-col gap-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className="flex flex-col gap-5 rounded-2xl p-6 backdrop-blur-md lg:col-span-7 lg:p-8">
                    <p className="font-sans text-[10px] uppercase tracking-[0.14em] md:text-xs" style={{ color: CAPTION }}>
                      What sets us apart
                    </p>
                    <ScrollTypewriterHeadline
                      lineOne=""
                      lineTwoPrefix="Why Choose "
                      lineTwoHighlight="Trika"
                      highlightColor={ACCENT}
                      speed={42}
                      className="mb-0"
                      lineClassName="font-sans font-medium uppercase leading-[1.15] tracking-[0.05em] text-[#2B2B2B] text-[clamp(1.5rem,3.5vw,2.5rem)]"
                    />
                    <p className="font-sans text-base leading-relaxed md:text-lg" style={{ color: MUTED }}>
                      {FOUNDER_PARAGRAPH}
                    </p>
                  </div>

                  <div
                    ref={statsGridRef}
                    className="grid grid-cols-2 gap-3 self-center lg:col-span-5 lg:mt-6 lg:gap-4 xl:mt-10"
                    aria-label="Trika Wellness highlights"
                  >
                    {STAT_CARDS.map((stat) => (
                      <Fragment key={stat.label}>
                        <StatHighlightCard
                          from={stat.from}
                          to={stat.to}
                          format={stat.format}
                          prefix={stat.prefix}
                          label={stat.label}
                          imageSrc={stat.imageSrc}
                        />
                      </Fragment>
                    ))}
                  </div>
                </div>

                <div
                  ref={clusterRef}
                  className="relative overflow-hidden rounded-2xl border px-[clamp(0.75rem,4vw,2rem)] py-[clamp(1rem,4vw,2.5rem)] lg:px-8 lg:py-10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.72)',
                    borderColor: 'rgba(216, 197, 164, 0.45)',
                    boxShadow: '0 8px 32px rgba(140, 130, 182, 0.08)',
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 50%, rgba(246, 241, 254, 0.9) 0%, rgba(253, 248, 240, 0.4) 70%)',
                    }}
                    aria-hidden
                  />
                  <div className="relative grid grid-cols-1 items-center gap-[clamp(1rem,4vw,1.5rem)] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-5 xl:gap-8">
                    <ul ref={leftCardsRef} className="hidden min-w-0 flex-col gap-3 lg:flex">
                      {LEFT_PILLARS.map((pillar, i) => (
                        <Fragment key={pillar.title}>
                          <FloatingPillarCard
                            {...pillar}
                            floatOffset={i % 2 === 0 ? '0px' : '12px'}
                          />
                        </Fragment>
                      ))}
                    </ul>

                    <div
                      className="mx-auto w-full max-w-[min(100%,340px)] shrink-0 overflow-hidden rounded-[10px] lg:max-w-[360px]"
                      style={{
                        border: `1px solid ${GOLD}`,
                        boxShadow: '0 0 0 1px rgba(216, 197, 164, 0.65), inset 0 0 0 1px rgba(216, 197, 164, 0.4)',
                      }}
                    >
                      <img
                        src={IMAGES.team}
                        alt="Trika Wellness team with practitioners in prayer pose alongside singing bowls"
                        className="h-auto min-h-[clamp(220px,52vw,320px)] w-full object-cover object-center lg:min-h-[420px]"
                      />
                    </div>

                    <ul ref={rightCardsRef} className="hidden min-w-0 flex-col gap-3 lg:flex">
                      {RIGHT_PILLARS.map((pillar, i) => (
                        <Fragment key={pillar.title}>
                          <FloatingPillarCard
                            {...pillar}
                            floatOffset={i % 2 === 0 ? '0px' : '-12px'}
                          />
                        </Fragment>
                      ))}
                    </ul>

                    <ul
                      ref={mobileCardsRef}
                      className="flex min-w-0 w-full flex-col gap-[clamp(0.5rem,2.5vw,0.75rem)] lg:hidden"
                    >
                      {LEFT_PILLARS.map((pillar) => (
                        <Fragment key={pillar.title}>
                          <FloatingPillarCard {...pillar} floatOffset="0px" />
                        </Fragment>
                      ))}
                      {RIGHT_PILLARS.map((pillar) => (
                        <Fragment key={pillar.title}>
                          <FloatingPillarCard {...pillar} floatOffset="0px" />
                        </Fragment>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FlowSection>
        </div>
      </FlowArt>
    </section>
  );
}