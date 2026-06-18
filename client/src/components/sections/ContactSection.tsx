/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ServiceTypewriterHeadline from '../ui/ServiceTypewriterHeadline';
import { GradientDots } from '../ui/gradient-dots';
import StardustBackground from '../ui/StardustBackground';
import ContactForm, { type ContactFormData } from '../contact/ContactForm';
import { TRIKA_CONTACT } from '../../data/companyContact';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export type { ContactFormData };

interface ContactSectionProps {
  initialService?: string;
  onSubmit?: (data: ContactFormData) => void;
}

type ToastNotification = {
  id: string;
  title: string;
  message: string;
};

export default function ContactSection({ initialService, onSubmit }: ContactSectionProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const pushToast = (title: string, message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSubmit = (data: ContactFormData) => {
    onSubmit?.(data);
    pushToast(
      'Message received',
      'Thank you for connecting. Your message has been received on your wellness journey.',
    );
  };

  return (
    <section id="contact" className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {!reducedMotion ? (
          <>
            <GradientDots
              backgroundColor="#FFFFFF"
              dotColor="#CBBD93"
              opacity={0.22}
              duration={48}
            />
            <StardustBackground count={32} opacity={0.16} />
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-[#F8F5F0]/50" />
          </>
        ) : (
          <div className="absolute inset-0 bg-white" />
        )}
      </div>

      <Container className="relative z-10">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <SectionLabel dotColor="#A55A42">Contact</SectionLabel>
          <ServiceTypewriterHeadline
            text="Visit Trika Wellness"
            accentWord="Wellness"
            className="text-left"
          />
          <p className="mt-5 font-sans text-body-sm text-[#888888] leading-relaxed">
            Book a session, enquire about corporate programmes, or visit our Mumbai studio.
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12 md:mb-16">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] p-7 md:p-9">
              <h3 className="font-display text-2xl tracking-tight text-[#2B2B2B] mb-2">
                Send a message
              </h3>
              <p className="font-sans text-caption text-[#888888] mb-8">
                Share your details and we&apos;ll respond within 24 hours.
              </p>

              <ContactForm initialService={initialService} onSubmit={handleSubmit} />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] p-7 md:p-8">
              <h3 className="font-display text-2xl tracking-tight text-[#2B2B2B] mb-6">
                {TRIKA_CONTACT.company} Studio
              </h3>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#8C82B6]/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#8C82B6]" />
                  </span>
                  <div>
                    <p className="font-sans text-caption font-semibold uppercase tracking-wider text-[#888888] mb-1">
                      Address
                    </p>
                    {TRIKA_CONTACT.address.lines.map((line) => (
                      <p
                        key={line}
                        className="font-sans text-body-sm text-[#2B2B2B]/85 leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                    <a
                      href={TRIKA_CONTACT.mapDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 font-sans text-caption text-[#A55A42] hover:text-[#8C82B6] transition-colors"
                    >
                      Get directions
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="w-10 h-10 rounded-full bg-[#8C82B6]/15 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#8C82B6]" />
                  </span>
                  <div>
                    <p className="font-sans text-caption font-semibold uppercase tracking-wider text-[#888888] mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${TRIKA_CONTACT.email}`}
                      className="font-sans text-body-sm text-[#2B2B2B]/85 hover:text-[#8C82B6] transition-colors"
                    >
                      {TRIKA_CONTACT.email}
                    </a>
                  </div>
                </div>

                {TRIKA_CONTACT.phones.map((phone) => (
                  <div key={phone.href} className="flex gap-4">
                    <span className="w-10 h-10 rounded-full bg-[#8C82B6]/15 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#8C82B6]" />
                    </span>
                    <div>
                      <p className="font-sans text-caption font-semibold uppercase tracking-wider text-[#888888] mb-1">
                        {phone.label}
                      </p>
                      <a
                        href={phone.href}
                        className="font-sans text-body-sm text-[#2B2B2B]/85 hover:text-[#8C82B6] transition-colors"
                      >
                        {phone.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#D8C5A4]/40">
                <p className="font-sans text-caption font-semibold uppercase tracking-wider text-[#888888] mb-4">
                  Follow {TRIKA_CONTACT.company}
                </p>
                <div className="flex gap-3">
                  <motion.a
                    href={TRIKA_CONTACT.social.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={TRIKA_CONTACT.social.instagram.label}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="w-11 h-11 rounded-full bg-[#8C82B6]/15 border border-[#8C82B6]/25 flex items-center justify-center text-[#8C82B6] hover:bg-[#A55A42] hover:text-white hover:border-[#A55A42] transition-colors duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </motion.a>
                  <motion.a
                    href={TRIKA_CONTACT.social.facebook.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={TRIKA_CONTACT.social.facebook.label}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="w-11 h-11 rounded-full bg-[#8C82B6]/15 border border-[#8C82B6]/25 flex items-center justify-center text-[#8C82B6] hover:bg-[#A55A42] hover:text-white hover:border-[#A55A42] transition-colors duration-300"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#D8C5A4]/50 shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
          <iframe
            title="Trika Wellness studio location — Raheja Classique, Andheri West, Mumbai"
            src={TRIKA_CONTACT.mapEmbedUrl}
            className="w-full h-[320px] md:h-[420px] border-0 grayscale-[20%] contrast-[1.05]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

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
      </Container>
    </section>
  );
}
