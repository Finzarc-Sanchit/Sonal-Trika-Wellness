/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const NAV_TARGET_CLASS = 'is-nav-target';
const MAX_ATTEMPTS = 5;
const RETRY_MS = 200;

export function clearNavTargetHighlights() {
  document.querySelectorAll(`.liquid-gallery-item.${NAV_TARGET_CLASS}`).forEach((node) => {
    node.classList.remove(NAV_TARGET_CLASS);
  });
}

function isGalleryScrollable(gallery: HTMLElement) {
  return gallery.scrollWidth > gallery.clientWidth + 1;
}

export function scrollToHashTarget(id: string, attempt = 0) {
  clearNavTargetHighlights();

  const el = document.getElementById(id);
  if (!el) {
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToHashTarget(id, attempt + 1), RETRY_MS);
    }
    return;
  }

  const gallery = el.closest('.liquid-gallery-container') as HTMLElement | null;

  if (gallery && el.classList.contains('liquid-gallery-item')) {
    const groupSection = gallery.closest('[id]') as HTMLElement | null;
    if (groupSection) {
      groupSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    window.setTimeout(() => {
      if (isGalleryScrollable(gallery)) {
        const cardLeft = el.offsetLeft;
        const cardWidth = el.offsetWidth;
        gallery.scrollTo({
          left: cardLeft - (gallery.clientWidth - cardWidth) / 2,
          behavior: 'smooth',
        });
      } else {
        el.classList.add(NAV_TARGET_CLASS);
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 280);
    return;
  }

  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function scrollToTestimonialsInstant(attempt = 0) {
  const el = document.getElementById('testimonials');
  if (!el) {
    if (attempt < MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToTestimonialsInstant(attempt + 1), RETRY_MS);
    }
    return;
  }

  el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

export function parseInternalUrl(url: string): { pathname: string; hash: string } | null {
  if (!url.startsWith('/') || url.startsWith('//')) return null;

  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) {
    return { pathname: url, hash: '' };
  }

  return {
    pathname: url.slice(0, hashIndex),
    hash: url.slice(hashIndex),
  };
}
