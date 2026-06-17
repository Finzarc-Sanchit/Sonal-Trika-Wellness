/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react';
import {
  registerBackgroundVideo,
  onBackgroundMediaPause,
  onBackgroundMediaResume,
} from '../../utils/backgroundMedia';

const CROSSFADE_SEC = 1.0;

interface SeamlessVideoProps {
  src: string;
  className?: string;
  style?: CSSProperties;
  parallaxY?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

export interface SeamlessVideoHandle {
  getActiveVideo: () => HTMLVideoElement | null;
}

const SeamlessVideo = forwardRef<SeamlessVideoHandle, SeamlessVideoProps>(
  function SeamlessVideo({ src, className = '', style, parallaxY = 0, onTimeUpdate }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const videoARef = useRef<HTMLVideoElement>(null);
    const videoBRef = useRef<HTMLVideoElement>(null);
    const [opacityA, setOpacityA] = useState(1);
    const [opacityB, setOpacityB] = useState(0);
    const activeRef = useRef<'a' | 'b'>('a');
    const crossfadingRef = useRef(false);
    const visibleRef = useRef(true);
    const busPausedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getActiveVideo: () =>
        activeRef.current === 'a' ? videoARef.current : videoBRef.current,
    }));

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting;
          const a = videoARef.current;
          const b = videoBRef.current;
          if (!a || !b) return;

          if (entry.isIntersecting) {
            const active = activeRef.current === 'a' ? a : b;
            if (!busPausedRef.current) {
              active.play().catch(() => {});
            }
          } else {
            a.pause();
            b.pause();
          }
        },
        { threshold: 0.15 },
      );

      observer.observe(root);
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      const a = videoARef.current;
      const b = videoBRef.current;
      if (!a || !b) return;

      const unregisterA = registerBackgroundVideo(a);
      const unregisterB = registerBackgroundVideo(b);

      const pauseBoth = () => {
        busPausedRef.current = true;
        a.pause();
        b.pause();
      };

      const resumeActive = () => {
        busPausedRef.current = false;
        if (visibleRef.current) {
          const active = activeRef.current === 'a' ? a : b;
          active.play().catch(() => {});
        }
      };

      const offPause = onBackgroundMediaPause(pauseBoth);
      const offResume = onBackgroundMediaResume(resumeActive);

      return () => {
        unregisterA();
        unregisterB();
        offPause();
        offResume();
      };
    }, []);

    useEffect(() => {
      const a = videoARef.current;
      const b = videoBRef.current;
      if (!a || !b) return;

      a.load();
      b.load();

      if (visibleRef.current && !busPausedRef.current) {
        a.play().catch(() => {});
      }

      const handleTimeUpdate = (current: HTMLVideoElement, other: HTMLVideoElement, isA: boolean) => {
        if (!current.duration || crossfadingRef.current) return;

        const timeLeft = current.duration - current.currentTime;
        if (timeLeft <= CROSSFADE_SEC) {
          crossfadingRef.current = true;
          other.currentTime = 0;
          if (visibleRef.current && !busPausedRef.current) {
            other.play().catch(() => {});
          }

          const start = performance.now();
          const duration = CROSSFADE_SEC * 1000;

          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            if (isA) {
              setOpacityA(1 - progress);
              setOpacityB(progress);
            } else {
              setOpacityB(1 - progress);
              setOpacityA(progress);
            }

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              current.pause();
              current.currentTime = 0;
              activeRef.current = isA ? 'b' : 'a';
              crossfadingRef.current = false;
            }
          };
          requestAnimationFrame(tick);
        }
      };

      const onTimeA = () => {
        if (activeRef.current === 'a') {
          onTimeUpdate?.(a.currentTime);
          handleTimeUpdate(a, b, true);
        }
      };
      const onTimeB = () => {
        if (activeRef.current === 'b') {
          onTimeUpdate?.(b.currentTime);
          handleTimeUpdate(b, a, false);
        }
      };

      a.addEventListener('timeupdate', onTimeA);
      b.addEventListener('timeupdate', onTimeB);

      return () => {
        a.removeEventListener('timeupdate', onTimeA);
        b.removeEventListener('timeupdate', onTimeB);
      };
    }, [onTimeUpdate]);

    const videoClass =
      'absolute inset-0 w-full h-full object-cover cursor-pointer transition-opacity duration-100';

    const parallaxTransform =
      parallaxY !== 0 ? `translate3d(0, ${parallaxY}px, 0)` : undefined;

    return (
      <div
        ref={rootRef}
        className={`absolute inset-0 overflow-hidden ${className}`}
        style={{ transform: parallaxTransform }}
      >
        <div className="absolute inset-0">
          <video
            ref={videoARef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            className={videoClass}
            style={{ ...style, opacity: opacityA }}
          >
            <source src="/videos/hero-bg.webm" type="video/webm" />
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <video
            ref={videoBRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/videos/hero-poster.jpg"
            className={videoClass}
            style={{ ...style, opacity: opacityB }}
          >
            <source src="/videos/hero-bg.webm" type="video/webm" />
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    );
  },
);

export default SeamlessVideo;
