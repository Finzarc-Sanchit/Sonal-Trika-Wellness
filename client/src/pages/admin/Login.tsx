/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { isAdminAuthenticated, login } from '../../api/auth';

type FieldErrors = {
  email?: string;
  password?: string;
};

type Touched = {
  email?: boolean;
  password?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState<Touched>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect away if token already exists
  useMemo(() => {
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trimmed = useMemo(
    () => ({
      email: email.trim(),
      password: password,
    }),
    [email, password],
  );

  const errors = useMemo((): FieldErrors => {
    const next: FieldErrors = {};

    if (!trimmed.email) next.email = 'Please enter your email address.';
    else if (!EMAIL_PATTERN.test(trimmed.email)) next.email = 'Please enter a valid email address.';

    if (!trimmed.password) next.password = 'Please enter your password.';
    else if (trimmed.password.length < 8) next.password = 'Password must be at least 8 characters.';

    return next;
  }, [trimmed.email, trimmed.password]);

  const isFormValid = useMemo(() => Object.keys(errors).length === 0, [errors]);

  const showEmailError = Boolean((touched.email || submitAttempted) && errors.email);
  const showPasswordError = Boolean((touched.password || submitAttempted) && errors.password);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setErrorMessage(null);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await login(trimmed.email, trimmed.password);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      // Do not surface raw backend details; `login()` already sanitizes via getApiErrorMessage.
      setErrorMessage('Sign in failed. Please double-check your credentials and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2B2B2B] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#8C82B6]/12 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#A55A42]/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-[#D8C5A4]/45 bg-white/85 backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.10)] overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-[#A55A42] via-[#7A8B6F] to-[#5B4A8A]" />
            <div className="p-8 sm:p-9">
              <div className="mb-7">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#888888]">
                  Admin Access
                </p>
                <h1 className="mt-2 font-display text-3xl tracking-tight text-[#2B2B2B]">
                  Sign in
                </h1>
                <p className="mt-2 font-sans text-caption text-[#888888] leading-relaxed">
                  Use your administrator credentials to manage Trika Wellness.
                </p>
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="alert"
                    className="mb-5 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3"
                  >
                    <p className="font-sans text-caption text-red-600">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888888] mb-2 block"
                  >
                    Email <span className="text-[#A55A42]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/55" />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      aria-invalid={showEmailError}
                      aria-describedby={showEmailError ? 'admin-email-error' : undefined}
                      placeholder="admin@trikawellness.com"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-colors ${
                        showEmailError
                          ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                          : 'border-[#D8C5A4]/45 focus:border-[#8C82B6]/55 focus:ring-[#8C82B6]/10'
                      }`}
                    />
                  </div>
                  {showEmailError && (
                    <p id="admin-email-error" className="mt-2 font-sans text-caption text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888888] mb-2 block"
                  >
                    Password <span className="text-[#A55A42]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A55A42]/55" />
                    <input
                      id="admin-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      aria-invalid={showPasswordError}
                      aria-describedby={showPasswordError ? 'admin-password-error' : undefined}
                      placeholder="••••••••"
                      className={`w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white border font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 transition-colors ${
                        showPasswordError
                          ? 'border-red-400/70 focus:border-red-400/70 focus:ring-red-500/10'
                          : 'border-[#D8C5A4]/45 focus:border-[#8C82B6]/55 focus:ring-[#8C82B6]/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPassword((p) => !p);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl hover:bg-[#2B2B2B]/5 transition-colors flex items-center justify-center cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[#2B2B2B]/60" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#2B2B2B]/60" />
                      )}
                    </button>
                  </div>
                  {showPasswordError && (
                    <p id="admin-password-error" className="mt-2 font-sans text-caption text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={isFormValid && !isSubmitting ? { scale: 1.01, y: -1 } : undefined}
                  whileTap={isFormValid && !isSubmitting ? { scale: 0.99 } : undefined}
                  disabled={!isFormValid || isSubmitting}
                  className={`mt-2 inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 border ${
                    !isFormValid || isSubmitting
                      ? 'bg-[#A55A42]/70 text-white/90 cursor-not-allowed border-transparent opacity-75'
                      : 'bg-[#A55A42] text-white hover:bg-[#8C82B6] cursor-pointer border-transparent'
                  }`}
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </motion.button>

                <p className="pt-3 text-center font-sans text-[11px] text-[#888888]">
                  This area is restricted to authorized administrators.
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

