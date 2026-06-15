/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ColorChangeCards, { ColorChangeCardItem } from '../ui/color-change-card';

const EXPERIENCES: ColorChangeCardItem[] = [
  {
    num: '01',
    heading: 'Sound Healing',
    creditLines: [
      'Singing bowls & resonant frequencies',
      'Brainwaves slow into deep theta states',
      'The body unwinds, breath by breath',
      'You leave rested — truly rested',
    ],
    imgSrc: '/images/sound-healing-bowls.png',
  },
  {
    num: '02',
    heading: 'Gong Immersions',
    creditLines: [
      'A full-body planetary gong bath',
      'Vibration washes through stored tension',
      'Wave after wave of release',
      'Stillness you can feel in your bones',
    ],
    imgSrc:
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    num: '03',
    heading: 'Kundalini Yoga',
    creditLines: [
      'Movement, mantra & ancient kriyas',
      'Dormant energy gently awakens',
      'Mental fog lifts into clarity',
      'You return to yourself',
    ],
    imgSrc:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  },
  {
    num: '04',
    heading: 'Breathwork',
    creditLines: [
      'Guided conscious breathing',
      'Each exhale releases stored stress',
      'The nervous system finds its rhythm',
      'Calm becomes your baseline',
    ],
    imgSrc:
      'https://images.unsplash.com/photo-1474418397713-7ede21d49118?auto=format&fit=crop&w=1200&q=80',
  },
];

const HEADING_LINES: { text: string; accent?: boolean }[][] = [
  [{ text: 'Modalities for' }],
  [{ text: 'deep ' }, { text: 'restoration', accent: true }],
];

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="py-20 md:py-[120px] bg-[#f6f3ee]">
      <Container>
        <div className="mb-16">
          <SectionLabel dotColor="#A55A42">Experiences</SectionLabel>

          {/* Editorial masked-line heading */}
          <h2 className="font-display text-[44px] md:text-[60px] leading-[1.04] tracking-tight text-[#2B2B2B] max-w-2xl">
            {HEADING_LINES.map((line, lineIdx) => (
              <span key={lineIdx} className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: '110%', rotate: 2 }}
                  whileInView={{ y: '0%', rotate: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    duration: 1,
                    delay: 0.15 + lineIdx * 0.18,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {line.map((part) =>
                    part.accent ? (
                      <em
                        key={part.text}
                        className="italic text-[#A55A42] font-light"
                      >
                        {part.text}
                      </em>
                    ) : (
                      <span key={part.text}>{part.text}</span>
                    ),
                  )}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Hairline rule that draws in under the heading */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 h-px w-full max-w-2xl origin-left bg-[#2B2B2B]/15"
          />
        </div>

        <ColorChangeCards items={EXPERIENCES} />
      </Container>
    </section>
  );
}
