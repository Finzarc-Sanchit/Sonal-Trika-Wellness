/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

const ACCENT = '#8C82B6';
const TERRACOTTA = '#A55A42';
const MUTED = '#666666';

interface FloatingPillarCardProps {
  title: string;
  body: string;
  className?: string;
  floatOffset?: string;
}

export default function FloatingPillarCard({
  title,
  body,
  className = '',
  floatOffset = '0px',
}: FloatingPillarCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className={`trika-pillar-card min-w-0 w-full rounded-[10px] border p-4 shadow-md backdrop-blur-sm transition-all duration-400 md:p-5 ${className}`}
      style={{
        marginLeft: floatOffset,
        backgroundColor: hovered ? 'rgba(140, 130, 182, 0.12)' : 'rgba(255, 255, 255, 0.85)',
        borderColor: hovered ? ACCENT : 'rgba(229, 229, 229, 0.9)',
        transform: hovered ? 'scale(1.02) translateY(-2px)' : 'scale(1)',
        boxShadow: hovered
          ? '0 12px 28px rgba(140, 130, 182, 0.18)'
          : '0 4px 16px rgba(43, 43, 43, 0.06)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h4
        className="font-display mb-1.5 text-[0.9375rem] font-medium leading-snug break-words text-balance sm:text-[1rem] md:text-[1.1rem]"
        style={{ color: hovered ? TERRACOTTA : ACCENT }}
      >
        {title}
      </h4>
      <p
        className="font-sans text-xs leading-[1.55] tracking-[0.03em] break-words sm:text-[13px]"
        style={{ color: MUTED }}
      >
        {body}
      </p>
    </li>
  );
}
