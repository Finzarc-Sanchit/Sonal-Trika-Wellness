/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isMobileViewport } from '../../utils/performance';

gsap.registerPlugin(ScrollTrigger);

const FULLSCREEN_IMG = '/images/sound-healing.png';
const PILL_HEADPHONES = '/images/sound-healing.png';
const PILL_MEDITATION = '/images/meditation-pill.jpg';

const ACCENT_WORDS = ['nervous', 'system', 'calm'];

export default function ScrollRevealSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [staticMode, setStaticMode] = useState(() =>
    typeof window !== 'undefined' && prefersReducedMotion(),
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setStaticMode(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const morph = morphRef.current;
    const image = imageRef.current;
    const fullscreen = fullscreenRef.current;
    const finalLayout = finalRef.current;
    const grid = gridRef.current;

    if (!section || !pin || !morph || !fullscreen || !finalLayout) return;

    const textLines = finalLayout.querySelectorAll('.reveal-line');
    const pills = finalLayout.querySelectorAll('.reveal-pill');
    const label = finalLayout.querySelector('.reveal-label');
    const accentWords = finalLayout.querySelectorAll('.accent-word');
    const accentGlow = finalLayout.querySelector('.accent-glow');
    const cta = finalLayout.querySelector('.reveal-cta');

    if (staticMode) {
      gsap.set(morph, { opacity: 0, scale: 0.38, visibility: 'hidden' });
      gsap.set(image, { scale: 1 });
      gsap.set(fullscreen, { opacity: 0 });
      gsap.set(grid, { opacity: 1 });
      gsap.set(finalLayout, { opacity: 1, pointerEvents: 'auto' });
      gsap.set([textLines, pills, label, accentWords, accentGlow, cta], {
        opacity: 1,
        y: 0,
        scale: 1,
        scaleX: 1,
        clearProps: 'filter',
      });
      return;
    }

    const scrollEnd = isMobileViewport() ? '+=120%' : '+=260%';
    const endHold = isMobileViewport() ? 0.05 : 0.25;

    const ctx = gsap.context(() => {
      gsap.set(morph, {
        scale: 0.52,
        borderRadius: '32px',
        transformOrigin: 'center center',
      });
      gsap.set(image, { scale: 1.08 });
      gsap.set(fullscreen, { opacity: 1 });
      gsap.set(finalLayout, { opacity: 0 });
      gsap.set(grid, { opacity: 0 });
      gsap.set(textLines, { y: 28, opacity: 0, force3D: true });
      gsap.set(pills, { scale: 0.96, opacity: 0, force3D: true });
      gsap.set(label, { y: 16, opacity: 0, force3D: true });
      gsap.set(accentWords, { y: 24, opacity: 0, scale: 0.98, force3D: true });
      gsap.set(accentGlow, { opacity: 0, scaleX: 0, force3D: true });
      gsap.set(cta, { y: 20, opacity: 0, force3D: true });

      const textTl = gsap.timeline({ paused: true, defaults: { ease: 'sine.out', force3D: true } });
      textTl
        .to(finalLayout, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.75,
          ease: 'sine.inOut',
        })
        .to(label, { y: 0, opacity: 1, duration: 0.7, ease: 'sine.out' }, '<0.12')
        .to(
          textLines,
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.72,
            ease: 'sine.out',
          },
          '<0.08',
        )
        .to(
          pills,
          {
            scale: 1,
            opacity: 1,
            stagger: 0.1,
            duration: 0.72,
            ease: 'sine.out',
          },
          '<0.12',
        )
        .to(
          accentGlow,
          { opacity: 0.35, scaleX: 1, duration: 0.8, ease: 'sine.inOut' },
          '<0.08',
        )
        .to(
          accentWords,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.14,
            duration: 0.9,
            ease: 'sine.out',
          },
          '<0.04',
        )
        .to(cta, { y: 0, opacity: 1, duration: 0.75, ease: 'sine.out' }, '<0.24');

      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut', force3D: true },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: scrollEnd,
          scrub: 0.45,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      tl.to(morph, {
        scale: 1,
        borderRadius: '0px',
        duration: 0.42,
        ease: 'sine.inOut',
      })
        .to(
          image,
          { scale: 1, duration: 0.42, ease: 'sine.inOut' },
          0,
        )
        .to({}, { duration: 0.14 })
        .to(morph, {
          scale: 0.38,
          borderRadius: '48px',
          opacity: 0,
          duration: 0.36,
          ease: 'sine.inOut',
        })
        .to(
          fullscreen,
          { opacity: 0, duration: 0.36, ease: 'sine.inOut' },
          '<',
        )
        .to(
          grid,
          { opacity: 1, duration: 0.32, ease: 'sine.inOut' },
          '<0.06',
        )

        // The instant the image is gone, the text plays on its own —
        // no further scrolling required (reverses if scrolled back up)
        .add(() => {
          if (tl.scrollTrigger && tl.scrollTrigger.direction === -1) {
            textTl.reverse();
          } else {
            textTl.play();
          }
        })

        // Small hold so the pin lasts while the text sequence runs
        .to({}, { duration: endHold });

    }, section);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [staticMode]);

  return (
    <section
      ref={sectionRef}
      id="scroll-reveal"
      className="relative bg-[#f9f7f4]"
      aria-label="Wellness journey reveal"
    >
      <div
        ref={pinRef}
        className={
          staticMode
            ? 'relative flex w-full flex-col items-center overflow-hidden py-8'
            : 'relative h-[76svh] w-full overflow-hidden md:h-screen'
        }
      >
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent calc(20% - 1px),
              rgba(0,0,0,0.04) calc(20% - 1px),
              rgba(0,0,0,0.04) 20%
            )`,
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div
            ref={morphRef}
            className="relative w-full h-full overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.12)] will-change-transform"
          >
            <div ref={fullscreenRef} className="absolute inset-0">
              <img
                ref={imageRef}
                src={FULLSCREEN_IMG}
                alt="Sound healing immersion"
                className="w-full h-full object-cover object-center will-change-transform"
              />
            </div>
          </div>
        </div>

        <div
          ref={finalRef}
          className={
            staticMode
              ? 'relative z-30 flex w-full flex-col items-center px-5 py-0 opacity-100 pointer-events-auto'
              : 'absolute inset-0 z-30 flex flex-col items-center justify-center px-5 py-6 opacity-0 pointer-events-none md:px-12 md:py-0'
          }
        >
          <p className="reveal-label font-sans text-caption font-medium tracking-[0.2em] text-[#888888] uppercase mb-3 text-center md:mb-14">
            Trika Wellness
          </p>

          <div className="w-full max-w-[900px] text-center">
            <div className="reveal-line font-sans font-medium text-[clamp(2rem,6.5vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B] mb-1 md:mb-2">
              Restore your
            </div>

            <div className="reveal-line flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-1 md:mb-2">
              <span className="font-sans font-medium text-[clamp(2rem,6.5vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B]">
                own journey
              </span>
              <div className="reveal-pill w-[clamp(140px,22vw,280px)] h-[clamp(48px,8vw,88px)] rounded-full overflow-hidden shrink-0 shadow-md">
                <img
                  src={PILL_MEDITATION}
                  alt="Group sound healing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="reveal-line flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-1 md:mb-2">
              <div className="reveal-pill w-[clamp(140px,22vw,280px)] h-[clamp(48px,8vw,88px)] rounded-full overflow-hidden shrink-0 shadow-md order-2 md:order-1">
                <img
                  src={PILL_HEADPHONES}
                  alt="Personal sound immersion"
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>
              <span className="font-sans font-medium text-[clamp(2rem,6.5vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B] order-1 md:order-2">
                to deeper
              </span>
            </div>

            {/* Accent line with per-word animation */}
            <div className="reveal-line relative inline-flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 mt-1">
              <span
                className="accent-glow absolute -inset-x-8 bottom-1 h-3 md:h-4 bg-[#A55A42]/20 rounded-full blur-md origin-left scale-x-0"
                aria-hidden
              />
              {ACCENT_WORDS.map((word) => (
                <span
                  key={word}
                  className="accent-word inline-block font-sans font-medium text-[clamp(2rem,6.5vw,5.5rem)] leading-[1.05] tracking-tight text-[#A55A42]"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* CTA below headline */}
            <Link
              to="/contact"
              className="reveal-cta inline-flex items-center gap-2 mt-5 md:mt-14 font-sans text-body-sm md:text-subheading font-medium tracking-tight text-[#2B2B2B] border-b border-[#A55A42]/40 pb-1 hover:text-[#A55A42] hover:border-[#A55A42] transition-colors duration-500 pointer-events-auto"
            >
              Join for the mental Wellness Journey
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
