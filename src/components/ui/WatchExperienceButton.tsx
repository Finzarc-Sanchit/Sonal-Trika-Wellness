/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';
import VideoLightbox from './VideoLightbox';
import { SONIA_FEATURE_VIDEO } from '../../constants/media';

type WatchExperienceButtonVariant = 'footer' | 'pill';

interface WatchExperienceButtonProps {
  variant?: WatchExperienceButtonVariant;
  className?: string;
}

function prefetchExperienceVideo() {
  const url = SONIA_FEATURE_VIDEO;
  const existing = document.querySelector(`link[data-prefetch-video="${url}"]`);
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'video';
  link.href = url;
  link.setAttribute('data-prefetch-video', url);
  document.head.appendChild(link);
}

export default function WatchExperienceButton({
  variant = 'footer',
  className = '',
}: WatchExperienceButtonProps) {
  const [open, setOpen] = useState(false);

  const footerClasses =
    'shrink-0 inline-flex items-center justify-center gap-2 rounded-full border border-[#D8C5A4]/35 px-8 py-3.5 font-sans text-caption font-semibold uppercase tracking-[0.18em] text-[#D8C5A4] hover:bg-[#D8C5A4]/10 transition-colors duration-500';

  const pillClasses =
    'inline-flex items-center gap-2 rounded-[37px] px-[22px] py-3 font-sans text-sm font-medium tracking-[0.05em] text-[#A55A42] border border-[#A55A42]/30 bg-white hover:bg-[#f6f3ee] transition-colors duration-400';

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(true)}
        onMouseEnter={prefetchExperienceVideo}
        onFocus={prefetchExperienceVideo}
        className={`${variant === 'footer' ? footerClasses : pillClasses} ${className}`}
      >
        <Play className="w-4 h-4 fill-current" />
        Watch Experience
      </motion.button>

      <VideoLightbox
        open={open}
        onClose={() => setOpen(false)}
        src={SONIA_FEATURE_VIDEO}
        title="Trika Yoga & Wellness experience video"
      />
    </>
  );
}
