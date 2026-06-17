/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type RefObject } from 'react';

/** Samples video brightness behind the hero text region. 0 = dark, 1 = light. */
export function useVideoLuminance(videoRef: RefObject<HTMLVideoElement | null>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [luminance, setLuminance] = useState(0.25);
  const smoothed = useRef(0.25);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0;

    const sample = () => {
      if (video.readyState >= 2 && !video.paused) {
        const w = 64;
        const h = 36;
        canvas.width = w;
        canvas.height = h;

        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (vw && vh) {
          // Sample left-center region where hero text sits
          const sx = vw * 0.02;
          const sy = vh * 0.28;
          const sw = vw * 0.55;
          const sh = vh * 0.45;

          ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
          const { data } = ctx.getImageData(0, 0, w, h);

          let total = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            total += 0.299 * r + 0.587 * g + 0.114 * b;
          }
          const avg = total / (data.length / 4) / 255;

          // Smooth transitions — gradual colour shift
          smoothed.current += (avg - smoothed.current) * 0.06;
          setLuminance(smoothed.current);
        }
      }
      raf = requestAnimationFrame(sample);
    };

    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, [videoRef]);

  return luminance;
}

/** Interpolate text colour: dark text on light video, light text on dark video */
export function luminanceToTextColor(luminance: number): string {
  const t = Math.min(1, Math.max(0, (luminance - 0.35) / 0.35));
  const r = Math.round(255 + (43 - 255) * t);
  const g = Math.round(255 + (43 - 255) * t);
  const b = Math.round(255 + (43 - 255) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function luminanceToShadow(luminance: number): string {
  const t = Math.min(1, Math.max(0, (luminance - 0.35) / 0.35));
  if (t > 0.5) {
    return '0 2px 16px rgba(255,255,255,0.4), 0 1px 4px rgba(0,0,0,0.15)';
  }
  return '0 2px 20px rgba(0,0,0,0.7), 0 4px 32px rgba(0,0,0,0.45)';
}
