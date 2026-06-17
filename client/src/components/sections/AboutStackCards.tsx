/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { openConnectPanel, type ConnectPanelDetail } from '../../utils/serviceCta';

export interface AboutStackCardData {
  id: string;
  label: string;
  body: string;
  cta: string;
  ctaHref?: string;
  connectPanel?: ConnectPanelDetail;
  imageSrc: string;
  imageAlt: string;
  animateBody?: boolean;
  accentColor?: string;
  ctaColor?: string;
  ctaHoverColor?: string;
}

interface AboutStackCardsProps {
  cards: AboutStackCardData[];
}

const AUTO_INTERVAL_MS = 5000;
const ACCENT_COLORS = ['#A55A42', '#7A8B6F', '#8C82B6'];
const PANEL_BASE = '#D8C5A4';
const PANEL_BRIGHT = '#F2E8D4';
const PANEL_ACTIVE = '#FAF3E6';

function headingShadow(accent: string) {
  if (accent === '#A55A42')
    return '1px 1px 0 #8e4a35, 2px 2px 0 rgba(142,74,53,0.4), 3px 4px 12px rgba(165,90,66,0.2)';
  if (accent === '#7A8B6F')
    return '1px 1px 0 #5f6d56, 2px 2px 0 rgba(95,109,86,0.4), 3px 4px 12px rgba(122,139,111,0.2)';
  return '1px 1px 0 #6e66a0, 2px 2px 0 rgba(110,102,160,0.35), 3px 4px 12px rgba(140,130,182,0.2)';
}

function CardCta({
  href,
  label,
  color,
  hoverColor,
  connectPanel,
}: {
  href?: string;
  label: string;
  color: string;
  hoverColor: string;
  connectPanel?: ConnectPanelDetail;
}) {
  const inner = (
    <motion.span
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 font-sans text-[clamp(0.65rem,1.1vw,0.8rem)] font-semibold uppercase tracking-[0.14em] text-[#2B2B2B] shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
      style={{ backgroundColor: color }}
    >
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{ backgroundColor: hoverColor }}
      />
      <span className="relative z-10 flex items-center gap-2 transition-colors duration-400 group-hover:text-white">
        {label}
        <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </motion.span>
  );

  if (connectPanel) {
    return (
      <button
        type="button"
        onClick={() => openConnectPanel(connectPanel)}
        className="inline-flex justify-center shrink-0 relative z-20"
      >
        {inner}
      </button>
    );
  }

  if (!href) return null;

  return href.startsWith('/') ? (
    <Link to={href} className="inline-flex justify-center shrink-0 relative z-20">
      {inner}
    </Link>
  ) : (
    <a href={href} className="inline-flex justify-center shrink-0 relative z-20">
      {inner}
    </a>
  );
}

