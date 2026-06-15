/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import type { VideoTestimonial } from '../../data/testimonials';
import VideoTestimonialModal from './VideoTestimonialModal';

const CARD_WIDTH = 280;
const CARD_GAP = 24;

interface VideoTestimonialsGridProps {
  videos: VideoTestimonial[];
  centered?: boolean;
  onModalOpenChange?: (open: boolean) => void;
}

function VideoThumbnail({ video }: { video: VideoTestimonial }) {
  if (video.posterSrc) {
    return (
      <img
        src={video.posterSrc}
        alt={video.name}
        className="w-full h-full object-cover bg-[#1A1A1A]"
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[#F8F5F0]/10 flex items-center justify-center">
        <Play className="w-7 h-7 text-[#D8C5A4]/60 ml-0.5" fill="currentColor" strokeWidth={0} />
      </div>
    </div>
  );
}

function prefetchVideo(url: string) {
  const existing = document.querySelector(`link[data-prefetch-video="${url}"]`);
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'video';
  link.href = url;
  link.setAttribute('data-prefetch-video', url);
  document.head.appendChild(link);
}

function VideoTestimonialsGrid({
  videos,
  centered = false,
  onModalOpenChange,
}: VideoTestimonialsGridProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  const handleClose = useCallback(() => {
    setActiveVideo(null);
    onModalOpenChange?.(false);
  }, [onModalOpenChange]);

  const handleOpen = useCallback(
    (video: VideoTestimonial) => {
      setActiveVideo(video);
      onModalOpenChange?.(true);
    },
    [onModalOpenChange],
  );

  const rowClass = centered
    ? 'w-full overflow-x-auto scrollbar-hide touch-pan-x py-2 -mx-2 px-2 md:mx-0 md:px-0'
    : 'w-full overflow-x-auto scrollbar-hide touch-pan-x py-2';

  const innerClass = centered
    ? 'flex flex-row flex-nowrap items-stretch mx-auto'
    : 'flex flex-row flex-nowrap items-stretch';

  const cardClass =
    'group shrink-0 text-left cursor-pointer border-0 p-0 bg-transparent';

  return (
    <>
      <div
        className={rowClass}
        style={
          centered
            ? {
                maxWidth:
                  videos.length * CARD_WIDTH + (videos.length - 1) * CARD_GAP,
              }
            : undefined
        }
      >
        <div className={innerClass} style={{ gap: CARD_GAP }}>
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
              onClick={() => handleOpen(video)}
              onMouseEnter={() => prefetchVideo(video.videoSrc)}
              onFocus={() => prefetchVideo(video.videoSrc)}
              className={cardClass}
              style={{ width: CARD_WIDTH }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <VideoThumbnail video={video} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-16 h-16 rounded-full bg-[#F8F5F0]/95 flex items-center justify-center shadow-lg">
                    <Play
                      className="w-7 h-7 text-[#A55A42] ml-1"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D8C5A4] mb-2">
                    Watch Story
                  </p>
                  <h3 className="font-display text-xl text-[#F8F5F0] leading-tight mb-1">
                    {video.name}
                  </h3>
                  <p className="font-sans text-caption text-[#F8F5F0]/70 line-clamp-2">
                    {video.headline}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <VideoTestimonialModal video={activeVideo} onClose={handleClose} />
    </>
  );
}

export default memo(VideoTestimonialsGrid);
