/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, Mail, Phone, FileText, MapPin } from 'lucide-react';
import {
  CONNECT_PANEL_EVENT,
  type ConnectPanelDetail,
} from '../utils/serviceCta';
import { RETREAT_LOCATIONS } from '../data/retreatLocations';

interface ConnectPanelProps {
  onSubmit?: (data: ConnectFormData) => void;
}

export interface ConnectFormData {
  name: string;
  email: string;
  phone: string;
  details: string;
  retreatDestination?: string;
}

const EMPTY_FORM: ConnectFormData = {
  name: '',
  email: '',
  phone: '',
  details: '',
  retreatDestination: '',
};

export default function ConnectPanel({ onSubmit }: ConnectPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ConnectFormData>(EMPTY_FORM);
  const [showRetreatPicker, setShowRetreatPicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      const { detail } = event as CustomEvent<ConnectPanelDetail>;
      if (!detail) return;

      const durationLine = detail.duration ? ` (${detail.duration})` : '';
      const destinationLine = detail.retreatDestination
        ? ` · Destination: ${detail.retreatDestination}`
        : '';
      setShowRetreatPicker(detail.showRetreatPicker ?? false);
      setForm({
        ...EMPTY_FORM,
        details: `I'm interested in: ${detail.service}${durationLine} — ${detail.action}${destinationLine}`,
        retreatDestination: detail.retreatDestination ?? '',
      });
      setIsOpen(true);
    };

    window.addEventListener(CONNECT_PANEL_EVENT, handler);
    return () => window.removeEventListener(CONNECT_PANEL_EVENT, handler);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowRetreatPicker(false);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      handleClose();
    }, 2200);
  };

  const fields = [
    { key: 'name' as const, label: 'Name', icon: User, type: 'text', placeholder: 'Your full name' },
    { key: 'email' as const, label: 'Email', icon: Mail, type: 'email', placeholder: 'you@email.com' },
    { key: 'phone' as const, label: 'Phone', icon: Phone, type: 'tel', placeholder: '+91 00000 00000' },
  ];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="connect-fab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#A55A42] text-white shadow-2xl shadow-[#A55A42]/30 flex items-center justify-center cursor-pointer group"
            aria-label="Connect with us"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#5B4A8A] to-[#C17F59] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <MessageCircle className="w-6 h-6 relative z-10" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#7A8B6F] border-2 border-[#F8F5F0] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-50 bg-[#2B2B2B]/40 backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
            >
              <div
                className="pointer-events-auto w-full max-w-md max-h-[min(90vh,640px)] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
              <div className="relative bg-[#F8F5F0]/95 backdrop-blur-2xl rounded-3xl border border-[#D8C5A4]/50 shadow-2xl shadow-black/15 overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#A55A42] via-[#7A8B6F] to-[#5B4A8A]" />

                <div className="p-7">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-2xl text-[#2B2B2B] font-medium"
                      >
                        Let's Connect
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="font-sans text-sm text-[#7A8B6F] mt-1"
                      >
                        Share your details — we'll reach out shortly.
                      </motion.p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-9 h-9 rounded-full bg-[#2B2B2B]/5 hover:bg-[#2B2B2B]/10 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-[#2B2B2B]/60" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 12 }}
                          className="w-16 h-16 rounded-full bg-[#7A8B6F]/15 flex items-center justify-center mx-auto mb-4"
                        >
                          <Send className="w-7 h-7 text-[#7A8B6F]" />
                        </motion.div>
                        <p className="font-display text-xl text-[#2B2B2B]">Thank you</p>
                        <p className="font-sans text-sm text-[#7A8B6F] mt-1">We'll be in touch soon.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                      >
                        {fields.map((field, i) => (
                          <motion.div
                            key={field.key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                          >
                            <label className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block">
                              {field.label}
                            </label>
                            <div className="relative">
                              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60" />
                              <input
                                type={field.type}
                                required={field.key !== 'phone'}
                                value={form[field.key]}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                                }
                                placeholder={field.placeholder}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-[#D8C5A4]/40 font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:border-[#A55A42]/50 focus:ring-2 focus:ring-[#A55A42]/10 transition-all"
                              />
                            </div>
                          </motion.div>
                        ))}

                        {showRetreatPicker && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.38 }}
                          >
                            <label
                              className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
                              htmlFor="connect-retreat-select"
                            >
                              Select your retreat
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60 pointer-events-none" />
                              <select
                                id="connect-retreat-select"
                                required
                                value={form.retreatDestination ?? ''}
                                onChange={(e) =>
                                  setForm((prev) => ({
                                    ...prev,
                                    retreatDestination: e.target.value,
                                  }))
                                }
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-[#D8C5A4]/40 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:border-[#A55A42]/50 focus:ring-2 focus:ring-[#A55A42]/10 transition-all cursor-pointer appearance-none"
                              >
                                <option value="" disabled>
                                  Choose a destination
                                </option>
                                {RETREAT_LOCATIONS.map((loc) => (
                                  <option key={loc.slug} value={loc.name}>
                                    {loc.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.44 }}
                        >
                          <label className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block">
                            Details
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-4 top-4 w-4 h-4 text-[#A55A42]/60" />
                            <textarea
                              required
                              rows={3}
                              value={form.details}
                              onChange={(e) =>
                                setForm((prev) => ({ ...prev, details: e.target.value }))
                              }
                              placeholder="Tell us what you're looking for..."
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-[#D8C5A4]/40 font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:border-[#A55A42]/50 focus:ring-2 focus:ring-[#A55A42]/10 transition-all resize-none"
                            />
                          </div>
                        </motion.div>

                        <motion.button
                          type="submit"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.52 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="group relative w-full mt-2 py-4 rounded-full font-sans font-semibold text-sm text-white overflow-hidden cursor-pointer"
                        >
                          <span className="absolute inset-0 bg-[#A55A42] group-hover:opacity-0 transition-opacity duration-500" />
                          <span className="absolute inset-0 bg-gradient-to-r from-[#5B4A8A] via-[#8B5E83] to-[#C17F59] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            Send Message
                            <Send className="w-4 h-4" />
                          </span>
                        </motion.button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
