/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ColorChangeCards, { ColorChangeCardItem } from '../ui/color-change-card';
import ExperiencesTypewriterHeadline from '../ui/ExperiencesTypewriterHeadline';

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

export default function ExperiencesSection() {
  return (
    <section id="experiences" className="py-20 md:py-[120px] bg-[#f6f3ee]">
      <Container>
        <div className="mb-16">
          <SectionLabel dotColor="#A55A42">Experiences</SectionLabel>
          <ExperiencesTypewriterHeadline />
          <p className="mt-5 max-w-2xl font-sans text-body-sm leading-relaxed text-[#888888]">
            When stress leaves your system fragmented, these curated modalities — sound, movement,
            and breath — guide you back to deep restoration.
          </p>
        </div>

        <ColorChangeCards items={EXPERIENCES} />
      </Container>
    </section>
  );
}
