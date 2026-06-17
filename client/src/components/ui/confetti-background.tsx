/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  z: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  rotation: number;
  rotationSpeed: number;
  baseSize: number;
  opacity: number;
  shape: 'rectangle' | 'circle' | 'star' | 'diamond';
  color: string;
  floatPhase: number;
  swayAmplitude: number;
  bobAmplitude: number;
  fadeStart: number;
  isFading: boolean;
}

const BRAND_COLORS = [
  'rgba(216, 197, 164, 0.75)',
  'rgba(165, 90, 66, 0.55)',
  'rgba(140, 130, 182, 0.5)',
  'rgba(122, 139, 111, 0.55)',
  'rgba(248, 245, 240, 0.8)',
  'rgba(242, 181, 160, 0.45)',
];

interface ConfettiBackgroundProps {
  className?: string;
  particleCount?: number;
}

export default function ConfettiBackground({
  className = '',
  particleCount = 120,
}: ConfettiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(container);

    const initConfetti = () => {
      confettiRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        confettiRef.current.push({
          x: -canvas.width * 0.2 + Math.random() * canvas.width * 1.4,
          y: -Math.random() * canvas.height * 0.3,
          z: Math.random() * 1500 + 800,
          velocityX: (Math.random() - 0.5) * 0.6,
          velocityY: Math.random() * 0.3 + 0.1,
          velocityZ: -(Math.random() * 0.6 + 0.3),
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04,
          baseSize: Math.random() * 10 + 5,
          opacity: 1,
          shape: ['rectangle', 'circle', 'star', 'diamond'][
            Math.floor(Math.random() * 4)
          ] as ConfettiPiece['shape'],
          color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
          floatPhase: Math.random() * Math.PI * 2,
          swayAmplitude: Math.random() * 0.5 + 0.2,
          bobAmplitude: Math.random() * 0.3 + 0.1,
          fadeStart: 0,
          isFading: false,
        });
      }
    };

    const drawConfetti = (piece: ConfettiPiece) => {
      const perspective = 800;
      const scale = perspective / (perspective + piece.z);
      const projectedX = piece.x + (piece.x - canvas.width / 2) * (1 - scale);
      const projectedY = piece.y + (piece.y - canvas.height / 2) * (1 - scale);

      if (scale <= 0.01 || scale > 2) return;

      const size = piece.baseSize * scale;
      const opacity = Math.min(piece.opacity * scale * 1.5, 1);

      ctx.save();
      ctx.translate(projectedX, projectedY);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = opacity;

      const shadowIntensity = Math.min(scale * 0.3, 0.2);
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
      ctx.shadowBlur = scale * 4;
      ctx.shadowOffsetX = scale * 3;
      ctx.shadowOffsetY = scale * 3;
      ctx.fillStyle = piece.color;

      switch (piece.shape) {
        case 'rectangle': {
          const width = size * 1.5;
          const height = size * 0.8;
          ctx.fillRect(-width / 2, -height / 2, width, height);
          break;
        }
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'star': {
          ctx.beginPath();
          const starSize = size * 0.7;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const sx = Math.cos(angle) * starSize;
            const sy = Math.sin(angle) * starSize;
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);

            const innerAngle = ((i + 0.5) * Math.PI) / 3;
            ctx.lineTo(Math.cos(innerAngle) * starSize * 0.5, Math.sin(innerAngle) * starSize * 0.5);
          }
          ctx.closePath();
          ctx.fill();
          break;
        }
        case 'diamond': {
          ctx.beginPath();
          const diamondSize = size * 0.8;
          ctx.moveTo(0, -diamondSize);
          ctx.lineTo(diamondSize * 0.6, 0);
          ctx.lineTo(0, diamondSize);
          ctx.lineTo(-diamondSize * 0.6, 0);
          ctx.closePath();
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    };

    const updateConfetti = () => {
      confettiRef.current.forEach((piece) => {
        piece.floatPhase += 0.02;

        const swayX = Math.sin(piece.floatPhase) * piece.swayAmplitude * 0.3;
        const bobY = Math.cos(piece.floatPhase * 0.7) * piece.bobAmplitude * 0.2;

        piece.x += piece.velocityX + swayX;
        piece.y += piece.velocityY + bobY;
        piece.z += piece.velocityZ;
        piece.rotation += piece.rotationSpeed;

        const turbulence = Math.max(0, 1 - piece.z / 1500) * 0.08;
        piece.velocityX += (Math.random() - 0.5) * turbulence * 0.5;
        piece.velocityY += (Math.random() - 0.5) * turbulence * 0.5;
        piece.velocityX += (Math.random() - 0.5) * 0.005;
        piece.velocityY += (Math.random() - 0.5) * 0.005;
        piece.velocityX *= 0.999;
        piece.velocityY *= 0.999;
        piece.velocityY += 0.0005;
        piece.velocityZ *= 1.0005;

        if (
          !piece.isFading &&
          (piece.z <= 200 ||
            piece.x < -150 ||
            piece.x > canvas.width + 150 ||
            piece.y > canvas.height + 150)
        ) {
          piece.isFading = true;
          piece.fadeStart = piece.opacity;
        }

        if (piece.isFading) {
          piece.opacity -= 0.02;
        }

        if (piece.opacity <= 0) {
          piece.x = -canvas.width * 0.2 + Math.random() * canvas.width * 1.4;
          piece.y = -Math.random() * canvas.height * 0.3;
          piece.z = Math.random() * 800 + 1200;
          piece.velocityX = (Math.random() - 0.5) * 0.6;
          piece.velocityY = Math.random() * 0.3 + 0.1;
          piece.velocityZ = -(Math.random() * 0.6 + 0.3);
          piece.floatPhase = Math.random() * Math.PI * 2;
          piece.opacity = 1;
          piece.isFading = false;
          piece.fadeStart = 0;
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updateConfetti();
      confettiRef.current.forEach(drawConfetti);
      animationRef.current = requestAnimationFrame(animate);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiRef.current.forEach((piece) => {
        piece.z = 400;
        drawConfetti(piece);
      });
    };

    initConfetti();

    if (reducedMotion) {
      drawStatic();
    } else {
      animate();
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount]);

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 z-0 ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" style={{ background: 'transparent' }} />
    </div>
  );
}
