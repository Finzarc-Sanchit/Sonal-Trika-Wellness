/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Container from '../ui/Container';
import TrikaLogo from '../ui/TrikaLogo';
import WatchExperienceButton from '../ui/WatchExperienceButton';
import { TRIKA_CONTACT } from '../../data/companyContact';

const TICKER_ITEMS = [
  'Sound Healing',
  'Nervous System Restoration',
  'Corporate Wellness',
  'Luxury Retreats',
  'Sacred Sound',
  'Deep Restoration',
];

const PAGE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL = [
  {
    label: TRIKA_CONTACT.social.instagram.label,
    href: TRIKA_CONTACT.social.instagram.href,
    icon: Instagram,
  },
  {
    label: TRIKA_CONTACT.social.facebook.label,
    href: TRIKA_CONTACT.social.facebook.href,
    icon: 'facebook' as const,
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const cls =
    'font-sans text-caption tracking-tight text-[#F8F5F0]/65 hover:text-[#D8C5A4] transition-colors duration-300';

  return href.startsWith('/') && !href.includes('#') ? (
    <Link to={href} className={cls}>
      {label}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {label}
    </a>
  );
}

function FooterTicker() {
  return (
    <div className="overflow-hidden border-b border-[#F8F5F0]/10">
      <motion.div
        className="flex whitespace-nowrap py-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Number.POSITIVE_INFINITY }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-8 font-sans text-caption font-semibold uppercase tracking-[0.25em] text-[#F8F5F0]/45 md:mx-12"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div>
      <h4 className="mb-5 font-sans text-caption font-semibold uppercase tracking-[0.2em] text-[#D8C5A4]">
        Newsletter
      </h4>
      {submitted ? (
        <p className="font-sans text-caption leading-relaxed tracking-tight text-[#F8F5F0]/75">
          Thank you — you&apos;re on the list.
        </p>
      ) : (
        <>
          <p className="mb-4 font-sans text-caption leading-relaxed tracking-tight text-[#F8F5F0]/50">
            Monthly notes on sound, stillness, and nervous system care.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center">
              <label htmlFor="footer-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Your email"
                className="w-full min-w-0 rounded-full border border-[#F8F5F0]/20 bg-transparent px-4 py-2.5 font-sans text-caption tracking-tight text-[#F8F5F0] placeholder:text-[#F8F5F0]/35 focus:border-[#8C82B6]/50 focus:outline-none focus:ring-2 focus:ring-[#8C82B6]/20 lg:min-w-0 lg:flex-1"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#A55A42] px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-400 hover:bg-[#8e4a35] cursor-pointer border-0 lg:w-auto"
              >
                Subscribe
              </motion.button>
            </div>
            {error ? (
              <p className="font-sans text-[11px] tracking-tight text-[#F2B5A0]">{error}</p>
            ) : null}
          </form>
        </>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1A1A1A] text-[#F8F5F0]">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <img
          src="/images/trika-logo.png"
          alt=""
          className="absolute -right-8 top-1/4 h-48 w-48 opacity-[0.04] md:h-64 md:w-64"
        />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(6rem,18vw,14rem)] leading-none tracking-tight text-[#F8F5F0] opacity-[0.03] select-none"
        >
          Trika
        </span>
      </div>

      <div className="relative z-10 border-b border-[#F8F5F0]/10">
        <FooterTicker />

        <Container className="py-14 md:py-16">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-tight text-transparent"
              style={{ WebkitTextStroke: '1px rgba(216, 197, 164, 0.55)' }}
            >
              <span className="transition-colors duration-500 group-hover:text-[#D8C5A4]/20">
                Let&apos;s Begin Your Journey
              </span>
              <ArrowUpRight className="h-8 w-8 text-[#D8C5A4] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 md:h-10 md:w-10" />
            </Link>
            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <WatchExperienceButton variant="footer" />
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-[#D8C5A4] px-8 py-3.5 font-sans text-caption font-semibold uppercase tracking-[0.18em] text-[#2B2B2B] transition-colors duration-500 hover:bg-[#F2B5A0]"
                >
                  Get In Touch
                </Link>
              </motion.div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 py-14 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-12 lg:gap-x-12">
          <div className="md:col-span-3">
            <TrikaLogo homeUrl="/" variant="light" className="mb-4" />
            <p className="max-w-xs font-sans text-caption leading-relaxed tracking-tight text-[#F8F5F0]/50">
              {TRIKA_CONTACT.company} — guiding you back to inner safety through sacred sound,
              breath, and deep physiological restoration.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-5 font-sans text-caption font-semibold uppercase tracking-[0.2em] text-[#D8C5A4]">
              Pages
            </h4>
            <ul className="flex flex-col gap-3">
              {PAGE_LINKS.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href} label={l.label} />
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 md:col-span-3 md:col-start-6 lg:col-span-4 lg:col-start-6">
            <FooterNewsletter />
          </div>

          <div className="min-w-0 md:col-span-3 md:col-start-10 lg:col-span-3 lg:col-start-10">
            <h4 className="mb-5 font-sans text-caption font-semibold uppercase tracking-[0.2em] text-[#D8C5A4]">
              {TRIKA_CONTACT.company} · Mumbai
            </h4>
            <ul className="mb-8 flex flex-col gap-4">
              <li>
                <a
                  href={TRIKA_CONTACT.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-3 font-sans text-caption tracking-tight text-[#F8F5F0]/70 transition-colors hover:text-[#D8C5A4]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8C82B6]/20">
                    <MapPin className="h-3.5 w-3.5 text-[#8C82B6]" />
                  </span>
                  <span>
                    {TRIKA_CONTACT.address.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${TRIKA_CONTACT.email}`}
                  className="inline-flex items-center gap-3 font-sans text-caption tracking-tight text-[#F8F5F0]/70 transition-colors hover:text-[#D8C5A4]"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8C82B6]/20">
                    <Mail className="h-3.5 w-3.5 text-[#8C82B6]" />
                  </span>
                  {TRIKA_CONTACT.email}
                </a>
              </li>
              {TRIKA_CONTACT.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="inline-flex items-center gap-3 font-sans text-caption tracking-tight text-[#F8F5F0]/70 transition-colors hover:text-[#D8C5A4]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#8C82B6]/20">
                      <Phone className="h-3.5 w-3.5 text-[#8C82B6]" />
                    </span>
                    {phone.value}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex gap-3">
              {SOCIAL.map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8C82B6]/30 bg-[#8C82B6]/25 text-[#D8C5A4] transition-colors duration-400 hover:border-[#A55A42] hover:bg-[#A55A42] hover:text-white"
                >
                  {icon === 'facebook' ? (
                    <FacebookIcon className="h-4 w-4" />
                  ) : (
                    <Instagram className="h-4 w-4" />
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="relative z-10 border-t border-[#F8F5F0]/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="font-sans text-caption tracking-tight text-[#F8F5F0]/45">
            &copy; {new Date().getFullYear()} {TRIKA_CONTACT.company}. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans text-caption tracking-tight text-[#F8F5F0]/45">
            <a href="#" className="transition-colors hover:text-[#D8C5A4]">
              Privacy Policy
            </a>
            <span>/</span>
            <a href="#" className="transition-colors hover:text-[#D8C5A4]">
              Terms &amp; Conditions
            </a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
