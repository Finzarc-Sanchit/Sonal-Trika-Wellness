/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react';
import {
  registerBackgroundVideo,
  onBackgroundMediaPause,
  onBackgroundMediaResume,
} from '../../utils/backgroundMedia';

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
    const videoRef = useRef<HTMLVideoElement>(null);
    const visibleRef = useRef(true);
    const busPausedRef = useRef(false);

    useImperativeHandle(ref, () => ({
      getActiveVideo: () => videoRef.current,
    }));

    // Intersection Observer Control (Saves CPU when out of view)
    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry.isIntersecting;
          const video = videoRef.current;
          if (!video) return;

          if (entry.isIntersecting) {
            if (!busPausedRef.current) {
              video.play().catch(() => { });
            }
          } else {
            video.pause();
          }
        },
        { threshold: 0.15 },
      );

      observer.observe(root);
      return () => observer.disconnect();
    }, []);

    // Global Media Event Bus Subscriptions
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const unregister = registerBackgroundVideo(video);

      const handlePause = () => {
        busPausedRef.current = true;
        video.pause();
      };

      const handleResume = () => {
        busPausedRef.current = false;
        if (visibleRef.current) {
          video.play().catch(() => { });
        }
      };

      const offPause = onBackgroundMediaPause(handlePause);
      const offResume = onBackgroundMediaResume(handleResume);

      return () => {
        unregister();
        offPause();
        offResume();
      };
    }, []);

    // Autoplay & Source Binding Sync Hook
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      // Forces browser to run infinite seamless hardware-accelerated loops
      video.loop = true;

      video.load();

      if (visibleRef.current && !busPausedRef.current) {
        video.play().catch(() => { });
      }
    }, [src]);

    // Optional user time tracking reporting bridge
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !onTimeUpdate) return;

      const handleTimeUpdate = () => {
        onTimeUpdate(video.currentTime);
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }, [onTimeUpdate]);

    const parallaxTransform =
      parallaxY !== 0 ? `translate3d(0, ${parallaxY}px, 0)` : undefined;

    return (
      <div
        ref={rootRef}
        className={`absolute inset-0 overflow-hidden ${className}`}
        style={{ transform: parallaxTransform }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={style}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    );
  },
);

export default SeamlessVideo;