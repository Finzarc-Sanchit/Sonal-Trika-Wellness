/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import type { VideoTestimonial } from '../../data/testimonials';
import VideoTestimonialModal from './VideoTestimonialModal';

const CARD_WIDTH = 280;
const CARD_GAP = 24;
const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

interface VideoTestimonialsGridProps {
  videos: VideoTestimonial[];
  centered?: boolean;
  onModalOpenChange?: (open: boolean) => void;
}

function cloudinaryWithWidth(url: string, width: number) {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return `${url.slice(0, idx + marker.length)}w_${width},${url.slice(idx + marker.length)}`;
}

function GridPoster({ video }: { video: VideoTestimonial; }) {
  const srcSet = useMemo(() => {
    if (!video.posterSrc) return undefined;
    const widths = [320, 480, 640, 800];
    return widths.map((w) => `${cloudinaryWithWidth(video.posterSrc!, w)} ${w}w`).join(', ');
  }, [video.posterSrc]);

  return (
    <img
      src={video.posterSrc}
      srcSet={srcSet}
      sizes={`${CARD_WIDTH}px`}
      alt={video.name}
      className="absolute inset-0 w-full h-full object-cover cursor-pointer bg-[#1A1A1A]"
      loading="lazy"
      decoding="async"
    />
  );
}

function preloadModalVideo(video: VideoTestimonial) {
  const linkId = `preload-${video.id}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'preload';
  link.as = 'video';
  link.href = video.videoSrc;
  document.head.appendChild(link);
}

function VideoTestimonialsGrid({
  videos,
  centered = false,
  onModalOpenChange,
}: VideoTestimonialsGridProps) {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Mobile Layout Auto-Rotation Loop (Programmatic Viewport Carousel)
  useEffect(() => {
    if (!scrollContainerRef.current || videos.length <= 1) return;

    const startAutoRotation = () => {
      timeoutRef.current = setInterval(() => {
        const container = scrollContainerRef.current;
        if (!container || isInteractingRef.current || activeVideo) return;

        // Verify if mobile display mode is currently active via fluid container widths
        const isMobileLayout = container.clientWidth < (CARD_WIDTH * 2 + CARD_GAP);
        if (!isMobileLayout) return;

        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        const nextCardOffset = CARD_WIDTH + CARD_GAP;

        // Loop back seamlessly if end of line is reached
        if (currentScroll >= maxScroll - 5) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollTo({ left: currentScroll + nextCardOffset, behavior: 'smooth' });
        }
      }, AUTO_ROTATE_INTERVAL);
    };

    startAutoRotation();

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [videos.length, activeVideo]);

  // Pause loop instantly when user intentionally interacts with touch inputs
  const handleUserTouchStart = useCallback(() => {
    isInteractingRef.current = true;
    if (timeoutRef.current) clearInterval(timeoutRef.current);
  }, []);

  const handleUserTouchEnd = useCallback(() => {
    isInteractingRef.current = false;
  }, []);

  const rowClass = centered
    ? 'w-full overflow-x-auto scrollbar-hide touch-pan-x py-2 -mx-2 px-2 md:mx-0 md:px-0 scroll-smooth'
    : 'w-full overflow-x-auto scrollbar-hide touch-pan-x py-2 scroll-smooth';

  const innerClass = centered
    ? 'flex flex-row flex-nowrap items-stretch mx-auto'
    : 'flex flex-row flex-nowrap items-stretch';

  const cardClass =
    'group shrink-0 text-left cursor-pointer border-0 p-0 bg-transparent relative outline-none select-none';

  return (
    <>
      <div
        ref={scrollContainerRef}
        className={rowClass}
        onTouchStart={handleUserTouchStart}
        onTouchEnd={handleUserTouchEnd}
        onMouseEnter={handleUserTouchStart}
        onMouseLeave={handleUserTouchEnd}
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
              onMouseEnter={() => preloadModalVideo(video)}
              onFocus={() => preloadModalVideo(video)}
              className={cardClass}
              style={{ width: CARD_WIDTH }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1A1A1A] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                <GridPoster video={video} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/95 via-[#1A1A1A]/30 to-transparent pointer-events-none" />

                {/* Play Action Trigger Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-16 h-16 rounded-full bg-[#F8F5F0]/95 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <Play
                      className="w-7 h-7 text-[#A55A42] ml-1"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </span>
                </div>

                {/* Content Alignment Area Container */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none flex flex-col justify-end min-h-[140px]">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D8C5A4] mb-2 block">
                    Watch Story
                  </p>

                  {/* Strict Baseline Lock Layout */}
                  <div className="w-full flex flex-col justify-start h-[76px]">
                    <h3 className="font-display text-xl text-[#F8F5F0] leading-tight mb-1 line-clamp-1 h-[24px] flex items-center">
                      {video.name}
                    </h3>
                    <p className="font-sans text-caption text-[#F8F5F0]/70 line-clamp-2 leading-relaxed h-[44px] overflow-hidden">
                      {video.headline}
                    </p>
                  </div>
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