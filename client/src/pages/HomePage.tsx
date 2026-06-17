/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import NavigationBar from '../components/NavigationBar';
import CinematicHero from '../components/sections/CinematicHero';
import SiteIntroSplash from '../components/sections/SiteIntroSplash';
import ScrollRevealSection from '../components/sections/ScrollRevealSection';
import NervousSystemJourney from '../components/sections/NervousSystemJourney';
import ExperiencesSection from '../components/sections/ExperiencesSection';
import RetreatsSection from '../components/sections/RetreatsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import Footer from '../components/layout/Footer';
import ConnectPanel from '../components/ConnectPanel';
import { NAV_LINKS } from '../data/navigation';
import { openConnectPanel } from '../utils/serviceCta';

const HERO_VIDEO = '/videos/hero.mp4';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [introDone, setIntroDone] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    if (!introDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introDone]);

  const triggerToast = (title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  return (
    <div className="relative bg-[#F8F5F0] min-h-screen w-full text-[#2B2B2B]">
      {!introDone && <SiteIntroSplash onComplete={() => setIntroDone(true)} />}
      <NavigationBar
        links={NAV_LINKS}
        ctaText="Book a Session"
        variant="overlay"
        homeUrl="/"
        onCtaClick={() =>
          openConnectPanel({ service: 'General Inquiry', action: 'Book a Session' })
        }
      />

      <CinematicHero
        videoSrc={HERO_VIDEO}
        hideScrollHint={!introDone}
        onPrimaryCtaClick={() =>
          openConnectPanel({ service: 'General Inquiry', action: 'Begin Your Healing Journey' })
        }
        onSecondaryCtaClick={() => navigate('/services')}
      />

      <ScrollRevealSection />

      <div className="relative rounded-t-[32px] bg-white z-20 overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.06)]">
        <NervousSystemJourney />
        <ExperiencesSection />
        <RetreatsSection />
        <TestimonialsSection />
        <Footer />
      </div>

      <ConnectPanel
        onSubmit={(data) =>
          triggerToast(
            'Message Received',
            `Thank you ${data.name.split(' ')[0]} — we'll reach out to ${data.email} soon.`
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
