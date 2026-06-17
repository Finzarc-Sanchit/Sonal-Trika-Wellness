/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

interface TrikaLogoProps {
  homeUrl?: string;
  variant?: 'light' | 'dark';
  showImage?: boolean;
  className?: string;
}

export default function TrikaLogo({
  homeUrl = '/',
  variant = 'dark',
  showImage = true,
  className = '',
}: TrikaLogoProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const textClass =
    variant === 'light'
      ? 'text-[#F8F5F0] group-hover:text-[#D8C5A4]'
      : 'text-[#8C82B6] group-hover:text-[#A55A42]';

  const handleClick = () => {
    if (location.pathname === homeUrl) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(homeUrl);
    window.scrollTo(0, 0);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C82B6]/40 rounded-md ${className}`}
      aria-label="Trika Wellness home"
    >
      {showImage && (
        <motion.img
          src="/images/trika-logo.png"
          alt=""
          className="h-8 w-auto md:h-9 object-contain"
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}
      <motion.span
        className={`font-sans text-lg md:text-xl font-semibold uppercase tracking-[0.22em] transition-colors duration-500 ${textClass}`}
        whileHover={{ letterSpacing: '0.28em' }}
        transition={{ duration: 0.5 }}
      >
        Trika
      </motion.span>
    </button>
  );
}
