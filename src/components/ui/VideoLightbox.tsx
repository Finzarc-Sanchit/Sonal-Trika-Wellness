/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button
            type="button"
            aria-label="Close video"
            className="absolute inset-0 bg-[#1A1A1A]/88 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-4xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button
              type="button"
              aria-label="Close video"
              onClick={onClose}
              className="absolute -top-12 right-0 md:-right-2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-hidden rounded-[20px] md:rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.45)] bg-black">
              <video
                ref={videoRef}
                src={src}
                controls
                playsInline
                className="w-full aspect-video object-contain bg-black"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
