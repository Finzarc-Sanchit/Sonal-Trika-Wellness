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
const REFRESH_DEBOUNCE_S = 0.1;

function createScrollRefreshScheduler() {
  const call = gsap.delayedCall(REFRESH_DEBOUNCE_S, () => ScrollTrigger.refresh()).pause();

  return {
    schedule() {
      call.restart(true);
    },
    kill() {
      call.kill();
    },
  };
}

function bindSectionMeasurements(
  root: HTMLElement,
  sections: HTMLElement[],
  scheduleRefresh: () => void,
) {
  const observed = new Set<Element>();
  const resizeObserver = new ResizeObserver(scheduleRefresh);

  const observe = (node: Element | null | undefined) => {
    if (!node || observed.has(node)) return;
    observed.add(node);
    resizeObserver.observe(node);
  };

  sections.forEach((section) => {
    observe(section);
    observe(section.querySelector<HTMLElement>('[data-flow-inner]'));
    observe(section.querySelector<HTMLElement>('.flow-art-container'));
  });

  root.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', scheduleRefresh, { once: true });
    img.addEventListener('error', scheduleRefresh, { once: true });
  });

  return () => {
    resizeObserver.disconnect();
    root.querySelectorAll('img').forEach((img) => {
      img.removeEventListener('load', scheduleRefresh);
      img.removeEventListener('error', scheduleRefresh);
    });
  };
}


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
  style,
  children,
  'aria-label': ariaLabel,
}) => {
  const sectionStyle: React.CSSProperties = style ?? {};
  const { backgroundColor, background, color, ...innerStyle } = sectionStyle;
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
      const root = containerRef.current as HTMLElement | null;
      if (!root || reducedMotion || !isDesktop) return;

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length === 0) return;

      const refreshScheduler = createScrollRefreshScheduler();
      const triggers: ScrollTrigger[] = [];

      sections.forEach((section: HTMLElement, i: number) => {
        gsap.set(section, { zIndex: i + 1 });

        const inner = section.querySelector<HTMLElement>('.flow-art-container');
        if (!inner) return;

        if (i > 0) {
          const prevInner = sections[i - 1]?.querySelector<HTMLElement>('.flow-art-container');
          gsap.set(inner, { y: '100%' });

          const tween = gsap.to(inner, {
            y: '0%',
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 25%',
              scrub: true,
              invalidateOnRefresh: true,
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
                invalidateOnRefresh: true,
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
              invalidateOnRefresh: true,
            }),
          );
        }
      });

      const disconnectMeasurements = bindSectionMeasurements(
        root,
        sections,
        refreshScheduler.schedule,
      );

      refreshScheduler.schedule();
      ScrollTrigger.refresh();

      return () => {
        disconnectMeasurements();
        refreshScheduler.kill();
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
