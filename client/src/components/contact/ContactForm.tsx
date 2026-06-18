/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { CONTACT_SERVICE_OPTIONS, type ContactServiceSlug } from '../../data/contactServices';
import { createContact } from '../../api/services/contactService';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: ContactServiceSlug | '';
  message: string;
}

interface ContactFormProps {
  initialService?: string;
  servicePlaceholder?: string;
  onSubmit?: (data: ContactFormData) => void;
  onSuccess?: () => void;
  compact?: boolean;
  idPrefix?: string;
}

type ContactFieldErrors = Partial<Record<keyof ContactFormData, string>>;
type ContactTouched = Partial<Record<keyof ContactFormData, boolean>>;

const EMPTY_FORM: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
};

function RequiredMark() {
  return <span className="text-rose-500 ml-0.5">*</span>;
}

export default function ContactForm({
  initialService,
  servicePlaceholder = 'Select a service',
  onSubmit,
  onSuccess,
  compact = false,
  idPrefix = 'contact',
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    ...EMPTY_FORM,
    service: initialService || '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<ContactTouched>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, service: initialService as ContactServiceSlug }));
    }
  }, [initialService]);

  const trimmed = useMemo(
    () => ({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      service: formData.service,
      message: formData.message.trim(),
    }),
    [formData.email, formData.message, formData.name, formData.phone, formData.service],
  );

  const validate = useMemo((): ContactFieldErrors => {
    const next: ContactFieldErrors = {};

    if (!trimmed.name) next.name = 'Please enter your name.';
    if (!trimmed.email) next.email = 'Please enter your email.';
    else if (!/^\S+@\S+\.\S+$/.test(trimmed.email))
      next.email = 'Please enter a valid email address.';

    if (!trimmed.phone) next.phone = 'Please enter your phone number.';
    else if (trimmed.phone.replace(/[^\d]/g, '').length < 8)
      next.phone = 'Please enter a valid phone number.';

    if (!trimmed.service) next.service = 'Please select a service.';

    if (!trimmed.message) next.message = 'Please enter a message.';
    else if (trimmed.message.length < 10) next.message = 'Please add a little more detail.';

    return next;
  }, [trimmed.email, trimmed.message, trimmed.name, trimmed.phone, trimmed.service]);

  const isFormValid = useMemo(() => Object.keys(validate).length === 0, [validate]);

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 ${compact ? 'py-3' : 'py-3.5'} rounded-xl bg-white border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
        : 'border-[#D8C5A4]/50 focus:border-[#D8C5A4] focus:ring-[#D8C5A4]/25'
    }`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setErrorMessage(null);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createContact({
        name: trimmed.name,
        email: trimmed.email,
        phone: trimmed.phone,
        service: trimmed.service as ContactServiceSlug,
        message: trimmed.message,
      });
      onSubmit?.(trimmed);
      setSubmitted(true);
      onSuccess?.();
      window.setTimeout(() => {
        setSubmitted(false);
        setFormData({ ...EMPTY_FORM, service: initialService || '' });
        setTouched({});
        setSubmitAttempted(false);
      }, 3200);
    } catch {
      setErrorMessage(
        'We encountered an issue submitting your request. Please check your connection and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={compact ? 'py-10 text-center' : 'py-16 text-center'}
      >
        <div className="w-14 h-14 rounded-full bg-[#7A8B6F]/15 flex items-center justify-center mx-auto mb-4">
          <Send className="w-6 h-6 text-[#7A8B6F]" />
        </div>
        <p className="font-display text-xl text-[#2B2B2B]">Thank you</p>
        <p className="font-sans text-caption text-[#888888] mt-1">We&apos;ll be in touch shortly.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-4' : 'space-y-5'}>
      <div className={`grid grid-cols-1 ${compact ? '' : 'sm:grid-cols-2'} gap-4`}>
        <div>
          <label
            htmlFor={`${idPrefix}-name`}
            className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
          >
            Name
            <RequiredMark />
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            aria-invalid={Boolean((touched.name || submitAttempted) && validate.name)}
            className={fieldClass(Boolean((touched.name || submitAttempted) && validate.name))}
            placeholder="Your full name"
          />
          {(touched.name || submitAttempted) && validate.name && (
            <p className="mt-2 font-sans text-caption text-red-500">{validate.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor={`${idPrefix}-email`}
            className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
          >
            Email
            <RequiredMark />
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            aria-invalid={Boolean((touched.email || submitAttempted) && validate.email)}
            className={fieldClass(Boolean((touched.email || submitAttempted) && validate.email))}
            placeholder="you@email.com"
          />
          {(touched.email || submitAttempted) && validate.email && (
            <p className="mt-2 font-sans text-caption text-red-500">{validate.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
        >
          Phone
          <RequiredMark />
        </label>
        <input
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
          aria-invalid={Boolean((touched.phone || submitAttempted) && validate.phone)}
          className={fieldClass(Boolean((touched.phone || submitAttempted) && validate.phone))}
          placeholder="+91 00000 00000"
        />
        {(touched.phone || submitAttempted) && validate.phone && (
          <p className="mt-2 font-sans text-caption text-red-500">{validate.phone}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-service`}
          className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
        >
          Service
          <RequiredMark />
        </label>
        <select
          id={`${idPrefix}-service`}
          name="service"
          required
          value={formData.service}
          onChange={(e) =>
            setFormData({
              ...formData,
              service: e.target.value as ContactServiceSlug | '',
            })
          }
          onBlur={() => setTouched((p) => ({ ...p, service: true }))}
          aria-invalid={Boolean((touched.service || submitAttempted) && validate.service)}
          className={`${fieldClass(Boolean((touched.service || submitAttempted) && validate.service))} cursor-pointer appearance-none`}
        >
          <option value="" disabled>
            {servicePlaceholder}
          </option>
          {CONTACT_SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(touched.service || submitAttempted) && validate.service && (
          <p className="mt-2 font-sans text-caption text-red-500">{validate.service}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-message`}
          className="font-sans text-caption font-medium uppercase tracking-wider text-[#888888] mb-2 block"
        >
          Message
          <RequiredMark />
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          required
          rows={compact ? 3 : 4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          onBlur={() => setTouched((p) => ({ ...p, message: true }))}
          aria-invalid={Boolean((touched.message || submitAttempted) && validate.message)}
          className={`${fieldClass(Boolean((touched.message || submitAttempted) && validate.message))} resize-none`}
          placeholder="Tell us what you're looking for..."
        />
        {(touched.message || submitAttempted) && validate.message && (
          <p className="mt-2 font-sans text-caption text-red-500">{validate.message}</p>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="font-sans text-caption text-red-600">
          {errorMessage}
        </p>
      )}

      <motion.button
        type="submit"
        whileHover={!isFormValid || isSubmitting ? undefined : { scale: 1.02 }}
        whileTap={!isFormValid || isSubmitting ? undefined : { scale: 0.98 }}
        disabled={!isFormValid || isSubmitting}
        className={`inline-flex items-center gap-2 bg-[#A55A42] text-white font-sans text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-8 py-3.5 transition-colors duration-400 ${
          isSubmitting || !isFormValid
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#8C82B6] cursor-pointer'
        }`}
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
        <Send className="w-4 h-4" />
      </motion.button>
    </form>
  );
}
