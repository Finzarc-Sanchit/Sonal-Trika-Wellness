/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

export function useInViewOnce<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, root: null, rootMargin: '0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView, threshold]);

  return { ref, isInView };
}
