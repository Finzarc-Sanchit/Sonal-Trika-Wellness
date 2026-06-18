/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Send, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { RETREAT_LOCATIONS } from '../../data/retreatLocations';
import { retreatService, type RetreatLocation } from '../../api/services/retreatService';

export interface RetreatFormData {
  name: string;
  email: string;
  phone: string;
  retreatDestination: RetreatLocation | '';
  details: string;
}

type RetreatFieldKey = keyof RetreatFormData;

type ValidationErrors = Partial<Record<RetreatFieldKey | 'location', string>>;

type TouchedFields = Partial<Record<RetreatFieldKey, boolean>>;

interface RetreatModalProps {
  initialDestination?: RetreatLocation | '';
  interestSummary?: string;
  onSubmit?: (data: RetreatFormData) => void;
  onSuccess?: () => void;
}

const EMPTY_FORM: RetreatFormData = {
  name: '',
  email: '',
  phone: '',
  retreatDestination: '',
  details: '',
};

function RequiredMark() {
  return <span className="text-rose-500 ml-0.5">*</span>;
}

function parseApiFieldErrors(error: unknown): ValidationErrors {
  if (!axios.isAxiosError(error)) return {};

  const data = error.response?.data as
    | { errors?: Array<{ field?: string; message?: string } | string> }
    | undefined;

  if (!Array.isArray(data?.errors)) return {};

  const mapped: ValidationErrors = {};
  for (const entry of data.errors) {
    if (typeof entry === 'string') continue;
    if (!entry.field || !entry.message) continue;
    const field = entry.field === 'location' ? 'retreatDestination' : entry.field;
    mapped[field as RetreatFieldKey | 'location'] = entry.message;
  }
  return mapped;
}

function fieldBorderClass(hasError: boolean) {
  return hasError
    ? 'border-rose-300 focus:ring-rose-400 focus:border-rose-400'
    : 'border-[#D8C5A4]/40 focus:border-[#A55A42]/50 focus:ring-[#A55A42]/10';
}

