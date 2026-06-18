/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X } from 'lucide-react';
import type { VideoTestimonial } from '../../data/testimonials';
import {
  pauseAllBackgroundMedia,
  resumeAllBackgroundMedia,
} from '../../utils/backgroundMedia';
import {
  logVideoLoadTime,
  useRenderCount,
  watchDroppedFrames,
} from '../../utils/videoPerfDebug';

interface VideoTestimonialPlayerProps {
  video: VideoTestimonial;
}

const VideoTestimonialPlayer = memo(function VideoTestimonialPlayer({
  video,
}: VideoTestimonialPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadStartRef = useRef(performance.now());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useRenderCount('VideoTestimonialPlayer');

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    loadStartRef.current = performance.now();
    setReady(false);
    setError(false);

    const startPlayback = () => {
      logVideoLoadTime(video.id, loadStartRef.current, 'canplay');
      setReady(true);
      void el.play().catch(() => { });
      watchDroppedFrames(el, video.id);
    };

    const onError = () => setError(true);

    el.addEventListener('canplay', startPlayback, { once: true });
    el.addEventListener('error', onError);

    el.preload = 'auto';
    el.src = video.videoSrc;
    el.load();

    return () => {
      el.removeEventListener('canplay', startPlayback);
      el.removeEventListener('error', onError);
      el.pause();
      el.removeAttribute('src');
      el.load();
    };
  }, [video.id, video.videoSrc]);

  return (
    <div
      className="relative mx-auto w-full bg-black flex items-center justify-center h-full"
    >
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-[#D8C5A4] animate-spin" aria-hidden />
          <span className="sr-only">Loading video</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
          <p className="font-sans text-sm text-[#F8F5F0]/80">
            Unable to load this video. Please try again later.
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        poster={video.posterSrc}
        controls
        playsInline
        className={`w-full h-full object-cover rounded-xl bg-black transition-opacity duration-300 md:rounded-none ${ready ? 'opacity-100' : 'opacity-0'
          }`}
      />
    </div>
  );
});

interface VideoTestimonialModalProps {
  video: VideoTestimonial | null;
  onClose: () => void;
}

function VideoTestimonialModal({ video, onClose }: VideoTestimonialModalProps) {
  useRenderCount('VideoTestimonialModal');

  useEffect(() => {
    if (!video) return;

    pauseAllBackgroundMedia();
    logVideoLoadTime(video.id, performance.now(), 'modal-open');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      resumeAllBackgroundMedia();
    };
  }, [video, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {video && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close video"
            className="fixed inset-0 z-[9998] bg-[#1A1A1A]/92 cursor-pointer border-0 p-0"
            onClick={onClose}
          />

          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label={`Video testimonial from ${video.name}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-[290px] sm:max-w-[320px] md:max-w-[min(400px,92vw)]"
            >
              {/* Mobile Layout Optimization: 
                Reduced width layout (`max-w-[290px]`), combined with an aspect-ratio frame box 
                (`aspect-[3/4]`), forces a clean, narrow vertical card shape fit.
              */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1A1A1A] shadow-2xl border border-[#F8F5F0]/10 aspect-[3/4] md:aspect-auto md:h-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#1A1A1A]/70 hover:bg-[#1A1A1A] flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                <VideoTestimonialPlayer key={video.id} video={video} />

                <div className="hidden md:block p-6 md:p-8 bg-[#F8F5F0]">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#888888] mb-2">
                    Video Testimonial
                  </p>
                  <h3 className="font-display text-2xl tracking-tight text-[#2B2B2B] mb-1">
                    {video.name}
                  </h3>
                  <p className="font-sans text-caption text-[#888888] mb-3">
                    {video.designation}
                  </p>
                  <p className="font-display text-lg italic text-[#2B2B2B]/85 leading-relaxed">
                    {video.headline}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default memo(VideoTestimonialModal);