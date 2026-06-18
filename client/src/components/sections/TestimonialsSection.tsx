/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquareText, Video } from 'lucide-react';
import Container from '../ui/Container';
import SectionLabel from '../ui/SectionLabel';
import HorizontalTestimonialMarquee from '../ui/HorizontalTestimonialMarquee';
import VideoTestimonialsGrid from '../ui/VideoTestimonialsGrid';
import ServiceTypewriterHeadline from '../ui/ServiceTypewriterHeadline';
import { TESTIMONIALS, VIDEO_TESTIMONIALS } from '../../data/testimonials';

type TestimonialMode = 'written' | 'video';

const toggleClass = (active: boolean) =>
  `inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 cursor-pointer border ${active
    ? 'bg-[#2B2B2B] text-[#F8F5F0] border-[#2B2B2B]'
    : 'bg-white/80 text-[#888888] border-[#D8C5A4]/60 hover:border-[#A55A42]/40'
  }`;

export default function TestimonialsSection() {
  const [mode, setMode] = useState<TestimonialMode>('written');
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section id="testimonials" className="overflow-hidden bg-white py-16 md:py-20">
      <Container>
        <div
          className="overflow-hidden rounded-[28px] border border-[#e5e5e5]/70 bg-[#f6f1fe] px-6 py-8 shadow-[0_12px_48px_rgba(140,130,182,0.08)] md:rounded-[32px] md:px-10 md:py-10 lg:px-12 lg:py-12"
        >
          <div className="max-w-xl">
            <SectionLabel dotColor="#8C82B6">Testimonials</SectionLabel>
            <ServiceTypewriterHeadline
              text="Voices of restoration"
              accentWord="restoration"
              className="text-left"
            />
            <p className="mt-5 font-sans text-body-sm leading-relaxed text-[#888888]">
              Real stories from clients, practitioners, and teams who found their way back to
              balance through Trika&apos;s sound wellness offerings.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setMode('written')}
                className={toggleClass(mode === 'written')}
              >
                <MessageSquareText className="h-3.5 w-3.5" />
                Written Stories
              </button>
              <button
                type="button"
                onClick={() => setMode('video')}
                className={toggleClass(mode === 'video')}
              >
                <Video className="h-3.5 w-3.5" />
                Video Stories
              </button>
            </div>
          </div>

          <div className="mt-8 md:mt-10 min-w-0">
            <AnimatePresence mode="wait">
              {mode === 'written' ? (
                <motion.div
                  key="written"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="-mx-2 md:mx-0"
                >
                  <HorizontalTestimonialMarquee
                    testimonials={TESTIMONIALS}
                    paused={videoModalOpen}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full min-w-0"
                >
                  <VideoTestimonialsGrid
                    videos={VIDEO_TESTIMONIALS}
                    centered
                    onModalOpenChange={setVideoModalOpen}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
