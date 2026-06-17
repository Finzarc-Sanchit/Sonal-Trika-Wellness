/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const BRIGHT_BG = '#FDF8F0';

function cx(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(' ');
}

export interface FlowSectionProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  'aria-label'?: string;
}

export const FlowSection: React.FC<FlowSectionProps> = ({
  className,
  style = {},
  children,
  'aria-label': ariaLabel,
}) => {
  const { backgroundColor, background, color, ...innerStyle } = style;
  const sectionSurface: React.CSSProperties = {
    backgroundColor: backgroundColor ?? (background ? undefined : BRIGHT_BG),
    background,
    color,
  };

  return (
    <section
      data-flow-section
      aria-label={ariaLabel}
      className={cx('relative isolate min-h-0 w-full overflow-hidden md:min-h-screen', className)}
      style={sectionSurface}
    >
      <div
        data-flow-inner
        className={cx(
          'flow-art-container relative flex min-h-0 w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,4vw)] pb-[4vw] md:min-h-screen',
          'will-change-transform',
        )}
        style={{ transformOrigin: 'bottom left', backfaceVisibility: 'hidden', ...sectionSurface, ...innerStyle }}
      >
        {children}
      </div>
    </section>
  );
};

export interface FlowArtProps {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

const childCount = (children: React.ReactNode) => React.Children.count(children);

const FlowArt: React.FC<FlowArtProps> = ({
  children,
  className,
  'aria-label': ariaLabel = 'Story scroll',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqDesktop = window.matchMedia('(min-width: 768px)');

    const updateMotion = () => setReducedMotion(mqMotion.matches);
    const updateDesktop = () => setIsDesktop(mqDesktop.matches);

    updateMotion();
    updateDesktop();

    mqMotion.addEventListener('change', updateMotion);
    mqDesktop.addEventListener('change', updateDesktop);

    return () => {
      mqMotion.removeEventListener('change', updateMotion);
      mqDesktop.removeEventListener('change', updateDesktop);
    };
  }, []);

  useGSAP(
    () => {
      if (!containerRef.current || reducedMotion || !isDesktop) return;

      const sections = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          const prevInner = sections[i - 1]?.querySelector<HTMLElement>('.flow-art-container');
          gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });

          const tween = gsap.to(inner, {
            rotation: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
            },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

          if (prevInner) {
            const fadeTween = gsap.to(prevInner, {
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 30%',
                scrub: true,
              },
            });
            if (fadeTween.scrollTrigger) triggers.push(fadeTween.scrollTrigger);
          }
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [childCount(children), reducedMotion, isDesktop] },
  );

  return (
    <main
      ref={containerRef}
      aria-label={ariaLabel}
      className={cx('w-full overflow-x-hidden', className)}
      style={{ backgroundColor: BRIGHT_BG }}
    >
      {children}
    </main>
  );
};

export default FlowArt;
