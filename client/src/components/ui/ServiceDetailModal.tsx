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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Close"
            className="fixed inset-0 z-[80] cursor-pointer border-0 bg-[#1A1A1A]/75 p-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-detail-title"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-2 top-2 z-[90] flex h-[94vh] max-h-[94vh] flex-col overflow-hidden rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] shadow-2xl md:inset-x-auto md:left-1/2 md:top-4 md:w-[min(920px,calc(100vw-2rem))] md:-translate-x-1/2"
          >
            <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[minmax(240px,38%)_1fr]">
              <div
                className="relative hidden h-full min-h-0 overflow-hidden md:block"
                style={{
                  borderRight: `1px solid ${GOLD}`,
                }}
              >
                <img
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/50 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 right-5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#F8F5F0]/90">
                  {service.category}
                </p>
              </div>

              <div className="flex h-full min-h-0 flex-col overflow-hidden">
                <div className="relative shrink-0 overflow-hidden md:hidden">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="h-36 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F8F5F0] via-transparent to-transparent" />
                </div>

                <div className="grid min-h-0 flex-1 grid-rows-[auto_auto_minmax(0,1fr)_auto] overflow-hidden p-4 md:p-6 lg:p-7">
                  {/* Stationary Header Section */}
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[#888888]">
                        Sound Wellness Therapies
                      </p>
                      <h2
                        id="service-detail-title"
                        className="font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.08] tracking-tight text-[#2B2B2B]"
                      >
                        {service.title}
                      </h2>
                      <p className="mt-0.5 font-sans text-[12px] tracking-[0.04em] text-[#888888] md:hidden">
                        {service.category}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2B2B2B]/5 transition-colors hover:bg-[#2B2B2B]/10"
                    >
                      <X className="h-4 w-4 text-[#2B2B2B]/70" />
                    </button>
                  </div>

                  <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#D8C5A4]/60 bg-white/80 px-2.5 py-1">
                    <Clock className="h-3 w-3 text-[#A55A42]" />
                    <span className="font-sans text-[11px] font-medium tracking-[0.04em] text-[#2B2B2B]">
                      {service.duration}
                    </span>
                  </div>

                  {/* Scrollable body — minmax(0,1fr) row guarantees a hard ceiling above the dock */}
                  <div className="min-h-0 overflow-y-auto pr-1 space-y-5 pb-2 scrollbar-thin">
                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="h-px w-6 bg-[#A55A42]/70" aria-hidden />
                        <h3 className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-[#A55A42]">
                          The practice
                        </h3>
                      </div>
                      <p className="font-sans text-[14px] leading-[1.6] tracking-[0.02em] text-[#2B2B2B]/88">
                        {service.learnMore}
                      </p>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-3">
                        <span className="h-px w-6 bg-[#8C82B6]/70" aria-hidden />
                        <h3 className="font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-[#8C82B6]">
                          What to expect
                        </h3>
                      </div>
                      <ol className="space-y-2.5">
                        {service.sessionDetails.map((detail, i) => (
                          <li
                            key={detail}
                            className="flex gap-4 border-l border-[#D8C5A4]/70 pl-3"
                          >
                            <span className="shrink-0 font-display text-base leading-none text-[#8C82B6]/80">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="font-sans text-[13.5px] leading-[1.55] tracking-[0.02em] text-[#2B2B2B]/82">
                              {detail}
                            </p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Docked CTA footer — fixed grid row, never overlapped */}
                  <div className="flex flex-wrap items-center gap-4 border-t border-[#e5e5e5]/80 bg-[#F8F5F0] pt-4">
                    <button
                      type="button"
                      onClick={handleBook}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-[37px] px-5 py-2.5 font-sans text-xs font-medium tracking-[0.05em] text-white transition-colors duration-400 hover:bg-[#7A8B6F]"
                      style={{ backgroundColor: TERRACOTTA }}
                    >
                      {service.primaryCta}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="cursor-pointer border-b border-[#888888]/40 pb-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888] transition-all hover:border-[#2B2B2B] hover:text-[#2B2B2B]"
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