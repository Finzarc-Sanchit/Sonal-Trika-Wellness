/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Plus } from 'lucide-react';

export interface ColorChangeCardItem {
  num: string;
  heading: string;
  /** Lines shown on click via credit-roll effect */
  creditLines: string[];
  imgSrc: string;
}

interface ColorChangeCardsProps {
  items: ColorChangeCardItem[];
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

const ColorChangeCards = ({ items }: ColorChangeCardsProps) => {
  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6" style={{ perspective: '1200px' }}>
      {items.map((item, i) => (
        <div key={item.num} className="h-full">
          <Card {...item} index={i} />
        </div>
      ))}
    </div>
  );
};

// --- Card Component ---

interface CardProps extends ColorChangeCardItem {
  index: number;
}

const Card = ({ num, heading, creditLines, imgSrc, index }: CardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      transition={{ staggerChildren: 0.035 }}
      whileHover="hover"
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.92,
          rotateX: 12,
          clipPath: 'inset(16% 10% 16% 10% round 40px)',
        },
        visible: {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          clipPath: 'inset(0% 0% 0% 0% round 24px)',
          transition: { duration: 1.1, delay: index * 0.14, ease: EASE },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{ transformOrigin: 'center bottom' }}
      onClick={() => setOpen((prev) => !prev)}
      className="group relative h-64 md:h-72 w-full cursor-pointer overflow-hidden rounded-[24px] bg-[#D8C5A4] shadow-[0_16px_32px_rgba(0,0,0,0.08)]"
    >
      {/* Image — desaturated until hover, gentle zoom */}
      <div
        className="absolute inset-0 saturate-100 transition-all duration-700 ease-out group-hover:scale-110 md:saturate-0 md:group-hover:saturate-100"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Legibility gradient — deepens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2B2B2B]/70 via-[#2B2B2B]/20 to-transparent transition-opacity duration-700 opacity-60 group-hover:opacity-90" />

      <div className="relative z-20 flex h-full flex-col justify-between p-6 md:p-8 text-[#F8F5F0]/90 transition-colors duration-500 group-hover:text-white">
        <div className="flex items-start justify-between">
          <span className="font-display text-[40px] leading-none tracking-tight text-[#F8F5F0]/50 transition-colors duration-500 group-hover:text-[#D8C5A4]">
            {num}
          </span>
          {/* Open/close indicator */}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </motion.span>
        </div>

        <h4>
          {heading.split('').map((letter, i) => (
            <span key={`${letter}-${i}`} className="inline-block">
              <AnimatedLetter letter={letter} />
            </span>
          ))}
        </h4>
      </div>

      {/* Credit-roll overlay on click */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute inset-0 z-30 rounded-[24px] bg-[#2B2B2B]/92 backdrop-blur-md overflow-hidden"
          >
            <motion.div
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-110%' }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="font-sans text-caption uppercase tracking-[0.25em] text-[#D8C5A4] mb-2"
              >
                {heading}
              </motion.p>
              {creditLines.map((line, i) => (
                <motion.p
                  key={line}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.18, duration: 0.6, ease: EASE }}
                  className="font-display text-lg md:text-xl italic leading-snug tracking-tight text-[#F8F5F0]"
                >
                  {line}
                </motion.p>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.7 + creditLines.length * 0.18, duration: 0.6 }}
                className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#F8F5F0] mt-4"
              >
                Tap to close
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- AnimatedLetter Helper Component ---

interface AnimatedLetterProps {
  letter: string;
}

const letterVariants: Variants = {
  hover: {
    y: '-50%',
  },
};

const AnimatedLetter = ({ letter }: AnimatedLetterProps) => {
  return (
    <div className="inline-block h-[34px] md:h-[38px] overflow-hidden font-sans font-medium text-[26px] md:text-[30px] tracking-tight">
      <motion.span
        className="flex min-w-[4px] flex-col"
        style={{ y: '0%' }}
        variants={letterVariants}
        transition={{ duration: 0.5 }}
      >
        <span>{letter === ' ' ? '\u00A0' : letter}</span>
        <span>{letter === ' ' ? '\u00A0' : letter}</span>
      </motion.span>
    </div>
  );
};

export default ColorChangeCards;
