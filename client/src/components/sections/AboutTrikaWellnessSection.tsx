/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef } from 'react';
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
  const panel3Ref = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<HTMLUListElement>(null);
  const rightCardsRef = useRef<HTMLUListElement>(null);
  const mobileLeftCardsRef = useRef<HTMLUListElement>(null);
  const mobileRightCardsRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const panel = panel3Ref.current;
    if (!panel) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const edgeOffset = () => Math.min(window.innerWidth * 0.45, 520);
    const mobileOffset = () => Math.min(window.innerWidth * 0.35, 280);

    const ctx = gsap.context(() => {
      const animateCards = (container: HTMLElement | null, fromX: number | (() => number)) => {
        if (!container) return;
        const cards = container.querySelectorAll('.trika-pillar-card');
        if (cards.length === 0) return;
        gsap.fromTo(
          cards,
          { x: fromX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: clusterRef.current ?? container,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      };

      animateCards(leftCardsRef.current, () => -edgeOffset());
      animateCards(rightCardsRef.current, () => edgeOffset());
      animateCards(mobileLeftCardsRef.current, () => -mobileOffset());
      animateCards(mobileRightCardsRef.current, () => mobileOffset());
    }, panel);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about-trika"
      className="relative w-full overflow-x-hidden border-t border-[#e5e5e5]/40"
      style={{ backgroundColor: BRIGHT_BG, color: TEXT }}
    >
      <FlowArt aria-label="About Trika Wellness story">
        <FlowSection aria-label="Trika Wellness introduction" style={{ backgroundColor: BRIGHT_BG, color: TEXT }}>
          <div className="flex flex-1 flex-col justify-between gap-10 pt-6 md:pt-10">
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
              <ImageZoomReveal delay={0.1} className="relative h-64 rounded-2xl shadow-lg md:h-80">
                <img
                  src={IMAGES.heroLeft}
                  alt="Practitioner leading a sound bath with participants resting in deep relaxation"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>

              <ImageZoomReveal delay={0.2} className="relative z-10 h-72 rounded-2xl shadow-lg md:h-96 md:-translate-y-8">
                <img
                  src={IMAGES.heroCenter}
                  alt="Four practitioners seated with singing bowls and gong in a wellness studio"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>

              <ImageZoomReveal delay={0.3} className="relative h-64 rounded-2xl shadow-lg md:h-80">
                <img
                  src={IMAGES.heroRight}
                  alt="Practitioner performing crystal singing bowl sound healing session"
                  className="h-full w-full object-cover"
                />
              </ImageZoomReveal>
            </div>
          </div>
        </FlowSection>

        <FlowSection
          aria-label="Why choose Trika Wellness"
          style={{
            background: 'linear-gradient(155deg, #DDD5C8 0%, #EDE6DA 28%, #F2EBE3 52%, #E6E0EE 100%)',
            color: TEXT,
          }}
        >
          <div ref={panel3Ref} className="relative flex flex-1 flex-col gap-6">
            <CardMeshOverlay className="opacity-40" />
            <ConfettiBackground particleCount={60} />

            <div className="relative z-10 flex flex-1 flex-col gap-8">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                <div className="flex flex-col gap-5 rounded-2xl bg-white/55 p-6 backdrop-blur-md lg:col-span-7 lg:p-8">
                  <p className="font-sans text-[10px] uppercase tracking-[0.14em] md:text-xs" style={{ color: CAPTION }}>
                    What sets us apart
                  </p>
                  <ScrollTypewriterHeadline
                    lineOne=""
                    lineTwoPrefix="Why Choose "
                    lineTwoHighlight="Trika"
                    highlightColor={ACCENT}
                    speed={42}
                    triggerRef={panel3Ref}
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
                    <StatHighlightCard
                      key={stat.label}
                      triggerRef={statsGridRef}
                      from={stat.from}
                      to={stat.to}
                      format={stat.format}
                      prefix={stat.prefix}
                      label={stat.label}
                      imageSrc={stat.imageSrc}
                    />
                  ))}
                </div>
              </div>

              <div
                ref={clusterRef}
                className="relative overflow-hidden rounded-2xl border px-3 py-6 md:px-8 md:py-10"
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
              <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-5 xl:gap-8">
                <ul ref={leftCardsRef} className="hidden min-w-0 flex-col gap-3 lg:flex">
                  {LEFT_PILLARS.map((pillar, i) => (
                    <FloatingPillarCard
                      key={pillar.title}
                      {...pillar}
                      floatOffset={i % 2 === 0 ? '0px' : '12px'}
                    />
                  ))}
                </ul>

                <div
                  className="mx-auto w-full max-w-[340px] shrink-0 overflow-hidden rounded-[10px] lg:max-w-[360px]"
                  style={{
                    border: `1px solid ${GOLD}`,
                    boxShadow: '0 0 0 1px rgba(216, 197, 164, 0.65), inset 0 0 0 1px rgba(216, 197, 164, 0.4)',
                  }}
                >
                  <img
                    src={IMAGES.team}
                    alt="Trika Wellness team with practitioners in prayer pose alongside singing bowls"
                    className="h-auto min-h-[320px] w-full object-cover object-center lg:min-h-[420px]"
                  />
                </div>

                <ul ref={rightCardsRef} className="hidden min-w-0 flex-col gap-3 lg:flex">
                  {RIGHT_PILLARS.map((pillar, i) => (
                    <FloatingPillarCard
                      key={pillar.title}
                      {...pillar}
                      floatOffset={i % 2 === 0 ? '0px' : '-12px'}
                    />
                  ))}
                </ul>

                <div className="col-span-1 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:hidden">
                  <ul ref={mobileLeftCardsRef} className="flex min-w-0 flex-col gap-3">
                    {LEFT_PILLARS.map((pillar) => (
                      <FloatingPillarCard key={pillar.title} {...pillar} floatOffset="0px" />
                    ))}
                  </ul>
                  <ul ref={mobileRightCardsRef} className="flex min-w-0 flex-col gap-3">
                    {RIGHT_PILLARS.map((pillar) => (
                      <FloatingPillarCard key={pillar.title} {...pillar} floatOffset="0px" />
                    ))}
                  </ul>
                </div>
              </div>
              </div>
            </div>
          </div>
        </FlowSection>
      </FlowArt>
    </section>
  );
}
