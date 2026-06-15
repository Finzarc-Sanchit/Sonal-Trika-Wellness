/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

const ENABLED = import.meta.env.DEV;

export function logVideoPerf(label: string, message: string, data?: Record<string, unknown>) {
  if (!ENABLED) return;
  console.log(`[video-perf:${label}] ${message}`, data ?? '');
}

export function logVideoLoadTime(label: string, startMs: number, event: string) {
  if (!ENABLED) return;
  const elapsed = Math.round(performance.now() - startMs);
  console.log(`[video-perf:${label}] ${event} in ${elapsed}ms`);
}

export function useRenderCount(componentName: string) {
  const countRef = useRef(0);
  countRef.current += 1;

  useEffect(() => {
    if (!ENABLED) return;
    console.log(`[video-perf:render] ${componentName} render #${countRef.current}`);
  });
}

export function watchDroppedFrames(video: HTMLVideoElement | null, label: string) {
  if (!ENABLED || !video || typeof video.requestVideoFrameCallback !== 'function') return;

  let lastTime = 0;
  let frameCount = 0;

  const onFrame = (_now: number, metadata: VideoFrameCallbackMetadata) => {
    frameCount += 1;
    if (lastTime > 0) {
      const delta = metadata.mediaTime - lastTime;
      if (delta > 0.05 && frameCount % 30 === 0) {
        console.log(`[video-perf:${label}] frame gap ${(delta * 1000).toFixed(0)}ms`);
      }
    }
    lastTime = metadata.mediaTime;
    if (!video.paused) {
      video.requestVideoFrameCallback(onFrame);
    }
  };

  video.requestVideoFrameCallback(onFrame);
}
