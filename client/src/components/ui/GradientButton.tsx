/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

export default function GradientButton({
  children,
  onClick,
  variant = 'primary',
  icon,
}: GradientButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative overflow-hidden px-8 py-4 rounded-full font-sans font-semibold text-sm tracking-wide shadow-xl cursor-pointer flex items-center justify-center gap-2 ${isPrimary ? 'text-white' : 'text-[#2B2B2B] group-hover:text-[#2B2B2B]'}`}
    >
      {/* Base layer */}
      <span
        className={`absolute inset-0 transition-opacity duration-500 ${
          isPrimary
            ? 'bg-[#A55A42] opacity-100 group-hover:opacity-0'
            : 'bg-white/95 opacity-100 group-hover:opacity-0'
        }`}
      />

      {/* Hover gradient — distinct from brand palette */}
      <span
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isPrimary
            ? 'bg-gradient-to-r from-[#5B4A8A] via-[#8B5E83] to-[#C17F59]'
            : 'bg-gradient-to-r from-[#D8C5A4] via-[#E8D5B5] to-[#7A8B6F]'
        }`}
      />

      {/* Shimmer sweep on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </span>

      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon}
      </span>
    </motion.button>
  );
}
