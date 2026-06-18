/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type Lenis from 'lenis';
import type { ScrollToOptions } from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

export function scrollLenisTo(
  target: Parameters<Lenis['scrollTo']>[0],
  options?: ScrollToOptions,
): boolean {
  const lenis = getLenisInstance();
  if (!lenis) return false;
  lenis.scrollTo(target, options);
  return true;
}
