/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuLinkChild {
  label: string;
  url: string;
}

export interface MenuLink {
  label: string;
  url: string;
  children?: MenuLinkChild[];
}

export interface HeroConfig {
  videoSrc: string;
  videoFileName: string | null;
  badgeIcon: string; // Lucide icon name, e.g., "sparkles"
  badgeText: string;
  headline: string;
  subheadline: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  overlayGradient: string; // Gradient class or custom CSS style
  fadeOutDuration: number; // in milliseconds
  fadeInDuration: number;  // in milliseconds
  searchPlaceholder: string;
  searchHint: string;
  logoText: string;
  menuLinks: MenuLink[];
  parallaxStrength: number; // multiplier for movement: 0 (none) to 1 (full)
  themeColor: string; // hex or tailwind core color
}
