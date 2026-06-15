/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function shouldDisableHeavyMotion(): boolean {
  return prefersReducedMotion() || isMobileViewport();
}

/**
 * Passive scroll listener throttled to one update per animation frame.
 */
export function onScrollRAF(
  callback: (scrollY: number) => void,
  options?: { passive?: boolean },
): () => void {
  let ticking = false;
  let lastY = 0;

  const onScroll = () => {
    lastY = window.scrollY;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      callback(lastY);
    });
  };

  window.addEventListener('scroll', onScroll, {
    passive: options?.passive ?? true,
  });
  onScroll();

  return () => window.removeEventListener('scroll', onScroll);
}

/**
 * Passive scroll listener that only fires when a boolean threshold changes.
 */
export function onScrollThreshold(
  threshold: number,
  callback: (pastThreshold: boolean) => void,
): () => void {
  let past = window.scrollY > threshold;

  return onScrollRAF((y) => {
    const next = y > threshold;
    if (next !== past) {
      past = next;
      callback(next);
    }
  });
}
