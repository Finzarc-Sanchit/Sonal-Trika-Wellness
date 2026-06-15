/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import type { VideoTestimonial } from '../../data/testimonials';
import VideoTestimonialModal from './VideoTestimonialModal';

interface VideoTestimonialsGridProps {
  videos: VideoTestimonial[];
}

export default function VideoTestimonialsGrid({ videos }: VideoTestimonialsGridProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {videos.map((video, i) => (
          <motion.button
            key={video.id}
            type="button"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.7,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -4 }}
            onClick={() => setActiveVideo(video)}
            className="group text-left cursor-pointer border-0 p-0 bg-transparent w-full"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <img
                src={video.posterSrc}
                alt={video.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-[#F8F5F0]/95 flex items-center justify-center shadow-lg transition-transform duration-400 group-hover:scale-110">
                  <Play
                    className="w-7 h-7 text-[#A55A42] ml-1"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D8C5A4] mb-2">
                  Watch Story
                </p>
                <h3 className="font-display text-xl text-[#F8F5F0] leading-tight mb-1">
                  {video.name}
                </h3>
                <p className="font-sans text-caption text-[#F8F5F0]/70">
                  {video.headline}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <VideoTestimonialModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  );
}
