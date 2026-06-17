/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'cream' | 'white' | 'lavender' | 'mint' | 'dark';
  elevated?: boolean;
}

const SURFACES = {
  cream: 'bg-[#f6f3ee] border-[#e5e5e5]/80',
  white: 'bg-white border-[#e5e5e5]/60',
  lavender: 'bg-[#f6f1fe] border-[#5c2999]/10',
  mint: 'bg-[#ebfef6] border-[#7A8B6F]/15',
  dark: 'bg-[#2B2B2B] border-[#F8F5F0]/10 text-[#F8F5F0]',
};

export default function ModernCard({
  children,
  className = '',
  variant = 'white',
  elevated = false,
}: ModernCardProps) {
  return (
    <div
      className={`
        rounded-[24px] border p-8 md:p-10
        ${SURFACES[variant]}
        ${elevated ? 'shadow-[0_16px_32px_rgba(0,0,0,0.08)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
