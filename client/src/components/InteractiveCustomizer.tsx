/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Sliders, Type, Play, Upload, Sparkles, 
  HelpCircle, ChevronLeft, ChevronRight, Check, RefreshCw,
  Compass, Heart, Flame, Activity, Shield, Eye
} from 'lucide-react';
import { HeroConfig } from '../types';

interface InteractiveCustomizerProps {
  config: HeroConfig;
  onConfigChange: (newConfig: HeroConfig) => void;
  resetConfig: () => void;
  videoPresets: Array<{ name: string; url: string }>;
}

export default function InteractiveCustomizer({
  config,
  onConfigChange,
  resetConfig,
  videoPresets,
}: InteractiveCustomizerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'video' | 'text' | 'motion'>('video');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof HeroConfig, value: any) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      onConfigChange({
        ...config,
        videoSrc: videoURL,
        videoFileName: file.name,
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const iconOptions = [
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Compass', icon: Compass },
    { name: 'Heart', icon: Heart },
    { name: 'Flame', icon: Flame },
    { name: 'Activity', icon: Activity },
    { name: 'Shield', icon: Shield },
  ];

  const overlayPresets = [
    { name: 'Pure Charcoal', value: 'bg-gradient-to-b from-black/75 via-neutral-900/10 to-black/95' },
    { name: 'Cosmic Violet', value: 'bg-gradient-to-b from-black/75 via-indigo-950/15 to-black/95 bg-[radial-gradient(ellipse_at_bottom,rgba(124,58,237,0.1)_0%,transparent_70%)]' },
    { name: 'Serene Emerald', value: 'bg-gradient-to-b from-black/75 via-emerald-950/10 to-black/95 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.08)_0%,transparent_70%)]' },
    { name: 'Ember Sunset', value: 'bg-gradient-to-b from-black/75 via-amber-950/10 to-black/95 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.08)_0%,transparent_70%)]' },
  ];

  return (
    <>
      {/* Small floating toggle button to reopen if closed */}
      {!isOpen && (
        <motion.button
          id="customizer-open-btn"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-6 z-50 p-4 rounded-full bg-white text-black hover:bg-neutral-100 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] flex items-center gap-2 group cursor-pointer focus:outline-none"
        >
          <Settings className="w-5 h-5 animate-spin-slow group-hover:rotate-45 transition-transform duration-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider hidden sm:inline">Design Workshop</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="customizer-panel-drawer"
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 26, stiffness: 180 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[380px] bg-neutral-950/90 border-l border-white/8 z-50 flex flex-col shadow-2xl backdrop-blur-2xl"
          >
            {/* PANEL HEADER */}
            <div className="p-5 border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-white uppercase tracking-wider">Design Workshop</h2>
                  <p className="font-mono text-[9px] text-zinc-500">HERO BRAND PLAYROOM v1.0</p>
                </div>
              </div>
              
              <button
                id="customizer-close-btn"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full border border-white/5 hover:border-white/15 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-white/5 px-2 bg-neutral-900/30">
              {(['video', 'text', 'motion'] as const).map((tab) => (
                <button
                  id={`tab-btn-${tab}`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-[10px] font-mono uppercase tracking-widest text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'text-white border-white font-bold'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {tab === 'video' && '1. Media'}
                  {tab === 'text' && '2. Copywriter'}
                  {tab === 'motion' && '3. Animation'}
                </button>
              ))}
            </div>

            {/* PANEL CONTENT */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* TAB 1: VIDEO CONFIGURATION */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  {/* Preset Quick Chooser */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      A. Cinematic Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {videoPresets.map((preset) => {
                        const isSelected = config.videoSrc === preset.url;
                        return (
                          <button
                            id={`video-preset-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                            key={preset.name}
                            onClick={() => {
                              onConfigChange({
                                ...config,
                                videoSrc: preset.url,
                                videoFileName: null,
                              });
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 overflow-hidden group ${
                              isSelected
                                ? 'bg-white/10 border-white text-white'
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/8 hover:text-zinc-200'
                            }`}
                          >
                            <span className="font-sans text-xs font-medium truncate w-full flex items-center justify-between">
                              {preset.name}
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                            </span>
                            <span className="font-mono text-[8px] text-zinc-500 truncate w-full group-hover:text-zinc-400">
                              mixkit cdn play
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* CUSTOM VIDEO UPLOADER */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      B. Video File Uploader
                    </label>
                    
                    <div
                      id="drag-drop-uploader-area"
                      onClick={triggerFileInput}
                      className="border border-dashed border-white/15 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer bg-neutral-900/40 hover:bg-emerald-500/5 transition-all duration-300 group"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors animate-pulse" />
                      <p className="font-sans text-xs font-semibold text-zinc-200">
                        {config.videoFileName ? 'Video Selected!' : 'Drag & Drop video here'}
                      </p>
                      <p className="font-mono text-[9px] text-zinc-500 mt-1 max-w-[210px] mx-auto">
                        {config.videoFileName 
                          ? config.videoFileName 
                          : 'Supports MP4, WEBM file types directly'}
                      </p>
                    </div>
                  </div>

                  {/* OVERLAY GRADIENTS */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      C. Cinematic Color Filter
                    </label>
                    <div className="space-y-2">
                      {overlayPresets.map((preset) => {
                        const isSelected = config.overlayGradient === preset.value;
                        return (
                          <button
                            id={`overlay-${preset.name.replace(/\s+/g, '-').toLowerCase()}`}
                            key={preset.name}
                            onClick={() => updateField('overlayGradient', preset.value)}
                            className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-white/10 border-white text-white'
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                            }`}
                          >
                            <span className="font-sans text-xs font-medium">{preset.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] text-zinc-500">Grad filter</span>
                              <div className="w-3.5 h-3.5 rounded-full border border-white/10 bg-gradient-to-r from-zinc-900 to-indigo-500" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COPYWRITER / BRAND TEXTS */}
              {activeTab === 'text' && (
                <div className="space-y-5">
                  
                  {/* Badge Controls */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Badge Icon & Text
                    </label>
                    <div className="flex gap-2">
                      {iconOptions.map((opt) => {
                        const isSelected = config.badgeIcon === opt.name;
                        const Icon = opt.icon;
                        return (
                          <button
                            id={`badge-icon-btn-${opt.name.toLowerCase()}`}
                            key={opt.name}
                            onClick={() => updateField('badgeIcon', opt.name)}
                            title={opt.name}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                    <input
                      id="badge-text-input"
                      type="text"
                      value={config.badgeText}
                      onChange={(e) => updateField('badgeText', e.target.value)}
                      className="w-full text-xs font-sans px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                      placeholder="Badge Label (e.g. IMMERSIVE LAB)"
                    />
                  </div>

                  {/* Headline */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Main Headline
                    </label>
                    <textarea
                      id="headline-textarea"
                      rows={3}
                      value={config.headline}
                      onChange={(e) => updateField('headline', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-none"
                      placeholder="Animate luxury head text..."
                    />
                  </div>

                  {/* Subheadline */}
                  <div className="space-y-1.5 font-sans">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Subheadline
                    </label>
                    <textarea
                      id="subheadline-textarea"
                      rows={3}
                      value={config.subheadline}
                      onChange={(e) => updateField('subheadline', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-none"
                      placeholder="Add continuous body content..."
                    />
                  </div>

                  {/* CTA Text Button inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                        Primary Button
                      </label>
                      <input
                        id="primary-cta-text-input"
                        type="text"
                        value={config.primaryCtaText}
                        onChange={(e) => updateField('primaryCtaText', e.target.value)}
                        className="w-full text-xs px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                        Secondary Button
                      </label>
                      <input
                        id="secondary-cta-text-input"
                        type="text"
                        value={config.secondaryCtaText}
                        onChange={(e) => updateField('secondaryCtaText', e.target.value)}
                        className="w-full text-xs px-2.5 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white"
                      />
                    </div>
                  </div>

                  {/* Floating Search Configuration */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Floating Search Configuration
                    </label>
                    <input
                      id="search-placeholder-input"
                      type="text"
                      value={config.searchPlaceholder}
                      onChange={(e) => updateField('searchPlaceholder', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white mb-2"
                      placeholder="Search bar placeholder text"
                    />
                    <input
                      id="search-hint-input"
                      type="text"
                      value={config.searchHint}
                      onChange={(e) => updateField('searchHint', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-white"
                      placeholder="Search bar hint instruction"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                      Logo Wordmark
                    </label>
                    <input
                      id="logo-text-input"
                      type="text"
                      value={config.logoText}
                      onChange={(e) => updateField('logoText', e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white font-display"
                    />
                  </div>

                </div>
              )}

              {/* TAB 3: ANIMATION, FADE TIMES, PARALLAX */}
              {activeTab === 'motion' && (
                <div className="space-y-6">
                  
                  {/* FADE IN CONFIGURATION */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                      <span className="text-zinc-400">JS Loop Fade In</span>
                      <span className="text-white font-bold">{config.fadeInDuration} ms</span>
                    </div>
                    <input
                      id="fade-in-slider"
                      type="range"
                      min={100}
                      max={2500}
                      step={50}
                      value={config.fadeInDuration}
                      onChange={(e) => updateField('fadeInDuration', parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <p className="font-mono text-[8px] text-zinc-500">
                      Duration to ramp opacity smoothly from 0 to 1 back on playback.
                    </p>
                  </div>

                  {/* FADE OUT CONFIGURATION */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                      <span className="text-zinc-400">JS Loop Fade Out</span>
                      <span className="text-white font-bold">{config.fadeOutDuration} ms</span>
                    </div>
                    <input
                      id="fade-out-slider"
                      type="range"
                      min={0}
                      max={3500}
                      step={50}
                      value={config.fadeOutDuration}
                      onChange={(e) => updateField('fadeOutDuration', parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <p className="font-mono text-[8px] text-zinc-500">
                      Duration of the smooth fade out immediately BEFORE looping starts.
                    </p>
                  </div>

                  {/* PARALLAX SCROLL INTENSITY */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                      <span className="text-zinc-400">Scroll Depth Parallax</span>
                      <span className="text-white font-bold">{Math.round(config.parallaxStrength * 100)}%</span>
                    </div>
                    <input
                      id="parallax-slider"
                      type="range"
                      min={0}
                      max={1.2}
                      step={0.05}
                      value={config.parallaxStrength}
                      onChange={(e) => updateField('parallaxStrength', parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <p className="font-mono text-[8px] text-zinc-500">
                      Adjust background overscroll and relative depth motion on general viewport scrolling.
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500">
                      <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      <span>60 FPS GPU-ACCELERATED</span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* RESET / RESTORE DEFAULT */}
            <div className="p-4 border-t border-white/8 bg-neutral-900/40 flex justify-between gap-3">
              <button
                id="reset-config-btn"
                onClick={resetConfig}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Draft</span>
              </button>

              <button
                id="apply-config-btn"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-wider text-black bg-white hover:bg-neutral-100 transition-all font-bold cursor-pointer"
              >
                Let's Roll
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
