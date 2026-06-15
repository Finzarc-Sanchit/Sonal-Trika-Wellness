/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EASE } from '../../lib/motion';

type Direction = 'up' | 'left' | 'right';

interface DirectionalRevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
}

const OFFSET = 40;

function getInitial(direction: Direction, reduced: boolean) {
  if (reduced) return { opacity: 0 };
  switch (direction) {
    case 'left':
      return { opacity: 0, x: -OFFSET };
    case 'right':
      return { opacity: 0, x: OFFSET };
    default:
      return { opacity: 0, y: OFFSET };
  }
}

function getAnimate(reduced: boolean) {
  if (reduced) return { opacity: 1 };
  return { opacity: 1, x: 0, y: 0 };
}

export default function DirectionalReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: DirectionalRevealProps) {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={getInitial(direction, !!reducedMotion)}
      animate={inView ? getAnimate(!!reducedMotion) : getInitial(direction, !!reducedMotion)}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
