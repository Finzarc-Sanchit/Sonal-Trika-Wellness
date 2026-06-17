/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Instagram, Linkedin } from 'lucide-react';
import ScrollTypewriterHeadline from '../ui/ScrollTypewriterHeadline';
import EditorialQuote from '../ui/EditorialQuote';
import WatchExperienceButton from '../ui/WatchExperienceButton';
import { FOUNDER_SOCIAL } from '../../data/founderContact';

gsap.registerPlugin(ScrollTrigger);

const TEXT = '#2B2B2B';
const MUTED = '#666666';
const CAPTION = '#888888';
const ACCENT = '#8C82B6';
const LIGHT_VIOLET = '#8C82B6';
const GOLD = '#D8C5A4';
const TERRACOTTA = '#A55A42';

function PillLink({ href, children }: { href: string; children: ReactNode }) {
  const cls =
    'inline-flex items-center gap-2 rounded-[37px] px-[22px] py-3 font-sans text-sm font-medium tracking-[0.05em] text-white transition-colors duration-400 hover:bg-[#7A8B6F]';
  const style = { backgroundColor: TERRACOTTA };

  return href.startsWith('/') && !href.includes('#') ? (
    <Link to={href} className={cls} style={style}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} style={style}>
      {children}
    </a>
  );
}

