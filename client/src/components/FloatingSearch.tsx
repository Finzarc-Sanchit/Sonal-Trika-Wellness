/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, CornerDownLeft, RefreshCcw } from 'lucide-react';

interface FloatingSearchProps {
  placeholder: string;
  hintText: string;
  onSearchSubmit?: (query: string) => void;
  maxCharacters?: number;
  aiBrandText?: string;
}

export default function FloatingSearch({
  placeholder,
  hintText,
  onSearchSubmit,
  maxCharacters = 60,
  aiBrandText = '✦ AI Grounding Enabled',
}: FloatingSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  const handleClear = () => {
    setQuery('');
  };

  const isLimitReached = query.length >= maxCharacters;

  return (
    <motion.div
      id="floating-search-glow-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-xl mx-auto rounded-2xl p-0.5 transition-all duration-500 relative ${
        isFocused 
          ? 'bg-gradient-to-r from-white/15 via-white/20 to-white/10 shadow-[0_12px_40px_rgba(255,255,255,0.06),0_0_20px_rgba(255,255,255,0.02)]' 
          : 'bg-white/5 border border-white/5'
      }`}
    >
      <form
        id="search-element-form"
        onSubmit={handleSubmit}
        className="glass-effect rounded-[14px] px-4 py-3.5 flex flex-col gap-2.5 bg-neutral-900/60"
      >
        {/* Core Input Line */}
        <div className="flex items-center gap-3">
          <Search className={`w-4 h-4 transition-colors duration-300 ${isFocused ? 'text-white' : 'text-zinc-500'}`} />
          
          <input
            id="floating-search-input"
            type="text"
            value={query}
            maxLength={maxCharacters}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder || 'Search or ask anything...'}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />

          {/* Interactive Character Counter & Clear trigger */}
          <div className="flex items-center gap-2">
            {query.length > 0 && (
              <button
                id="search-clear-btn"
                type="button"
                onClick={handleClear}
                className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Clear input"
              >
                <RefreshCcw className="w-3 h-3" />
              </button>
            )}
            <span 
              id="char-counter"
              className={`font-mono text-[10px] tracking-widest ${
                isLimitReached ? 'text-rose-400 font-bold' : 'text-zinc-600'
              }`}
            >
              {query.length}/{maxCharacters}
            </span>
          </div>

          {/* Submit Action Block */}
          <button
            id="search-submit-btn"
            type="submit"
            disabled={!query.trim()}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
              query.trim()
                ? 'bg-white text-black hover:bg-zinc-100 shadow-md scale-100 cursor-pointer'
                : 'bg-neutral-800 text-neutral-600 scale-95 cursor-not-allowed'
            }`}
          >
            <CornerDownLeft className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dynamic Meta Bar (AI Logo & Subtext) */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2.5 text-[10px] font-mono tracking-wider">
          <div className="flex items-center gap-1 text-emerald-400/80 animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span id="ai-emblem">{aiBrandText}</span>
          </div>
          
          <div id="search-hint" className="text-zinc-500 select-none hidden sm:block">
            {hintText || 'Press Enter to register callback'}
          </div>
        </div>
      </form>
    </motion.div>
  );
}
