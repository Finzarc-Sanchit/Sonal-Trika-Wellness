/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StardustBackground from '../ui/StardustBackground';

interface SiteIntroSplashProps {
  onComplete: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Phase = 'label' | 'headline' | 'exit';

export default function SiteIntroSplash({ onComplete }: SiteIntroSplashProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>('label');
  const [scrollUp, setScrollUp] = useState(false);

  const dismiss = useCallback(() => {
    setPhase('exit');
    setScrollUp(true);
    window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onComplete, 400);
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('headline'), 1000);
    const t2 = window.setTimeout(dismiss, 2800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#F8F5F0]/98 backdrop-blur-sm"
          onClick={dismiss}
          role="dialog"
          aria-label="Welcome to Trika Wellness"
        >
          <StardustBackground opacity={0.38} count={56} />

          <motion.div
            animate={scrollUp ? { y: '-110%', opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="relative z-10 flex h-full items-center justify-center px-8"
          >
            <div className="text-center max-w-3xl w-full">
              <AnimatePresence mode="wait">
                {phase === 'label' && (
                  <motion.p
                    key="label"
                    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="font-sans text-caption uppercase tracking-[0.35em] text-[#888888]"
                  >
                    Trika Wellness
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {(phase === 'headline' || phase === 'exit') && (
                  <motion.h2
                    key="headline"
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.85, ease: EASE }}
                    className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-tight text-[#2B2B2B] italic"
                  >
                    Enter into the Realm of Healing
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