export default function FounderEditorialContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const portraitWrapRef = useRef<HTMLDivElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(
          labelRef.current,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: labelRef.current, start: 'top 92%', toggleActions: 'play none none reverse' },
          },
        );
      }

      if (portraitWrapRef.current && portraitImgRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: portraitWrapRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
        tl.fromTo(
          portraitWrapRef.current,
          { scale: 0.94, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        ).fromTo(
          portraitImgRef.current,
          { scale: 1.12 },
          { scale: 1, duration: 1.4, ease: 'power2.out' },
          '-=0.8',
        );
      }
    }, root);

    const onReveal = () => {
      if (!root) return;
      gsap.fromTo(root, { y: 24, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' });
    };
    window.addEventListener('founder-section-reveal', onReveal);

    return () => {
      window.removeEventListener('founder-section-reveal', onReveal);
      ctx.revert();
    };
  }, []);

  const handlePortraitEnter = () => {
    if (!portraitWrapRef.current || !portraitImgRef.current) return;
    gsap.to(portraitWrapRef.current, {
      boxShadow: `0 0 28px rgba(216, 197, 164, 0.55), inset 0 0 0 1px ${GOLD}`,
      duration: 0.5,
      ease: 'power2.out',
    });
    gsap.to(portraitImgRef.current, { scale: 1.04, duration: 0.6, ease: 'power2.out' });
  };

  const handlePortraitLeave = () => {
    if (!portraitWrapRef.current || !portraitImgRef.current) return;
    gsap.to(portraitWrapRef.current, {
      boxShadow: '0 0 0 1px rgba(216, 197, 164, 0.65), inset 0 0 0 1px rgba(216, 197, 164, 0.4)',
      duration: 0.5,
      ease: 'power2.out',
    });
    gsap.to(portraitImgRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
  };

  return (
    <div ref={rootRef} id="founder-story" className="flex flex-1 flex-col">
      <div className="mt-4 border-t border-[#e5e5e5]/80 pb-6 pt-6 md:pb-8 md:pt-8">
        <p
          ref={labelRef}
          className="mb-5 font-sans text-[10px] uppercase tracking-[0.12em] md:mb-6 md:text-xs"
        >
          <span style={{ color: LIGHT_VIOLET }}>Founder</span>
          <span style={{ color: CAPTION }}> Story</span>
        </p>

        <ScrollTypewriterHeadline
          lineOne="About"
          lineTwoPrefix="the "
          lineTwoHighlight="Founder"
          highlightColor={LIGHT_VIOLET}
          speed={50}
          className="mb-0"
          lineClassName="font-sans font-medium uppercase leading-[1.15] tracking-[0.05em] text-[#2B2B2B] text-[clamp(1.5rem,3.5vw,2.5rem)]"
        />
      </div>

      <div className="grid flex-1 grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-6 md:gap-8 lg:col-span-5">
          <div
            ref={portraitWrapRef}
            className="relative cursor-pointer overflow-hidden rounded-[10px]"
            style={{
              border: `1px solid ${GOLD}`,
              boxShadow: '0 0 0 1px rgba(216, 197, 164, 0.65), inset 0 0 0 1px rgba(216, 197, 164, 0.4)',
            }}
            onMouseEnter={handlePortraitEnter}
            onMouseLeave={handlePortraitLeave}
          >
            <img
              ref={portraitImgRef}
              src="/images/sonia-founder.png"
              alt="Sonia Razdan with gong and singing bowls"
              className="h-auto min-h-[320px] w-full object-cover object-center"
            />
          </div>

          <EditorialQuote accentColor={TERRACOTTA}>
            Sound is not merely heard — it is felt. In a world that never stops moving,{' '}
            <span className="font-medium" style={{ color: TERRACOTTA }}>
              vibrational healing offers a return to stillness
            </span>{' '}
            — a bridge between silence and awakening, where frequency softens the nervous system and the body remembers
            its true rhythm.
          </EditorialQuote>
        </div>

        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="mb-4 font-sans text-[clamp(2rem,5vw,3.5rem)] font-medium uppercase leading-[1.05] tracking-[0.05em] text-[#2B2B2B]">
            Sonia Razdan
          </p>
          <p className="mb-2 font-sans text-[15px] leading-[1.5] tracking-[0.05em]" style={{ color: LIGHT_VIOLET }}>
            Founder — Trika Sound Sanctuary
          </p>
          <p className="mb-8 font-sans text-[12px] uppercase tracking-[0.08em]" style={{ color: CAPTION }}>
            Sound Therapist | Gong Master
          </p>

          <div
            className="founder-block mb-6 rounded-[10px] bg-white p-[22px]"
            style={{ boxShadow: '0 0 0 1px rgba(229, 229, 229, 0.9)' }}
          >
            <h3 className="mb-4 font-sans text-[17px] font-medium tracking-[0.05em] text-[#2B2B2B]">
              Meet Sonia Razdan
            </h3>
            <p className="mb-4 font-sans text-[12px] tracking-[0.05em]" style={{ color: ACCENT }}>
              Founder, Trika Yoga &amp; Wellness · Certified Sound Therapist &amp; Gong Master · Kundalini Yoga Teacher
            </p>
            <p className="mb-4 font-sans text-[15px] leading-[1.66] tracking-[0.05em] text-[#2B2B2B]/88">
              Sonia&apos;s journey into vibrational healing began as a deeply personal exploration of frequency and
              resonance. What started as a path to self-discovery quickly evolved into a calling to share the restorative
              power of sound with the world.
            </p>
            <p className="font-sans text-[15px] leading-[1.66] tracking-[0.05em]" style={{ color: MUTED }}>
              Today, as the founder of <strong className="font-medium text-[#2B2B2B]">Trika Yoga &amp; Wellness</strong>,
              she creates spaces for inner transformation, helping people reset and realign in a fast-paced world.
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-3 font-sans text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: CAPTION }}>
              Connect with Sonia
            </p>
            <div className="flex gap-3">
              <a
                href={FOUNDER_SOCIAL.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={FOUNDER_SOCIAL.instagram.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8C82B6]/25 bg-[#8C82B6]/15 text-[#8C82B6] transition-colors duration-300 hover:border-[#A55A42] hover:bg-[#A55A42] hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={FOUNDER_SOCIAL.linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={FOUNDER_SOCIAL.linkedin.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8C82B6]/25 bg-[#8C82B6]/15 text-[#8C82B6] transition-colors duration-300 hover:border-[#A55A42] hover:bg-[#A55A42] hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PillLink href="/contact">
              Get In Touch
              <ArrowUpRight className="h-4 w-4" />
            </PillLink>
            <WatchExperienceButton variant="pill" />
          </div>
        </div>
      </div>
    </div>
  );
}
