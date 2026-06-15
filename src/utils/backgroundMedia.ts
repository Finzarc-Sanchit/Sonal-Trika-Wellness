/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const PAUSE_EVENT = 'trika:background-media-pause';
const RESUME_EVENT = 'trika:background-media-resume';

const registeredVideos = new Set<HTMLVideoElement>();
let pauseDepth = 0;

export function registerBackgroundVideo(el: HTMLVideoElement) {
  registeredVideos.add(el);
  return () => registeredVideos.delete(el);
}

export function pauseAllBackgroundMedia() {
  pauseDepth += 1;
  if (pauseDepth > 1) return;

  registeredVideos.forEach((video) => {
    if (!video.paused) {
      video.pause();
    }
  });

  window.dispatchEvent(new CustomEvent(PAUSE_EVENT));
}

export function resumeAllBackgroundMedia() {
  if (pauseDepth === 0) return;
  pauseDepth -= 1;
  if (pauseDepth > 0) return;

  window.dispatchEvent(new CustomEvent(RESUME_EVENT));
}

export function onBackgroundMediaPause(callback: () => void) {
  window.addEventListener(PAUSE_EVENT, callback);
  return () => window.removeEventListener(PAUSE_EVENT, callback);
}

export function onBackgroundMediaResume(callback: () => void) {
  window.addEventListener(RESUME_EVENT, callback);
  return () => window.removeEventListener(RESUME_EVENT, callback);
}
