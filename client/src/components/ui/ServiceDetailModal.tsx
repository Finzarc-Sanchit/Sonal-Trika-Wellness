/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, ArrowUpRight } from 'lucide-react';
import type { ServiceCard } from '../../data/servicesData';

interface ServiceDetailModalProps {
  service: ServiceCard | null;
  onClose: () => void;
  onEnquire?: (service: ServiceCard) => void;
}

const GOLD = '#D8C5A4';
const TERRACOTTA = '#A55A42';

export default function ServiceDetailModal({
  service,
  onClose,
  onEnquire,
}: ServiceDetailModalProps) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [service, onClose]);

  const handleBook = () => {
    if (!service) return;
    onEnquire?.(service);
  };

  return (
    <AnimatePresence>
      {service && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close"
            className="fixed inset-0 z-[80] cursor-pointer border-0 bg-[#1A1A1A]/75 p-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-detail-title"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-[6vh] z-[90] max-h-[88vh] overflow-hidden rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] shadow-2xl md:inset-x-auto md:left-1/2 md:w-[min(920px,calc(100vw-2rem))] md:-translate-x-1/2"
          >
            <div className="grid max-h-[88vh] grid-cols-1 md:grid-cols-[minmax(240px,38%)_1fr]">
              <div
                className="relative hidden min-h-[280px] overflow-hidden md:block"
                style={{
                  borderRight: `1px solid ${GOLD}`,
                }}
              >
                <img
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#F8F5F0]/90">
                  {service.category}
                </p>
              </div>

              <div className="flex max-h-[88vh] flex-col overflow-y-auto">
                <div className="relative overflow-hidden md:hidden">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-transparent to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8 lg:p-9">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[#888888]">
                        Sound Wellness Therapies
                      </p>
                      <h2
                        id="service-detail-title"
                        className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.08] tracking-tight text-[#2B2B2B]"
                      >
                        {service.title}
                      </h2>
                      <p className="mt-2 font-sans text-[13px] tracking-[0.04em] text-[#888888] md:hidden">
                        {service.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2B2B2B]/5 transition-colors hover:bg-[#2B2B2B]/10"
                    >
                      <X className="h-4 w-4 text-[#2B2B2B]/70" />
                    </button>
                  </div>

                  <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-[#D8C5A4]/60 bg-white/80 px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#A55A42]" />
                    <span className="font-sans text-[12px] font-medium tracking-[0.04em] text-[#2B2B2B]">
                      {service.duration}
                    </span>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#A55A42]/70" aria-hidden />
                        <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#A55A42]">
                          The practice
                        </h3>
                      </div>
                      <p className="font-sans text-[15px] leading-[1.66] tracking-[0.02em] text-[#2B2B2B]/88">
                        {service.learnMore}
                      </p>
                    </div>

                    <div>
                      <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-[#8C82B6]/70" aria-hidden />
                        <h3 className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#8C82B6]">
                          What to expect
                        </h3>
                      </div>
                      <ol className="space-y-4">
                        {service.sessionDetails.map((detail, i) => (
                          <li
                            key={detail}
                            className="flex gap-4 border-l border-[#D8C5A4]/70 pl-4"
                          >
                            <span className="shrink-0 font-display text-lg leading-none text-[#8C82B6]/80">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-sans text-[14px] leading-[1.62] tracking-[0.02em] text-[#2B2B2B]/82">
                              {detail}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#e5e5e5]/80 pt-6">
                    <button
                      type="button"
                      onClick={handleBook}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-[37px] px-6 py-3 font-sans text-sm font-medium tracking-[0.05em] text-white transition-colors duration-400 hover:bg-[#7A8B6F]"
                      style={{ backgroundColor: TERRACOTTA }}
                    >
                      {service.primaryCta}
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer border-b border-[#888888]/40 pb-1 font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-[#888888] transition-all hover:border-[#2B2B2B] hover:text-[#2B2B2B]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
