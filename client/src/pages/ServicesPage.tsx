/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/layout/Footer';
import ConnectPanel from '../components/ConnectPanel';
import ServicesHero from '../components/sections/ServicesHero';
import ServicesSection from '../components/sections/ServicesSection';
import ServiceDetailModal from '../components/ui/ServiceDetailModal';
import {
  handleServicePrimaryCta,
  handleServiceSecondaryCta,
} from '../utils/serviceCta';
import { NAV_LINKS } from '../data/navigation';
import type { ServiceCard } from '../data/servicesData';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
}

export default function ServicesPage() {
  const { hash } = useLocation();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [detailService, setDetailService] = useState<ServiceCard | null>(null);

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const triggerToast = (title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleLearnMore = useCallback((item: ServiceCard) => {
    setDetailService(item);
  }, []);

  const handleSecondaryCta = useCallback(
    (item: ServiceCard) => handleServiceSecondaryCta(item, handleLearnMore),
    [handleLearnMore],
  );

  return (
    <div className="relative bg-[#F8F5F0] min-h-screen w-full text-[#2B2B2B]">
      <NavigationBar
        links={NAV_LINKS}
        ctaText="Book a Session"
        variant="overlay"
        homeUrl="/"
        onCtaClick={() =>
          window.dispatchEvent(
            new CustomEvent('trika:open-connect-panel', {
              detail: { service: 'General Inquiry', action: 'Book a Session' },
            }),
          )
        }
      />

      <ServicesHero />

      <div className="relative rounded-t-[32px] bg-white z-20 overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.08)] -mt-8">
        <ServicesSection
          onPrimaryCta={handleServicePrimaryCta}
          onSecondaryCta={handleSecondaryCta}
          onLearnMore={handleLearnMore}
        />
        <Footer />
      </div>

      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
      />

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
