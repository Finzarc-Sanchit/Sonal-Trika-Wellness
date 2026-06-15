/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ConnectPanelDetail } from '../utils/serviceCta';

export interface ModernWorldProblemLink {
  label: string;
  connect: ConnectPanelDetail;
}

export interface ModernWorldProblemCard {
  id: string;
  title: string;
  titleColor: string;
  headline: string;
  problem: string;
  impact: string;
  image: string;
  imageAlt: string;
  link?: ModernWorldProblemLink;
}

export const SECTION_LABEL = 'The Nervous System';
export const OVERLAPPING_LABEL = 'MODERN WORLD';

export const MODERN_WORLD_HEADING_LINES: { text: string; accent?: boolean }[][] = [
  [{ text: 'What modern world' }],
  [{ text: 'faces', accent: true }],
];

export const MODERN_WORLD_SUBLINE =
  'From nervous system dysregulation to deep restoration — when overstimulation keeps the body on alert, sleep fragments and clarity fades. Through intentional sound, breath, and stillness, the system learns to down-regulate until calm feels sustainable again.';

export const MODERN_WORLD_PROBLEM_CARDS: ModernWorldProblemCard[] = [
  {
    id: 'digital-burnout',
    title: 'Digital Burnout',
    titleColor: '#8C82B6',
    headline: 'WHEN CONNECTIVITY NEVER SWITCHES OFF, THE NERVOUS SYSTEM STAYS ON ALERT',
    problem:
      'Always-on screens, back-to-back calls, and the pressure to respond keep the body in sustained sympathetic activation — rest feels unreachable even in quiet moments.',
    impact: 'Sleep fragments, focus thins, and recovery never completes.',
    image: '/images/modern-world/digital-burnout.png',
    imageAlt: 'Woman overwhelmed by multiple screens and digital devices at night',
    link: {
      label: 'SEE CORPORATE WELLNESS',
      connect: {
        service: 'Corporate Wellness',
        action: 'Request Corporate Proposal',
      },
    },
  },
  {
    id: 'sensory-overload',
    title: 'Sensory Overload',
    titleColor: '#A55A42',
    headline: 'WHEN STIMULATION NEVER STOPS, THE BODY LOSES ITS FILTER',
    problem:
      'Urban noise, notifications, bright screens, and constant input flood the senses — the nervous system cannot down-regulate between stimuli.',
    impact: 'Irritability rises, anxiety loops, and the mind struggles to find stillness.',
    image: '/images/modern-world/sensory-overload.png',
    imageAlt:
      'Person overwhelmed by sensory stimulation — books, transit, phone, headphones, and tangled mental noise',
    link: {
      label: 'SEE SOUND HEALING',
      connect: {
        service: 'Sound Healing',
        action: 'Book Session',
      },
    },
  },
  {
    id: 'social-isolation',
    title: 'Social Isolation',
    titleColor: '#5c2999',
    headline: 'CONNECTION WITHOUT PRESENCE DEEPENS DYSREGULATION',
    problem:
      'Digital proximity replaces embodied contact — likes and messages without felt safety leave the body lonely while appearing connected.',
    impact: 'Disconnection, emotional numbness, and a quiet grief the mind cannot name.',
    image: '/images/modern-world/social-isolation.png',
    imageAlt: 'Empty room at night suggesting loneliness and disconnection',
    link: {
      label: 'SEE RETREATS',
      connect: {
        service: 'Retreat',
        action: 'Reserve Your Spot',
      },
    },
  },
];
