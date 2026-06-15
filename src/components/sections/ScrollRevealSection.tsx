/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      gsap.set(textLines, { y: 56, opacity: 0, filter: 'blur(8px)' });
      gsap.set(pills, { scale: 0.9, opacity: 0, filter: 'blur(4px)' });
      gsap.set(label, { y: 24, opacity: 0 });
      gsap.set(accentWords, { y: 40, opacity: 0, filter: 'blur(12px)', scale: 0.92 });
      gsap.set(accentGlow, { opacity: 0, scaleX: 0 });
      gsap.set(cta, { y: 28, opacity: 0 });

      // Text sequence — plays automatically (time-based, NOT scroll-scrubbed)
      // the moment the image has minimized. All original animations kept.
      const textTl = gsap.timeline({ paused: true });
      textTl
        .to(finalLayout, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.5,
          ease: 'power1.inOut',
        })
        .to(label, { y: 0, opacity: 1, duration: 0.5, ease: 'power1.out' }, '<0.15')
        .to(
          textLines,
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.12,
            duration: 0.7,
            ease: 'power1.out',
          },
          '<0.1'
        )
        .to(
          pills,
          {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            stagger: 0.15,
            duration: 0.7,
            ease: 'power1.out',
          },
          '<0.2'
        )

        // Accent line — word-by-word cinematic reveal
        .to(
          accentGlow,
          { opacity: 0.35, scaleX: 1, duration: 0.6, ease: 'power1.inOut' },
          '<0.1'
        )
        .to(
          accentWords,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            stagger: 0.18,
            duration: 0.8,
            ease: 'power2.out',
          },
          '<0.05'
        )

        // CTA below headline
        .to(
          cta,
          { y: 0, opacity: 1, duration: 0.6, ease: 'power1.out' },
          '<0.3'
        );

      // Scroll-scrubbed timeline — controls ONLY the image morph
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=260%',
          scrub: 2,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — window expands to full screen (butter-smooth scale)
      tl.to(morph, {
        scale: 1,
        borderRadius: '0px',
        duration: 0.38,
        ease: 'power1.inOut',
      })
        .to(
          image,
          { scale: 1, duration: 0.38, ease: 'power1.inOut' },
          0
        )

        // Phase 2 — gentle hold at full screen
        .to({}, { duration: 0.18 })

        // Phase 3 — image minimizes away
        .to(morph, {
          scale: 0.38,
          borderRadius: '48px',
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        })
        .to(
          fullscreen,
          { opacity: 0, duration: 0.3, ease: 'power1.inOut' },
          '<'
        )
        .to(
          grid,
          { opacity: 1, duration: 0.26, ease: 'power1.inOut' },
          '<0.08'
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
        .to({}, { duration: 0.25 });

    }, section);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scroll-reveal"
      className="relative bg-[#f9f7f4]"
      aria-label="Wellness journey reveal"
    >
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
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

        {/* Morphing fullscreen container */}
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

        {/* Final editorial layout */}
        <div
          ref={finalRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 md:px-12 opacity-0 pointer-events-none"
        >
          <p className="reveal-label font-sans text-caption font-medium tracking-[0.2em] text-[#888888] uppercase mb-10 md:mb-14">
            Trika Wellness
          </p>

          <div className="w-full max-w-[900px] text-center">
            <div className="reveal-line font-sans font-medium text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B] mb-1 md:mb-2">
              Restore your
            </div>

            <div className="reveal-line flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-1 md:mb-2">
              <span className="font-sans font-medium text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B]">
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
              <span className="font-sans font-medium text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-[#2B2B2B] order-1 md:order-2">
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
                  className="accent-word inline-block font-sans font-medium text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-[#A55A42]"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* CTA below headline */}
            <a
              href="#contact"
              className="reveal-cta inline-flex items-center gap-2 mt-10 md:mt-14 font-sans text-body-sm md:text-subheading font-medium tracking-tight text-[#2B2B2B] border-b border-[#A55A42]/40 pb-1 hover:text-[#A55A42] hover:border-[#A55A42] transition-colors duration-500 pointer-events-auto"
            >
              Join for the mental Wellness Journey
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
