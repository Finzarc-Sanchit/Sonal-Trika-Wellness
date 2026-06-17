/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Award, Globe, Heart, Sparkles } from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ModernCard from '../ui/ModernCard';
import ConcentricArcs from '../ui/ConcentricArcs';
import SectionReveal from '../ui/SectionReveal';

const STATS = [
  { value: '15+', label: 'Years of practice' },
  { value: '500+', label: 'Healing sessions' },
  { value: '12+', label: 'Retreat destinations' },
];

const CERTIFICATIONS = [
  { icon: Sparkles, title: 'Certified Sound Therapist', desc: 'Vibrational healing & nervous system regulation' },
  { icon: Award, title: 'Gong Master', desc: 'Planetary gong immersions & sound bath facilitation' },
  { icon: Heart, title: 'Kundalini Yoga Teacher', desc: 'Energy-based practice & breathwork integration' },
  { icon: Globe, title: 'Corporate Wellness Consultant', desc: 'Executive programs & team alignment' },
];

const METHODOLOGY = [
  { step: '01', title: 'Create Safety', desc: 'Establish a held container where the nervous system can soften.' },
  { step: '02', title: 'Regulate', desc: 'Use sound, breath, and somatic practices to restore physiological calm.' },
  { step: '03', title: 'Restore', desc: 'Allow deep healing to emerge naturally — without forcing change.' },
];

