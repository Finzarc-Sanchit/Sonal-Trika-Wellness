/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Subtle matrix-style rain using Trika brand palette.
 */

import { useEffect, useRef } from 'react';

interface MatrixRainBackgroundProps {
  className?: string;
  opacity?: number;
  variant?: 'dark' | 'light';
}

const CHARS = 'ॐ∿○·♪♫◦◇△▽◎☽☾0123456789';
const COLORS = ['#7A8B6F', '#D8C5A4', '#8C82B6', '#A55A42', '#F2B5A0'];

export default function MatrixRainBackground({
  className = '',
  opacity = 0.35,
  variant = 'dark',
}: MatrixRainBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId = 0;
    let columns: number[] = [];
    let fontSize = 14;
    let columnCount = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = parent.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontSize = Math.max(12, Math.floor(width / 90));
      columnCount = Math.floor(width / fontSize);
      columns = Array.from({ length: columnCount }, () => Math.random() * -40);
    };

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = variant === 'light' ? 'rgba(248, 245, 240, 0.12)' : 'rgba(42, 51, 40, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "Inter", monospace`;

      for (let i = 0; i < columnCount; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = columns[i] * fontSize;

        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.globalAlpha = 0.15 + Math.random() * 0.35;
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          columns[i] = 0;
        } else {
          columns[i]++;
        }
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden
    />
  );
}
