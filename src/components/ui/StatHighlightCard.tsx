/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type RefObject } from 'react';
import StatCountUp, { type StatCountUpFormat } from './StatCountUp';

interface StatHighlightCardProps {
  imageSrc: string;
  triggerRef: RefObject<HTMLElement | null>;
  from: number;
  to: number;
  label: string;
  format?: StatCountUpFormat;
  prefix?: string;
}

export default function StatHighlightCard({
  imageSrc,
  triggerRef,
  from,
  to,
  label,
  format = 'number',
  prefix,
}: StatHighlightCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative min-h-[120px] overflow-hidden rounded-xl border p-4 text-center shadow-sm transition-all duration-500 md:min-h-[132px] md:p-5"
      style={{
        borderColor: hovered ? 'rgba(140, 130, 182, 0.5)' : 'rgba(229, 229, 229, 0.9)',
        boxShadow: hovered
          ? '0 16px 40px rgba(43, 43, 43, 0.18)'
          : '0 4px 16px rgba(43, 43, 43, 0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={imageSrc}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out"
        style={{
          transform: hovered ? 'scale(1)' : 'scale(1.14)',
          opacity: hovered ? 0.55 : 0.28,
        }}
      />

      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundColor: hovered ? 'rgba(35, 32, 40, 0.78)' : 'rgba(255, 255, 255, 0.88)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <StatCountUp
          from={from}
          to={to}
          format={format}
          prefix={prefix}
          triggerRef={triggerRef}
          duration={2}
          className={`font-display text-2xl font-bold transition-colors duration-500 md:text-3xl ${
            hovered ? 'text-[#F8F5F0]' : 'text-[#2B2B2B]'
          }`}
        />
        <p
          className={`mt-2 font-sans text-[10px] font-medium uppercase tracking-wider transition-colors duration-500 md:text-xs ${
            hovered ? 'text-[#F8F5F0]/85' : 'text-[#888888]'
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