const MILESTONES = [
  { year: '2012', event: 'Began formal training in sound therapy and gong mastery' },
  { year: '2016', event: 'Certified in Kundalini yoga; launched private practice' },
  { year: '2020', event: 'Partnered with corporate teams on executive wellness' },
  { year: '2024', event: 'Expanded international retreat programs' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-[120px] bg-white overflow-hidden">
      <ConcentricArcs
        variant="warm"
        opacity={0.08}
        className="-right-32 top-20 w-[480px] h-[480px]"
      />

      <Container>
        {/* Intro */}
        <SectionReveal>
          <SectionLabel dotColor="#A55A42">About Sonia</SectionLabel>
          <h2 className="font-display text-[40px] md:text-[56px] leading-[1.05] tracking-tight text-[#2B2B2B] max-w-3xl mb-6">
            Bridging ancient vibrational science with modern healing
          </h2>
          <p className="font-sans text-subheading tracking-tight text-[#888888] max-w-2xl mb-16">
            Sonia Razdan guides leaders, seekers, and retreat participants back to
            inner safety — through sound, breath, and deep physiological restoration.
          </p>
        </SectionReveal>

        {/* Bento grid — portrait + bio + stats */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 mb-6">
          <SectionReveal className="md:col-span-5">
            <div className="relative h-full min-h-[420px] rounded-[24px] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D8C5A4] via-[#A55A42]/40 to-[#7A8B6F]/50" />
              <div className="absolute inset-0 bg-[#2B2B2B]/10 group-hover:bg-[#2B2B2B]/0 transition-colors duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <p className="font-display text-2xl md:text-3xl italic leading-snug text-white tracking-tight">
                  &ldquo;True healing happens when the body feels safe enough to let go.&rdquo;
                </p>
                <p className="font-sans text-caption tracking-tight text-white/70 mt-4">
                  — Sonia Razdan
                </p>
              </div>
            </div>
          </SectionReveal>

          <div className="md:col-span-7 flex flex-col gap-5 md:gap-6">
            <SectionReveal delay={0.1}>
              <ModernCard variant="cream" className="flex-1">
                <h3 className="font-sans text-heading-sm font-medium tracking-tight text-[#2B2B2B] mb-4">
                  A modern healer rooted in vibrational science
                </h3>
                <p className="font-sans text-body-sm leading-[1.65] tracking-tight text-[#2B2B2B] mb-4">
                  Sonia&apos;s journey began with personal healing — discovering that
                  sound could regulate the nervous system when movement and talk alone
                  could not. That insight became Trika Yoga &amp; Wellness.
                </p>
                <p className="font-sans text-body-sm leading-[1.65] tracking-tight text-[#888888]">
                  Today she works with corporate leaders under chronic stress, wellness
                  seekers experiencing dysregulation, and retreat participants seeking
                  deep restoration in nature.
                </p>
              </ModernCard>
            </SectionReveal>

            <div className="grid grid-cols-3 gap-4 md:gap-5">
              {STATS.map((stat, i) => (
                <div key={stat.label}>
                <SectionReveal delay={0.15 + i * 0.05}>
                  <ModernCard variant="mint" className="!p-5 md:!p-6 text-center">
                    <p className="font-display text-[28px] md:text-[36px] leading-none tracking-tight text-[#A55A42] mb-2">
                      {stat.value}
                    </p>
                    <p className="font-sans text-caption tracking-tight text-[#888888]">
                      {stat.label}
                    </p>
                  </ModernCard>
                </SectionReveal>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications bento */}
        <SectionReveal>
          <SectionLabel dotColor="#5c2999">Credentials</SectionLabel>
          <h3 className="font-display text-[32px] md:text-[40px] leading-[1.1] tracking-tight text-[#2B2B2B] mb-10">
            Certifications &amp; expertise
          </h3>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 mb-16">
          {CERTIFICATIONS.map((cert, i) => (
            <div key={cert.title}>
            <SectionReveal delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.4 }}
              >
                <ModernCard variant="lavender" className="h-full relative overflow-hidden">
                  <ConcentricArcs
                    variant="violet"
                    opacity={0.08}
                    className="-right-12 -bottom-12 w-[180px] h-[180px]"
                  />
                  <div className="relative z-10 flex gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#5c2999]/10 flex items-center justify-center shrink-0">
                      <cert.icon className="w-5 h-5 text-[#5c2999]" />
                    </div>
                    <div>
                      <h4 className="font-sans text-body-sm font-medium tracking-tight text-[#2B2B2B] mb-2">
                        {cert.title}
                      </h4>
                      <p className="font-sans text-caption tracking-tight text-[#888888]">
                        {cert.desc}
                      </p>
                    </div>
                  </div>
                </ModernCard>
              </motion.div>
            </SectionReveal>
            </div>
          ))}
        </div>

        {/* Methodology */}
        <SectionReveal>
          <SectionLabel dotColor="#7A8B6F">Methodology</SectionLabel>
          <h3 className="font-display text-[32px] md:text-[40px] leading-[1.1] tracking-tight text-[#2B2B2B] mb-10">
            How Sonia works
          </h3>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
          {METHODOLOGY.map((item, i) => (
            <div key={item.step}>
            <SectionReveal delay={i * 0.1}>
              <ModernCard variant="white" elevated className="h-full">
                <span className="font-display text-[40px] leading-none text-[#A55A42]/25 tracking-tight block mb-6">
                  {item.step}
                </span>
                <h4 className="font-sans text-heading-sm font-medium tracking-tight text-[#2B2B2B] mb-3">
                  {item.title}
                </h4>
                <p className="font-sans text-body-sm leading-[1.6] tracking-tight text-[#888888]">
                  {item.desc}
                </p>
              </ModernCard>
            </SectionReveal>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <SectionReveal>
          <ModernCard variant="cream" className="relative overflow-hidden">
            <ConcentricArcs
              variant="warm"
              opacity={0.1}
              className="left-0 bottom-0 w-[300px] h-[300px] -translate-x-1/3 translate-y-1/3"
            />
            <div className="relative z-10">
              <SectionLabel>Journey</SectionLabel>
              <h3 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-tight text-[#2B2B2B] mb-10">
                From personal healing to global retreats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {MILESTONES.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.7 }}
                    className="flex gap-5 items-start border-t border-[#e5e5e5] pt-5"
                  >
                    <span className="font-sans text-caption font-medium text-[#A55A42] tracking-tight shrink-0">
                      {m.year}
                    </span>
                    <span className="font-sans text-body-sm tracking-tight text-[#2B2B2B]">
                      {m.event}
                    </span>
                  </motion.div>
                ))}
              </div>
              <a
                href="#experiences"
                className="inline-flex items-center gap-2 mt-10 font-sans text-body-sm font-medium tracking-tight text-[#2B2B2B] border border-[#2B2B2B] rounded-[24px] px-6 py-3 hover:bg-[#2B2B2B] hover:text-white transition-all duration-500"
              >
                Explore Experiences
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ModernCard>
        </SectionReveal>
      </Container>
    </section>
  );
}