export default function RetreatModal({
  initialDestination = '',
  interestSummary,
  onSubmit,
  onSuccess,
}: RetreatModalProps) {
  const [formData, setFormData] = useState<RetreatFormData>({
    ...EMPTY_FORM,
    retreatDestination: initialDestination,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDestination) {
      setFormData((prev) => ({ ...prev, retreatDestination: initialDestination }));
    }
  }, [initialDestination]);

  const trimmed = useMemo(
    () => ({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      retreatDestination: formData.retreatDestination,
      details: formData.details.trim(),
    }),
    [
      formData.details,
      formData.email,
      formData.name,
      formData.phone,
      formData.retreatDestination,
    ],
  );

  const clientValidation = useMemo((): ValidationErrors => {
    const next: ValidationErrors = {};

    if (!trimmed.name) next.name = 'Please enter your name.';
    if (!trimmed.email) next.email = 'Please enter your email.';
    else if (!/^\S+@\S+\.\S+$/.test(trimmed.email))
      next.email = 'Please enter a valid email address.';

    if (!trimmed.phone) next.phone = 'Please enter your phone number.';
    else if (trimmed.phone.replace(/[^\d]/g, '').length < 8)
      next.phone = 'Please enter a valid phone number.';

    if (!trimmed.retreatDestination) {
      next.retreatDestination = 'Please select a retreat destination.';
    }

    if (!trimmed.details) next.details = 'Please share your requirements or questions.';
    else if (trimmed.details.length < 10)
      next.details = 'Please add a little more detail.';

    return next;
  }, [trimmed]);

  const activeErrors = useMemo(
    () => ({ ...clientValidation, ...validationErrors }),
    [clientValidation, validationErrors],
  );

  const isFormValid = useMemo(
    () => Object.keys(clientValidation).length === 0,
    [clientValidation],
  );

  const showError = (field: RetreatFieldKey) =>
    Boolean((touched[field] || submitAttempted) && activeErrors[field]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setFormError(null);
    setValidationErrors({});

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await retreatService.submitRetreatInquiry({
        name: trimmed.name,
        email: trimmed.email,
        phone: trimmed.phone,
        location: trimmed.retreatDestination as RetreatLocation,
        details: trimmed.details,
      });
      onSubmit?.(trimmed);
      setSubmitted(true);
      onSuccess?.();
      window.setTimeout(() => {
        setSubmitted(false);
        setFormData({ ...EMPTY_FORM, retreatDestination: initialDestination || '' });
        setTouched({});
        setSubmitAttempted(false);
      }, 3200);
    } catch (error) {
      const apiErrors = parseApiFieldErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setValidationErrors(apiErrors);
      } else {
        setFormError(
          'Unable to submit your retreat inquiry. Please check your details and try again.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#7A8B6F]/15 flex items-center justify-center mx-auto mb-4">
          <Send className="w-7 h-7 text-[#7A8B6F]" />
        </div>
        <p className="font-display text-xl text-[#2B2B2B]">Thank you</p>
        <p className="font-sans text-sm text-[#7A8B6F] mt-1">
          We&apos;ll be in touch about your retreat shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {interestSummary && (
        <p className="font-sans text-caption text-[#7A8B6F] leading-relaxed">{interestSummary}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="retreat-name"
            className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
          >
            Name
            <RequiredMark />
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60" />
            <input
              id="retreat-name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, name: true }))}
              aria-invalid={showError('name')}
              placeholder="Your full name"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-all ${fieldBorderClass(showError('name'))}`}
            />
          </div>
          {showError('name') && (
            <p className="text-xs text-rose-500 mt-1 font-sans font-medium tracking-wide animate-fade-in">
              {activeErrors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="retreat-email"
            className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
          >
            Email
            <RequiredMark />
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60" />
            <input
              id="retreat-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, email: true }))}
              aria-invalid={showError('email')}
              placeholder="you@email.com"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-all ${fieldBorderClass(showError('email'))}`}
            />
          </div>
          {showError('email') && (
            <p className="text-xs text-rose-500 mt-1 font-sans font-medium tracking-wide animate-fade-in">
              {activeErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="retreat-phone"
            className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
          >
            Phone
            <RequiredMark />
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60" />
            <input
              id="retreat-phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
              aria-invalid={showError('phone')}
              placeholder="+91 00000 00000"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-all ${fieldBorderClass(showError('phone'))}`}
            />
          </div>
          {showError('phone') && (
            <p className="text-xs text-rose-500 mt-1 font-sans font-medium tracking-wide animate-fade-in">
              {activeErrors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="retreat-location"
            className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
          >
            Destination
            <RequiredMark />
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/60 pointer-events-none" />
            <select
              id="retreat-location"
              name="location"
              required
              value={formData.retreatDestination}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  retreatDestination: e.target.value as RetreatLocation,
                })
              }
              onBlur={() => setTouched((p) => ({ ...p, retreatDestination: true }))}
              aria-invalid={showError('retreatDestination')}
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 transition-all cursor-pointer appearance-none ${fieldBorderClass(showError('retreatDestination'))}`}
            >
              <option value="" disabled>
                Choose a destination
              </option>
              {RETREAT_LOCATIONS.map((loc) => (
                <option key={loc.slug} value={loc.slug}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          {showError('retreatDestination') && (
            <p className="text-xs text-rose-500 mt-1 font-sans font-medium tracking-wide animate-fade-in">
              {activeErrors.retreatDestination}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="retreat-details"
            className="font-sans text-xs uppercase tracking-wider text-[#7A8B6F] mb-1.5 block"
          >
            Your message
            <RequiredMark />
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-4 h-4 text-[#A55A42]/60" />
            <textarea
              id="retreat-details"
              name="details"
              required
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, details: true }))}
              aria-invalid={showError('details')}
              placeholder="Share dietary needs, travel questions, or special requests…"
              className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-all resize-none ${fieldBorderClass(showError('details'))}`}
            />
          </div>
          {showError('details') && (
            <p className="text-xs text-rose-500 mt-1 font-sans font-medium tracking-wide animate-fade-in">
              {activeErrors.details}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          {formError && (
            <p role="alert" className="mb-3 font-sans text-caption text-rose-600">
              {formError}
            </p>
          )}

          <motion.button
            type="submit"
            whileHover={!isFormValid || isSubmitting ? undefined : { scale: 1.02 }}
            whileTap={!isFormValid || isSubmitting ? undefined : { scale: 0.98 }}
            disabled={!isFormValid || isSubmitting}
            className={`group relative w-full py-4 rounded-full font-sans font-semibold text-sm text-white overflow-hidden ${
              isSubmitting || !isFormValid
                ? 'opacity-50 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >
            <span className="absolute inset-0 bg-[#A55A42] group-hover:opacity-0 transition-opacity duration-500" />
            <span className="absolute inset-0 bg-gradient-to-r from-[#5B4A8A] via-[#8B5E83] to-[#C17F59] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? 'Submitting inquiry…' : 'Submit Retreat Inquiry'}
              <Send className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      </div>
    </form>
  );
}
