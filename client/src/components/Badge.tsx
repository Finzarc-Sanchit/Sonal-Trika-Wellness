/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import * as Icons from 'lucide-react';

interface BadgeProps {
  iconName?: string;
  text: string;
  className?: string;
  onClick?: () => void;
}

export default function Badge({ iconName, text, className = '', onClick }: BadgeProps) {
  // Safe dynamic lucide icon rendering
  const IconComponent = iconName && iconName in Icons 
    ? (Icons as any)[iconName] 
    : Icons.Sparkles;

  const content = (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono tracking-widest text-zinc-300 uppercase glass-effect bg-neutral-900/40 relative group overflow-hidden border border-white/8">
      {/* Light sweep hover effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      
      {iconName && (
        <span className="text-emerald-400 group-hover:animate-pulse">
          <IconComponent className="w-3.5 h-3.5" />
        </span>
      )}
      
      <span>{text}</span>
      
      {/* Tiny active pulse on the edge */}
      <span className="relative flex h-1.5 w-1.5 ml-1">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button 
        id="badge-btn"
        className={`focus:outline-none cursor-pointer ${className}`}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <div id="badge-wrapper" className={className}>
      {content}
    </div>
  );
}
