/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import ContactForm, { type ContactFormData } from './ContactForm';

interface ContactBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ContactFormData) => void;
}

export default function ContactBookingModal({
  isOpen,
  onClose,
  onSubmit,
}: ContactBookingModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close booking form"
            className="fixed inset-0 z-[95] cursor-pointer border-0 bg-[#1A1A1A]/75 p-0 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-session-title"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-3 top-[8vh] z-[100] max-h-[84vh] overflow-hidden rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] shadow-2xl md:inset-x-auto md:left-1/2 md:w-[min(560px,calc(100vw-2rem))] md:-translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#A55A42] via-[#7A8B6F] to-[#8C82B6]" />

            <div className="flex max-h-[calc(84vh-4px)] flex-col overflow-y-auto p-6 md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]">
                    Studio booking
                  </p>
                  <h2
                    id="book-session-title"
                    className="font-display text-[clamp(1.5rem,3.5vw,2rem)] leading-tight tracking-tight text-[#2B2B2B]"
                  >
                    Book a Session
                  </h2>
                  <p className="mt-2 font-sans text-caption text-[#888888] leading-relaxed">
                    Choose your service track and share your details — we&apos;ll respond within 24
                    hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2B2B2B]/5 transition-colors hover:bg-[#2B2B2B]/10"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-[#2B2B2B]/70" />
                </button>
              </div>

              <ContactForm
                key="nav-booking-form"
                compact
                idPrefix="nav-booking"
                servicePlaceholder="Select a target studio module or service..."
                onSubmit={onSubmit}
                onSuccess={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
