/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Pause, Play, X } from 'lucide-react';
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

function formatVideoTime(time: number) {
  return `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`;
}

const VideoTestimonialPlayer = memo(function VideoTestimonialPlayer({
  video,
}: VideoTestimonialPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadStartRef = useRef(performance.now());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useRenderCount('VideoTestimonialPlayer');

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    loadStartRef.current = performance.now();
    setReady(false);
    setError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const startPlayback = () => {
      logVideoLoadTime(video.id, loadStartRef.current, 'canplay');
      setReady(true);
      void el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
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

  const togglePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      void el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el) return;
    setCurrentTime(el.currentTime);
  };

  const handleLoadedMetadata = () => {
    const el = videoRef.current;
    if (!el) return;
    setDuration(el.duration || 0);
  };

  return (
    <div className="relative mx-auto flex h-full w-full items-center justify-center bg-black">
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
        controls={false}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`h-full w-full rounded-xl bg-black object-cover transition-opacity duration-300 md:rounded-none ${ready ? 'opacity-100' : 'opacity-0'
          }`}
      />

      {ready && !error && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-4 py-3">
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-[#1A1A1A]/70 text-white transition-colors hover:bg-[#1A1A1A] cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden />
            ) : (
              <Play className="h-4 w-4" aria-hidden />
            )}
          </button>
          <span className="font-sans text-xs tabular-nums text-white/90">
            {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
          </span>
        </div>
      )}
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
              <div className="relative">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close video"
                  className="absolute -top-12 -right-4 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-[#1A1A1A]/80 text-white transition-transform hover:scale-110 hover:bg-[#1A1A1A] md:-top-4 md:-right-12"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>

                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#F8F5F0]/10 bg-[#1A1A1A] shadow-2xl md:aspect-auto md:h-auto">
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