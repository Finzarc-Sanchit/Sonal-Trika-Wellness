/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const SPA_HOME_RETURN_KEY = 'trika:home-from-internal';

/** True after the app has completed (or skipped) its first intro in this tab. */
let hasAppLoadedOnceInTab = false;

/** Set when client-side routing navigates to home from another in-app route. */
export function markInternalNavigationToHome() {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SPA_HOME_RETURN_KEY, '1');
}

export function isNavigationReload(): boolean {
  if (typeof window === 'undefined') return false;

  const navigationEntries = performance.getEntriesByType(
    'navigation',
  )[0] as PerformanceNavigationTiming | undefined;

  return Boolean(navigationEntries && navigationEntries.type === 'reload');
}

export function isInternalReferrer(): boolean {
  if (typeof document === 'undefined') return false;

  return Boolean(document.referrer) && document.referrer.includes(window.location.origin);
}

/** Skip intro on in-app return; always play on hard reload or fresh visit. */
export function shouldSkipSiteIntro(): boolean {
  if (typeof document === 'undefined') return false;

  if (sessionStorage.getItem(SPA_HOME_RETURN_KEY) === '1') {
    sessionStorage.removeItem(SPA_HOME_RETURN_KEY);
    return true;
  }

  const isReload = isNavigationReload();
  const comingFromInternalPage = isInternalReferrer();

  return comingFromInternalPage && !isReload;
}

/** @deprecated Use shouldSkipSiteIntro — kept for existing imports. */
export function isComingFromInternalPage(): boolean {
  return shouldSkipSiteIntro();
}

/** Whether SiteIntroSplash should mount (initial visit or hard reload only). */
export function shouldShowSiteIntro(): boolean {
  if (hasAppLoadedOnceInTab) return false;
  if (shouldSkipSiteIntro()) {
    hasAppLoadedOnceInTab = true;
    return false;
  }
  return true;
}

export function markSiteIntroCompleted(): void {
  hasAppLoadedOnceInTab = true;
}
