/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState, useEffect, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Instagram,
  ExternalLink,
} from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ServiceTypewriterHeadline from '../ui/ServiceTypewriterHeadline';
import { GradientDots } from '../ui/gradient-dots';
import StardustBackground from '../ui/StardustBackground';
import { TRIKA_CONTACT } from '../../data/companyContact';
import { createContact } from '../../api/services/contactService';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactSectionProps {
  onSubmit?: (data: ContactFormData) => void;
}

type ContactFieldErrors = Partial<Record<keyof ContactFormData, string>>;
type ContactTouched = Partial<Record<keyof ContactFormData, boolean>>;

type ToastNotification = {
  id: string;
  title: string;
  message: string;
};

export default function ContactSection({ onSubmit }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<ContactTouched>({});
  const [reducedMotion, setReducedMotion] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const trimmed = useMemo(
    () => ({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    }),
    [form.email, form.message, form.name, form.phone],
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const validate = useMemo((): ContactFieldErrors => {
    const next: ContactFieldErrors = {};

    if (!trimmed.name) next.name = 'Please enter your name.';
    if (!trimmed.email) next.email = 'Please enter your email.';
    else if (!/^\S+@\S+\.\S+$/.test(trimmed.email))
      next.email = 'Please enter a valid email address.';

    if (!trimmed.phone) next.phone = 'Please enter your phone number.';
    else if (trimmed.phone.replace(/[^\d]/g, '').length < 8)
      next.phone = 'Please enter a valid phone number.';

    if (!trimmed.message) next.message = 'Please enter a message.';
    else if (trimmed.message.length < 10) next.message = 'Please add a little more detail.';

    return next;
  }, [trimmed.email, trimmed.message, trimmed.name, trimmed.phone]);

  const isFormValid = useMemo(() => Object.keys(validate).length === 0, [validate]);

  const pushToast = (title: string, message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createContact({
        name: trimmed.name,
        email: trimmed.email,
        phone: trimmed.phone,
        message: trimmed.message,
      });
      onSubmit?.(trimmed);
      setSubmitted(true);
      pushToast(
        'Message received',
        'Thank you for connecting. Your message has been received on your wellness journey.',
      );
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', phone: '', message: '' });
        setTouched({});
        setSubmitAttempted(false);
      }, 3200);
    } catch {
      pushToast(
        'Unable to send',
        'We encountered an issue submitting your request. Please check your network connection or try again shortly.',
      );
    }
    setIsSubmitting(false);
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
          {/* Contact form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#D8C5A4]/50 bg-[#F8F5F0] p-7 md:p-9">
              <h3 className="font-display text-2xl tracking-tight text-[#2B2B2B] mb-2">
                Send a message
              </h3>
              <p className="font-sans text-caption text-[#888888] mb-8">
                Share your details and we&apos;ll respond within 24 hours.
              </p>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#7A8B6F]/15 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6 text-[#7A8B6F]" />
                  </div>
                  <p className="font-display text-xl text-[#2B2B2B]">Thank you</p>
                  <p className="font-sans text-caption text-[#888888] mt-1">
                    We&apos;ll be in touch shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                      >
                        Name <span className="text-[#A55A42]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                        aria-invalid={Boolean((touched.name || submitAttempted) && validate.name)}
                        aria-describedby={
                          (touched.name || submitAttempted) && validate.name
                            ? 'contact-name-error'
                            : undefined
                        }
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-colors ${
                          (touched.name || submitAttempted) && validate.name
                            ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                            : 'border-[#D8C5A4]/50 focus:border-[#8C82B6]/50 focus:ring-[#8C82B6]/10'
                        }`}
                        placeholder="Your full name"
                      />
                      {(touched.name || submitAttempted) && validate.name && (
                        <p id="contact-name-error" className="mt-2 font-sans text-caption text-red-500">
                          {validate.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                      >
                        Email <span className="text-[#A55A42]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                        aria-invalid={Boolean((touched.email || submitAttempted) && validate.email)}
                        aria-describedby={
                          (touched.email || submitAttempted) && validate.email
                            ? 'contact-email-error'
                            : undefined
                        }
                        className={`w-full px-4 py-3.5 rounded-xl bg-white border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-colors ${
                          (touched.email || submitAttempted) && validate.email
                            ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                            : 'border-[#D8C5A4]/50 focus:border-[#8C82B6]/50 focus:ring-[#8C82B6]/10'
                        }`}
                        placeholder="you@email.com"
                      />
                      {(touched.email || submitAttempted) && validate.email && (
                        <p id="contact-email-error" className="mt-2 font-sans text-caption text-red-500">
                          {validate.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                    >
                      Phone <span className="text-[#A55A42]">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
                      aria-invalid={Boolean((touched.phone || submitAttempted) && validate.phone)}
                      aria-describedby={
                        (touched.phone || submitAttempted) && validate.phone
                          ? 'contact-phone-error'
                          : undefined
                      }
                      className={`w-full px-4 py-3.5 rounded-xl bg-white border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-colors ${
                        (touched.phone || submitAttempted) && validate.phone
                          ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                          : 'border-[#D8C5A4]/50 focus:border-[#8C82B6]/50 focus:ring-[#8C82B6]/10'
                      }`}
                      placeholder="+91 00000 00000"
                    />
                    {(touched.phone || submitAttempted) && validate.phone && (
                      <p id="contact-phone-error" className="mt-2 font-sans text-caption text-red-500">
                        {validate.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                    >
                      Message <span className="text-[#A55A42]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      onBlur={() => setTouched((p) => ({ ...p, message: true }))}
                      aria-invalid={Boolean((touched.message || submitAttempted) && validate.message)}
                      aria-describedby={
                        (touched.message || submitAttempted) && validate.message
                          ? 'contact-message-error'
                          : undefined
                      }
                      className={`w-full px-4 py-3.5 rounded-xl bg-white border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-colors resize-none ${
                        (touched.message || submitAttempted) && validate.message
                          ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                          : 'border-[#D8C5A4]/50 focus:border-[#8C82B6]/50 focus:ring-[#8C82B6]/10'
                      }`}
                      placeholder="Tell us what you're looking for..."
                    />
                    {(touched.message || submitAttempted) && validate.message && (
                      <p id="contact-message-error" className="mt-2 font-sans text-caption text-red-500">
                        {validate.message}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!isFormValid || isSubmitting}
                    className={`inline-flex items-center gap-2 bg-[#A55A42] text-white font-sans text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-8 py-3.5 transition-colors duration-400 cursor-pointer ${
                      isSubmitting || !isFormValid
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-[#8C82B6]'
                    }`}
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </div>

          {/* Studio details */}
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

        {/* Map */}
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
