/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import StardustBackground from '../ui/StardustBackground';

interface AboutIntroSplashProps {
  onComplete: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

type Phase = 'label' | 'headline' | 'footer' | 'exit';

export default function AboutIntroSplash({ onComplete }: AboutIntroSplashProps) {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>('label');
  const [scrollUp, setScrollUp] = useState(false);

  const dismiss = useCallback(() => {
    setPhase('exit');
    setScrollUp(true);
    window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(onComplete, 600);
    }, 1100);
  }, [onComplete]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase('headline'), 2200);
    const t2 = window.setTimeout(() => setPhase('footer'), 4200);
    const t3 = window.setTimeout(dismiss, 6400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[#F8F5F0]/98 backdrop-blur-sm cursor-pointer"
          onClick={dismiss}
          role="dialog"
          aria-label="Welcome to About"
        >
          <StardustBackground opacity={0.38} count={56} />

          <motion.div
            animate={scrollUp ? { y: '-110%', opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative z-10 flex h-full items-center justify-center px-8"
          >
            <div className="text-center max-w-3xl w-full">
              {/* Layer 1 — Trika Wellness */}
              <AnimatePresence mode="wait">
                {phase === 'label' && (
                  <motion.p
                    key="label"
                    initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -28, filter: 'blur(6px)' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="font-sans text-caption uppercase tracking-[0.35em] text-[#888888]"
                  >
                    Trika Wellness
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Layer 2 — Main headline */}
              <AnimatePresence>
                {(phase === 'headline' || phase === 'footer' || phase === 'exit') && (
                  <motion.h2
                    key="headline"
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 1.1, ease: EASE }}
                    className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] tracking-tight text-[#2B2B2B] italic"
                  >
                    Enter into the Realm of Healing
                  </motion.h2>
                )}
              </AnimatePresence>

              {/* Layer 3 — Divider + CTA */}
              <AnimatePresence>
                {(phase === 'footer' || phase === 'exit') && (
                  <motion.div
                    key="footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.15, ease: EASE }}
                      className="mx-auto mt-10 h-px w-32 origin-center bg-[#A55A42]/50"
                    />
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
                      className="mt-8 font-sans text-caption tracking-[0.2em] text-[#888888] uppercase"
                    >
                      Tap to continue
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
