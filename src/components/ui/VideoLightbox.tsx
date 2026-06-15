/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, X } from 'lucide-react';
import {
  pauseAllBackgroundMedia,
  resumeAllBackgroundMedia,
} from '../../utils/backgroundMedia';
import {
  logVideoLoadTime,
  useRenderCount,
  watchDroppedFrames,
} from '../../utils/videoPerfDebug';

interface ExperienceVideoPlayerProps {
  src: string;
  label: string;
}

const ExperienceVideoPlayer = memo(function ExperienceVideoPlayer({
  src,
  label,
}: ExperienceVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadStartRef = useRef(performance.now());
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useRenderCount('ExperienceVideoPlayer');

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    loadStartRef.current = performance.now();
    setReady(false);
    setError(false);

    const startPlayback = () => {
      logVideoLoadTime(label, loadStartRef.current, 'canplay');
      setReady(true);
      void el.play().catch(() => {});
      watchDroppedFrames(el, label);
    };

    const onError = () => setError(true);

    el.addEventListener('canplay', startPlayback, { once: true });
    el.addEventListener('error', onError);

    el.preload = 'auto';
    el.src = src;
    el.load();

    return () => {
      el.removeEventListener('canplay', startPlayback);
      el.removeEventListener('error', onError);
      el.pause();
      el.removeAttribute('src');
      el.load();
    };
  }, [src, label]);

  return (
    <div className="relative bg-black min-h-[200px] flex items-center justify-center">
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="w-8 h-8 text-[#D8C5A4] animate-spin" aria-hidden />
          <span className="sr-only">Loading video</span>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 px-6 text-center">
          <p className="font-sans text-sm text-white/80">
            Unable to load this video. Please try again later.
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        playsInline
        className={`video-player-contain block max-h-[80vh] w-auto max-w-full mx-auto bg-black transition-opacity duration-300 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
});

interface VideoLightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  title?: string;
}

export default function VideoLightbox({
  open,
  onClose,
  src,
  title = 'Experience video',
}: VideoLightboxProps) {
  useRenderCount('VideoLightbox');

  useEffect(() => {
    if (!open) return;

    pauseAllBackgroundMedia();
    logVideoLoadTime(title, performance.now(), 'lightbox-open');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      resumeAllBackgroundMedia();
    };
  }, [open, onClose, title]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-auto relative flex max-h-[92vh] w-full max-w-4xl flex-col items-center"
            >
              <button
                type="button"
                aria-label="Close video"
                onClick={onClose}
                className="absolute -top-12 right-0 md:-right-2 z-20 w-10 h-10 rounded-full bg-[#1A1A1A]/70 flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20 pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-hidden rounded-[20px] md:rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.45)] bg-black w-full">
                <ExperienceVideoPlayer src={src} label={title} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
