/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const EASE = [0.25, 0.1, 0.25, 1] as const;

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 32, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};
