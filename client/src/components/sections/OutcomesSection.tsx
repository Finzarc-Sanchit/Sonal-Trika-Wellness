/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { motion } from 'motion/react';
import SectionLabel from '../ui/SectionLabel';
import ImageZoomReveal from '../ui/ImageZoomReveal';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ABOUT_IMAGE = '/images/about/about-section-image.webp';
const BRIGHT_BG = '#FDF8F0';

const OUTCOMES = [
  { title: 'Stress Reduction', desc: 'Nervous system reset through sound frequencies' },
  { title: 'Emotional Balance', desc: 'Releasing emotional blocks and finding harmony' },
  { title: 'Better Sleep', desc: 'Deep relaxation through brainwave entrainment' },
  { title: 'Clearer Mind', desc: 'Enhanced mental clarity and focus' },
  { title: 'Energetic Alignment', desc: 'Deep relaxation & expanded awareness' },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

function headingShadow(accent: string) {
  return accent === '#8C82B6'
    ? '1px 1px 0 #6e66a0, 2px 2px 0 rgba(110,102,160,0.35), 3px 4px 12px rgba(140,130,182,0.2)'
    : '1px 1px 0 #8e4a35, 2px 2px 0 rgba(142,74,53,0.35)';
}

function OutcomesImage() {
  return (
    /* Added px-4 and md:px-8 to create custom safe left/right breathing space frames around the image layout */
    <div className="relative h-full w-full overflow-hidden min-h-[320px] md:min-h-0 px-4 md:px-8 py-4 md:py-6 flex items-center justify-center">
      <ImageZoomReveal delay={0.15} className="h-full w-full">
        <img
          src={ABOUT_IMAGE}
          alt="Sound healing meditation space layout context"
          className="w-full h-full object-cover object-center rounded-2xl shadow-sm"
        />
      </ImageZoomReveal>
    </div>
  );
}

export default function OutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useLayoutEffect(() => {
    const list = listRef.current;

    const ctx = gsap.context(() => {
      if (list && itemsRef.current.length) {
        gsap.set(itemsRef.current, { x: 72, opacity: 0 });
        gsap.to(itemsRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.11,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: list,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    }, sectionRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="outcomes" className="relative w-full bg-white pt-2 md:pt-4 pb-0">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.07)]"
        >
          <div
            className="border-b border-[#e5e5e5]/80 px-6 md:px-12 py-6 md:py-8"
            style={{ backgroundColor: BRIGHT_BG }}
          >
            <SectionLabel dotColor="#8C82B6">Outcomes</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE }}
              className="font-sans text-[clamp(1.25rem,2.5vw,2rem)] font-bold uppercase tracking-[0.16em] text-[#2B2B2B]"
            >
              Outcomes You{' '}
              <span
                className="inline-block"
                style={{ color: '#8C82B6', textShadow: headingShadow('#8C82B6') }}
              >
                observe
              </span>
            </motion.h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-[70fr_30fr] h-auto md:h-[min(520px,72vh)] min-h-0 overflow-hidden"
            style={{ backgroundColor: BRIGHT_BG }}
          >
            <OutcomesImage />

            <div
              className="flex flex-col justify-center overflow-hidden px-5 md:px-7 lg:px-8 py-8 md:py-10"
              style={{ backgroundColor: BRIGHT_BG }}
            >
              <ul ref={listRef} className="flex flex-col gap-3 md:gap-4 overflow-y-auto max-h-full">
                {OUTCOMES.map((item, i) => (
                  <li
                    key={item.title}
                    ref={(el) => {
                      if (el) itemsRef.current[i] = el;
                    }}
                    className="outcome-item group rounded-[10px] border-l-2 border-[#8C82B6]/25 pl-4 pr-2 py-2.5 transition-all duration-500 hover:border-[#A55A42]/60 hover:bg-white/90"
                  >
                    <h3 className="font-display text-[clamp(1rem,1.8vw,1.35rem)] leading-tight tracking-tight text-[#8C82B6] mb-1 transition-colors duration-400 group-hover:text-[#A55A42]">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[clamp(0.72rem,1.1vw,0.82rem)] leading-[1.5] tracking-[0.05em] text-[#666666] group-hover:text-[#2B2B2B] transition-colors duration-400">
                      {item.desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}