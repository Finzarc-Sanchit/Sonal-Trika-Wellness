/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Check } from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import ModernCard from '../ui/ModernCard';
import ConcentricArcs from '../ui/ConcentricArcs';
import SectionReveal from '../ui/SectionReveal';

const PROGRAMS = [
  'Executive Nervous System Reset',
  'Burnout Prevention Workshops',
  'Women Leadership Wellness',
  'Team Alignment Programs',
];

export default function CorporateSection() {
  return (
    <section id="corporate" className="relative py-20 md:py-[120px] bg-[#1A1A1A] overflow-hidden">
      <ConcentricArcs
        variant="warm"
        opacity={0.1}
        className="right-0 top-0 w-[500px] h-[500px] translate-x-1/3"
      />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <SectionReveal>
            <SectionLabel dotColor="#D8C5A4">Corporate Wellness</SectionLabel>
            <span className="font-display text-[80px] md:text-[96px] leading-none tracking-tight text-[#F8F5F0] block mb-6">
              70%
            </span>
            <p className="font-sans text-subheading tracking-tight text-[#F8F5F0]/70 max-w-md">
              of professionals report burnout symptoms — leadership performance
              begins with nervous system recovery.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <ModernCard variant="dark" className="border-[#F8F5F0]/10">
              <h3 className="font-display text-[28px] leading-[1.2] tracking-tight text-[#F8F5F0] mb-8">
                Executive Recovery Programs
              </h3>
              <ul className="space-y-4 mb-10">
                {PROGRAMS.map((program) => (
                  <li key={program} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#5c2999] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    <span className="font-sans text-body-sm tracking-tight text-[#F8F5F0]/85">
                      {program}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-2 bg-[#A55A42] text-white font-sans text-body-sm font-medium tracking-tight rounded-[24px] px-[38px] py-3 hover:bg-[#8e4a35] transition-colors duration-500 cursor-pointer">
                Request Corporate Proposal
                <ArrowRight className="w-4 h-4" />
              </button>
            </ModernCard>
          </SectionReveal>
        </div>
      </Container>
    </section>
  );
}