function CardPanel({
  card,
  accentColor,
  imageRef,
  isActive,
}: {
  card: AboutStackCardData;
  accentColor: string;
  imageRef: (el: HTMLDivElement | null) => void;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const bright = isActive || hovered;

  return (
    <div
      className="grid h-full w-full grid-cols-1 md:grid-cols-[65fr_35fr] overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.08)] md:h-[min(520px,72vh)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative min-h-[240px] md:min-h-0 overflow-hidden">
        <div ref={imageRef} className="absolute inset-0">
          <img
            src={card.imageSrc}
            alt={card.imageAlt}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-[#2B2B2B]/6" />
      </div>

      <motion.div
        animate={{ backgroundColor: bright ? PANEL_ACTIVE : PANEL_BASE }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="grid grid-rows-[1fr_auto] overflow-hidden p-6 md:p-8 lg:p-10 text-center min-h-[320px] md:min-h-0"
      >
        <div className="flex flex-col items-center justify-center overflow-hidden min-h-0 px-1">
          <h3
            className="mb-4 shrink-0 font-sans text-[clamp(0.65rem,1.2vw,0.85rem)] font-bold uppercase tracking-[0.18em] transition-colors duration-500"
            style={{
              color: accentColor,
              textShadow: headingShadow(accentColor),
              filter: bright ? 'brightness(1.05)' : 'none',
            }}
          >
            {card.label}
          </h3>
          <p
            className={`font-sans text-[clamp(0.72rem,1.25vw,0.9rem)] leading-[1.58] tracking-tight max-w-full overflow-hidden transition-colors duration-500 ${
              bright ? 'text-[#1A1A1A]' : 'text-[#2B2B2B]'
            }`}
          >
            {card.body}
          </p>
        </div>
        <div className="shrink-0 pt-4 flex justify-center relative z-20">
          <CardCta
            href={card.ctaHref}
            connectPanel={card.connectPanel}
            label={card.cta}
            color={bright ? PANEL_BRIGHT : (card.ctaColor ?? '#E8DFCF')}
            hoverColor={card.ctaHoverColor ?? accentColor}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutStackCards({ cards }: AboutStackCardsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const zoomTweens = useRef<gsap.core.Tween[]>([]);
  const animating = useRef(false);
  const wheelLock = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, cards.length - 1));
      if (clamped === activeIndexRef.current || animating.current) return;

      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;

      animating.current = true;
      const width = viewport.offsetWidth;

      zoomTweens.current.forEach((t) => t.kill());
      zoomTweens.current = [];

      gsap.fromTo(
        track,
        { x: -activeIndexRef.current * width },
        {
          x: -clamped * width,
          duration: 1.15,
          ease: 'power3.inOut',
          onComplete: () => {
            activeIndexRef.current = clamped;
            setActiveIndex(clamped);
            animating.current = false;
          },
        }
      );

      const img = imageRefs.current[clamped];
      if (img) {
        gsap.set(img, { scale: 1.12 });
        zoomTweens.current.push(
          gsap.to(img, { scale: 1, duration: 1.4, ease: 'power2.out' }),
          gsap.to(img, {
            scale: 1.06,
            duration: 8,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 1.4,
          })
        );
      }
    },
    [cards.length]
  );

  const next = useCallback(() => goTo(activeIndexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(activeIndexRef.current - 1), [goTo]);

  const syncTrackPosition = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    gsap.set(track, { x: -index * viewport.offsetWidth });
  }, []);

  useLayoutEffect(() => {
    syncTrackPosition(0);
    const img = imageRefs.current[0];
    if (img) {
      zoomTweens.current.push(
        gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power2.out' }),
        gsap.to(img, {
          scale: 1.06,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.4,
        })
      );
    }
    const onResize = () => syncTrackPosition(activeIndexRef.current);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      zoomTweens.current.forEach((t) => t.kill());
    };
  }, [syncTrackPosition]);

  useEffect(() => {
    if (activeIndex >= cards.length - 1) return;
    const timer = window.setTimeout(next, AUTO_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, cards.length, next]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (wheelLock.current || animating.current) return;
      if (Math.abs(e.deltaY) < 10) return;
      wheelLock.current = true;
      if (e.deltaY > 0) next();
      else prev();
      window.setTimeout(() => { wheelLock.current = false; }, 1100);
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [next, prev]);

  return (
    <div ref={sectionRef} className="relative w-full">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden md:h-[min(520px,72vh)]"
      >
        <div ref={trackRef} className="flex h-full will-change-transform">
          {cards.map((card, i) => (
            <div key={card.id} className="w-full min-w-full shrink-0 h-full">
              <CardPanel
                card={card}
                isActive={i === activeIndex}
                accentColor={card.accentColor ?? ACCENT_COLORS[i % ACCENT_COLORS.length]}
                imageRef={(el) => { imageRefs.current[i] = el; }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            aria-label={`Show card ${i + 1}`}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex ? 'w-10 bg-[#A55A42]' : 'w-3 bg-[#CBBD93]/60 hover:bg-[#CBBD93]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
