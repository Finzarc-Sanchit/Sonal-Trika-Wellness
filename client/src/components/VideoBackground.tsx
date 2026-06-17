/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  fadeInDuration: number;  // in ms
  fadeOutDuration: number; // in ms
  overlayGradient: string;  // select style or class
  scale?: number;          // e.g. 1.12
  parallaxY?: number;       // parallax offset
}

export default function VideoBackground({
  videoSrc,
  fadeInDuration,
  fadeOutDuration,
  overlayGradient,
  scale = 1.12,
  parallaxY = 0,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Keep a reference to current animation values to avoid React re-renders in RAF
  const animStateRef = useRef({
    state: 'idle', // 'idle' | 'fading-in' | 'playing' | 'fading-out'
    currentOpacity: 0,
    fadeStartTime: 0,
    opacityAtFadeStart: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loading/error states on source change
    setIsLoading(true);
    setErrorMsg(null);

    // Cancel any running animations
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Set initial opacity to 0
    video.style.opacity = '0';
    animStateRef.current = {
      state: 'idle',
      currentOpacity: 0,
      fadeStartTime: 0,
      opacityAtFadeStart: 0,
    };

    video.load();
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isDestroyed = false;

    // Direct Javascript RAF rendering loop for ultra-smooth 60fps opacity adjustments
    const tick = () => {
      if (isDestroyed || !video) return;

      const duration = video.duration;
      const currentTime = video.currentTime;
      const now = performance.now();

      const { state, currentOpacity, fadeStartTime, opacityAtFadeStart } = animStateRef.current;

      // Ensure video duration is ready before running loops
      if (isNaN(duration) || duration <= 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      let nextOpacity = currentOpacity;
      let nextState = state;
      let nextFadeStartTime = fadeStartTime;
      let nextOpacityAtFadeStart = opacityAtFadeStart;

      const fadeOutThreshold = duration - fadeOutDuration / 1000;

      if (state === 'idle') {
        // Start fading in as soon as the video is playing
        if (!video.paused) {
          nextState = 'fading-in';
          nextFadeStartTime = now;
          nextOpacityAtFadeStart = currentOpacity;
        }
      } else if (state === 'fading-in') {
        const elapsed = now - fadeStartTime;
        const progress = Math.min(1, elapsed / fadeInDuration);
        nextOpacity = progress;

        if (progress >= 1) {
          nextState = 'playing';
          nextOpacity = 1;
        }
      } else if (state === 'playing') {
        nextOpacity = 1;

        // Trigger fade out before loop restart
        if (currentTime >= fadeOutThreshold && fadeOutDuration > 0) {
          nextState = 'fading-out';
          nextFadeStartTime = now;
          nextOpacityAtFadeStart = currentOpacity;
        }

        // Catch edge cases where native loop or video ended without triggering RAF threshold
        if (video.ended || currentTime < 0.1 && video.loop) {
          nextState = 'fading-in';
          nextFadeStartTime = now;
          nextOpacityAtFadeStart = 0;
          nextOpacity = 0;
        }
      } else if (state === 'fading-out') {
        const elapsed = now - fadeStartTime;
        const progress = Math.min(1, elapsed / fadeOutDuration);
        nextOpacity = Math.max(0, opacityAtFadeStart * (1 - progress));

        // Programmatic seamless loop restart
        if (progress >= 0.98 || currentTime >= duration - 0.05 || video.ended) {
          video.currentTime = 0;
          // Silence play promise errors (Standard HTML5 video precaution)
          video.play().catch(() => {});
          
          nextState = 'fading-in';
          nextFadeStartTime = now;
          nextOpacityAtFadeStart = 0;
          nextOpacity = 0;
        }
      }

      // Sync and update ref values
      animStateRef.current = {
        state: nextState,
        currentOpacity: nextOpacity,
        fadeStartTime: nextFadeStartTime,
        opacityAtFadeStart: nextOpacityAtFadeStart,
      };

      // Direct DOM manipulation to avoid React rendering cycles (layout thrashing)
      video.style.opacity = nextOpacity.toFixed(4);

      rafRef.current = requestAnimationFrame(tick);
    };

    const handlePlay = () => {
      if (animStateRef.current.state === 'idle') {
        animStateRef.current.state = 'fading-in';
        animStateRef.current.fadeStartTime = performance.now();
        animStateRef.current.opacityAtFadeStart = 0;
      }
      setIsLoading(false);
      
      // Cancel existing to prevent duplicate loops
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleLoadedMetadata = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setErrorMsg('Could not play video. Please check format or try another uploaded video file.');
      setIsLoading(false);
    };

    video.addEventListener('playing', handlePlay);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    // Initial check (in case video is cached or loaded immediately)
    if (video.readyState >= 1) {
      setIsLoading(false);
    }

    return () => {
      isDestroyed = true;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (video) {
        video.removeEventListener('playing', handlePlay);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('error', handleError);
      }
    };
  }, [videoSrc, fadeInDuration, fadeOutDuration]);

  return (
    <div
      ref={containerRef}
      id="video-bg-container"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-neutral-950"
      style={{
        transform: `translate3d(0, ${parallaxY}px, 0)`,
        willChange: 'transform',
      }}
    >
      {/* Video layer with custom scaling, 3D translation for GPU-acceleration */}
      <video
        ref={videoRef}
        id="hero-video-player"
        src={videoSrc}
        autoPlay
        muted
        playsInline
        className="absolute w-full h-full object-cover object-center translate-z-0"
        style={{
          transform: `scale(${scale}) translate3d(0, 0, 0)`,
          willChange: 'opacity, transform',
          transformOrigin: 'center center',
          opacity: 0,
        }}
      />

      {/* Layered Cinematic Overlays for premium legibility & dark shadows */}
      {/* 1. Backdrop Vignette overlay */}
      <div
        id="vignette-overlay"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_20%,rgba(3,3,3,0.85)_100%)] mix-blend-multiply pointer-events-none"
      />

      {/* 2. Adjustable Custom Gradient overlay */}
      <div
        id="gradient-overlay"
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ${overlayGradient}`}
      />

      {/* Loading state indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-zinc-500 border-t-zinc-100 rounded-full animate-spin" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest animate-pulse">
              Buffering Cinematic Loop...
            </span>
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div className="absolute inset-x-0 top-20 flex items-center justify-center z-10 px-4">
          <div className="glass-effect p-4 rounded-xl text-center max-w-sm border-red-900/30">
            <p className="font-sans text-sm text-red-400 font-medium">{errorMsg}</p>
            <p className="font-mono text-[10px] text-zinc-500 mt-1 uppercase">
              Use Customizer to upload alternative MP4
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
