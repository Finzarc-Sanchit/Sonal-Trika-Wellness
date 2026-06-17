/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ModernWorldAmbientBackground from '../ui/ModernWorldAmbientBackground';
import {
  MODERN_WORLD_HEADING_LINES,
  MODERN_WORLD_PROBLEM_CARDS,
  MODERN_WORLD_SUBLINE,
  OVERLAPPING_LABEL,
  SECTION_LABEL,
  type ModernWorldProblemCard,
} from '../../data/nervousSystemJourney';
import { openConnectPanel } from '../../utils/serviceCta';

gsap.registerPlugin(ScrollTrigger);

const BG = '#f4f5f0';
const TEXT = '#1a1a1a';
const MUTED = '#666666';
const CARD_BORDER = 'rgba(26, 26, 26, 0.15)';

function OverlappingStackLabel({ label }: { label: string }) {
  return (
    <div
      className="pointer-events-none absolute -left-2 top-4 z-10 select-none md:-left-4 md:top-6"
      aria-hidden
    >
      <span className="block font-sans text-[clamp(1.5rem,4vw,2.75rem)] font-thin uppercase leading-[0.85] tracking-[0.18em] text-[#1a1a1a]/10">
        {label}
      </span>
      <span className="block font-sans text-[clamp(1.5rem,4vw,2.75rem)] font-thin uppercase leading-[0.85] tracking-[0.18em] text-[#1a1a1a]/20">
        {label}
      </span>
    </div>
  );
}

function ProblemCardCta({ card }: { card: ModernWorldProblemCard }) {
  const link = card.link;
  if (!link) return null;

  return (
    <div className="mt-10 flex justify-end">
      <motion.button
        type="button"
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={() => openConnectPanel(link.connect)}
        className="inline-flex items-center gap-2 rounded-[24px] px-6 py-3 font-sans text-caption font-semibold uppercase tracking-[0.14em] text-white shadow-[0_4px_8px_rgba(0,0,0,0.12)] transition-[filter] duration-500 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A55A42] hover:brightness-110"
        style={{ backgroundColor: card.titleColor }}
      >
        {link.label}
        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
      </motion.button>
    </div>
  );
}

function ProblemCard({
  card,
  index,
  showOverlappingLabel,
}: {
  card: ModernWorldProblemCard;
  index: number;
  showOverlappingLabel: boolean;
}) {
  const reversed = index % 2 === 1;

  return (
    <article
      data-problem-card
      data-card-index={index}
      className="relative z-[1] border-y bg-[#f4f5f0]/95 backdrop-blur-[2px]"
      style={{ borderColor: CARD_BORDER }}
      aria-labelledby={`${card.id}-headline`}
    >
      <div
        className={`grid min-h-[420px] grid-cols-1 md:min-h-[480px] lg:min-h-[520px] ${
          reversed ? 'lg:grid-cols-[3fr_2fr]' : 'lg:grid-cols-[2fr_3fr]'
        }`}
      >
        <div
          data-card-image
          className={`relative min-h-[300px] overflow-hidden md:min-h-[340px] lg:min-h-full ${
            reversed ? 'lg:order-2' : 'lg:order-1'
          }`}
        >
          {showOverlappingLabel ? <OverlappingStackLabel label={OVERLAPPING_LABEL} /> : null}
          <img
            data-card-img
            src={card.image}
            alt={card.imageAlt}
            className="h-full min-h-[300px] w-full origin-center object-cover object-center md:min-h-[340px] lg:min-h-full"
          />
        </div>

        <div
          data-card-text
          className={`flex flex-col justify-between px-6 py-10 md:px-10 md:py-14 lg:px-12 ${
            reversed ? 'lg:order-1' : 'lg:order-2'
          }`}
        >
          <div>
            <p
              className="mb-4 font-sans text-subheading font-bold tracking-tight"
              style={{ color: card.titleColor }}
            >
              {card.title}
            </p>
            <h3
              id={`${card.id}-headline`}
              className="max-w-lg font-sans text-[clamp(1.05rem,1.8vw,1.5rem)] font-medium uppercase leading-[1.35] tracking-[0.05em]"
              style={{ color: TEXT }}
            >
              {card.headline}
            </h3>
            <p
              className="mt-6 max-w-lg font-sans text-body-sm leading-[1.7] tracking-tight"
              style={{ color: MUTED }}
            >
              {card.problem}
            </p>
            <p
              className="mt-4 max-w-lg font-sans text-body-sm leading-[1.7] tracking-tight"
              style={{ color: TEXT }}
            >
              {card.impact}
            </p>
          </div>
          <ProblemCardCta card={card} />
        </div>
      </div>
    </article>
  );
}

export default function NervousSystemJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const xOffset = reducedMotion ? 0 : isMobile ? 56 : 110;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll<HTMLElement>('[data-problem-card]');
      cards.forEach((cardEl, index) => {
        const imageWrap = cardEl.querySelector('[data-card-image]');
        const img = cardEl.querySelector<HTMLImageElement>('[data-card-img]');
        const text = cardEl.querySelector('[data-card-text]');
        if (!imageWrap || !img || !text) return;

        const reversed = index % 2 === 1;
        const imageFromX = reversed ? xOffset : -xOffset;
        const textFromX = reversed ? -xOffset : xOffset;

        gsap.set(imageWrap, { opacity: reducedMotion ? 1 : 0, x: 0 });
        gsap.set(text, { opacity: reducedMotion ? 1 : 0, x: 0 });
        gsap.set(img, { scale: reducedMotion ? 1 : 1.18 });

        if (reducedMotion) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          imageWrap,
          { x: imageFromX, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          0,
        )
          .fromTo(
            img,
            { scale: 1.18 },
            { scale: 1, duration: 1.25, ease: 'power3.out' },
            0,
          )
          .fromTo(
            text,
            { x: textFromX, opacity: 0 },
            { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
            0.1,
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="nervous-system"
      className="snap-section-start relative w-full overflow-x-hidden py-16 md:py-20 lg:py-24"
      style={{ backgroundColor: BG, color: TEXT }}
      aria-label="What modern world faces — from dysregulation to deep restoration"
    >
      <ModernWorldAmbientBackground />

      <Container className="relative z-[1]">
        <div className="mb-12 md:mb-16">
          <SectionLabel dotColor="#8C82B6">{SECTION_LABEL}</SectionLabel>

          <h2 className="max-w-2xl font-display text-[44px] leading-[1.04] tracking-tight text-[#2B2B2B] md:text-[60px]">
            {MODERN_WORLD_HEADING_LINES.map((line, lineIdx) => (
              <span key={lineIdx} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: '110%', rotate: 2 }}
                  whileInView={{ y: '0%', rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + lineIdx * 0.18,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {line.map((part) =>
                    part.accent ? (
                      <em key={part.text} className="font-light italic text-[#8C82B6]">
                        {part.text}
                      </em>
                    ) : (
                      <span key={part.text}>{part.text}</span>
                    ),
                  )}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-5 max-w-2xl font-sans text-body-sm leading-relaxed text-[#888888]"
          >
            {MODERN_WORLD_SUBLINE}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 h-px w-full max-w-2xl origin-left bg-[#2B2B2B]/15"
          />
        </div>

        <div className="mx-auto max-w-[920px] space-y-0">
          {MODERN_WORLD_PROBLEM_CARDS.map((card, index) => (
            <ProblemCard
              key={card.id}
              card={card}
              index={index}
              showOverlappingLabel={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
