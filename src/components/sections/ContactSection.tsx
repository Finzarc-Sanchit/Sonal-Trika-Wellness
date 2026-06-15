/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
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
import { TRIKA_CONTACT } from '../../data/companyContact';

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

export default function ContactSection({ onSubmit }: ContactSectionProps) {
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '', message: '' });
    }, 3200);
  };

  return (
    <section id="contact" className="py-20 md:py-[120px] bg-white">
      <Container>
        <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
          <SectionLabel dotColor="#A55A42">Contact</SectionLabel>
          <ServiceTypewriterHeadline
            text="Visit Trika Wellness"
            accentWord="Wellness"
            className="justify-center text-center"
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
                        Name
                      </label>
                      <input
                        id="contact-name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8C5A4]/50 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:border-[#8C82B6]/50 focus:ring-2 focus:ring-[#8C82B6]/10"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, email: e.target.value }))
                        }
                        className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8C5A4]/50 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:border-[#8C82B6]/50 focus:ring-2 focus:ring-[#8C82B6]/10"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                    >
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8C5A4]/50 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:border-[#8C82B6]/50 focus:ring-2 focus:ring-[#8C82B6]/10"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8C5A4]/50 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:border-[#8C82B6]/50 focus:ring-2 focus:ring-[#8C82B6]/10 resize-none"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-[#A55A42] text-white font-sans text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-8 py-3.5 hover:bg-[#8C82B6] transition-colors duration-400 cursor-pointer"
                  >
                    Send Message
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
      </Container>
    </section>
  );
}
