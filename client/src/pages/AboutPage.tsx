/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/layout/Footer';
import ConnectPanel from '../components/ConnectPanel';
import { NAV_LINKS } from '../data/navigation';
import { openConnectPanel } from '../utils/serviceCta';
import AboutStackCards, { AboutStackCardData } from '../components/sections/AboutStackCards';
import OutcomesSection from '../components/sections/OutcomesSection';
import FounderEditorialSection from '../components/sections/FounderEditorialSection';
import AboutTrikaWellnessSection from '../components/sections/AboutTrikaWellnessSection';
import TypewriterText from '../components/ui/TypewriterText';
import StardustBackground from '../components/ui/StardustBackground';
import { GradientDots } from '../components/ui/gradient-dots';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const STACK_CARDS: AboutStackCardData[] = [
  {
    id: 'sacred-sound',
    label: 'The science of vibration',
    accentColor: '#A55A42',
    body: 'At its core, sound healing uses therapeutic frequencies to restore harmony to both body and mind. It operates on the principle that everything in the universe, including ourselves, exists in a constant state of vibration. When stress or physical ailments throw us out of sync, these targeted acoustic waves gently "re-tune" our system to promote deep, natural healing. Through sustained resonance, the body remembers its original frequency — quieting mental chatter, softening tension, and inviting balance that feels genuinely earned.',
    cta: 'Explore Experiences',
    connectPanel: { service: 'Sound Healing', action: 'Explore Experiences' },
    ctaColor: '#EDE4D4',
    ctaHoverColor: '#A55A42',
    imageSrc: '/images/sound-healing-studio.png',
    imageAlt: 'Sound healing studio with gongs and singing bowls',
  },
  {
    id: 'sacred-sound-ii',
    label: 'Premier sound bath',
    accentColor: '#7A8B6F',
    body: 'During a premier sound bath session, you are invited to rest comfortably as resonant acoustic waves envelop you. Our certified practitioners utilize precision-tuned instruments—including gongs, crystal bowls, and tuning forks—to masterfully transition your brainwaves from acute stress into deep, restorative meditation. This advanced auditory therapy directly stimulates the vagus nerve, reliably shifting your nervous system out of "fight-or-flight" and into profound, lasting relaxation.',
    cta: 'Book a Session',
    connectPanel: { service: 'Sound Healing', action: 'Book a Session' },
    ctaColor: '#E5EBE2',
    ctaHoverColor: '#7A8B6F',
    imageSrc: '/images/about-card-2.png',
    imageAlt: 'Sound bath with singing bowls and gong',
  },
  {
    id: 'sacred-sound-iii',
    label: 'Life-enhancing benefits',
    accentColor: '#8C82B6',
    body: 'Integrating sound healing into your wellness routine yields profound, life-enhancing benefits — including a measurable reduction in anxiety, vastly improved sleep quality, and a sharp elevation in mental clarity. This sophisticated, non-invasive therapy offers a reliable pathway to quiet a chaotic mind, release deep-seated emotional blocks, and provide your body with the restorative break it needs from the relentless noise of modern life.',
    cta: 'Begin Your Journey',
    connectPanel: { service: 'General Inquiry', action: 'Begin Your Journey' },
    ctaColor: '#E8E4F0',
    ctaHoverColor: '#8C82B6',
    imageSrc: '/images/about-card-2.png',
    imageAlt: 'Sound bath with singing bowls and gong',
  },
];

export default function AboutPage() {
  const [toasts, setToasts] = useState<{ id: string; title: string; message: string }[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const triggerToast = (title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF8F0] text-[#2B2B2B]">
      <NavigationBar
        links={NAV_LINKS}
        ctaText="Book a Session"
        variant="solid"
        floating
        homeUrl="/"
        onCtaClick={() =>
          openConnectPanel({ service: 'General Inquiry', action: 'Book a Session' })
        }
      />

      {/* Full-bleed hero + stack spread cards */}
      <section className="relative w-full overflow-hidden pt-28 md:pt-36 pb-4 md:pb-6">
        <GradientDots
          duration={48}
          dotColor="#CBBD93"
          backgroundColor="#FFFFFF"
          opacity={0.28}
        />
        <StardustBackground opacity={0.32} count={40} />

        <div className="relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="w-full px-6 md:px-10 lg:px-14 mb-10 md:mb-14"
          >
            <p className="font-sans text-caption font-medium uppercase tracking-[0.28em] text-[#888888] mb-6 md:mb-8">
              About Sound Healing
            </p>
            <h1 className="w-full overflow-x-auto scrollbar-hide min-h-[1.2em]">
              <TypewriterText
                partOne="Heal Through"
                partTwo="Sacred Sound"
                speed={46}
                delay={350}
                className="font-sans font-semibold uppercase text-[clamp(1.25rem,2.8vw,2.75rem)] leading-none tracking-tight text-[#2B2B2B]"
                gapClassName="mx-[0.4em] md:mx-[0.55em]"
              />
            </h1>
          </motion.div>

          <AboutStackCards cards={STACK_CARDS} />
        </div>
      </section>

      <OutcomesSection />

      <FounderEditorialSection />

      <AboutTrikaWellnessSection />

      <Footer />
      <ConnectPanel
        onSubmit={(data) =>
          triggerToast(
            'Message Received',
            `Thank you ${data.name.split(' ')[0]} — we'll reach out to ${data.email} soon.`,
          )
        }
      />

      <div
        id="toast-notification-dock"
        className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="bg-[#2B2B2B]/95 pointer-events-auto border-l-2 border-[#A55A42] p-4 rounded-xl flex flex-col gap-1 shadow-2xl"
            >
              <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#F8F5F0]">
                {toast.title}
              </h4>
              <p className="font-sans text-xs text-[#D8C5A4] leading-normal">
                {toast.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
