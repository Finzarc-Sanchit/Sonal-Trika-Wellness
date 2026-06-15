/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ComponentProps } from 'react';
import { motion } from 'motion/react';

type GradientDotsProps = ComponentProps<typeof motion.div> & {
  dotSize?: number;
  spacing?: number;
  duration?: number;
  dotColor?: string;
  backgroundColor?: string;
  opacity?: number;
};

export function GradientDots({
  dotSize = 2,
  spacing = 22,
  duration = 40,
  dotColor = '#CBBD93',
  backgroundColor = '#FFFFFF',
  opacity = 0.32,
  className = '',
  ...props
}: GradientDotsProps) {
  const hexSpacing = spacing * 1.732;

  return (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundColor,
        opacity,
        backgroundImage: `
          radial-gradient(circle at 50% 50%, ${dotColor} 0.8px, transparent 1.6px),
          radial-gradient(circle at 50% 50%, ${dotColor} 0.8px, transparent 1.6px)
        `,
        backgroundSize: `${spacing}px ${hexSpacing}px, ${spacing}px ${hexSpacing}px`,
        backgroundPosition: '0px 0px, 0px 0px',
      }}
      animate={{
        backgroundPosition: [
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px`,
          `${spacing}px ${hexSpacing}px, ${spacing * 1.5}px ${hexSpacing * 1.5}px`,
          `0px 0px, ${spacing / 2}px ${hexSpacing / 2}px`,
        ],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Number.POSITIVE_INFINITY,
      }}
      {...props}
    />
  );
}
