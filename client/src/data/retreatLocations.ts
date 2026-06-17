/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RetreatLocation {
  slug: string;
  name: string;
  tagline: string;
  /** Primary paragraph shown inside the card */
  description: string;
  /** Optional second sentence/paragraph inside the card */
  paragraph?: string;
  image: string;
  imageAlt: string;
  gradientFrom: string;
  gradientTo: string;
}

export const RETREAT_LOCATIONS: RetreatLocation[] = [
  {
    slug: 'jaisalmer',
    name: 'Jaisalmer',
    tagline: 'Desert silence & golden-hour gong immersions',
    description:
      'Find profound stillness in the vast Thar Desert, where the silence of the sands meets the resonant, hypnotic vibrations of golden-hour gong immersions.',
    image: '/images/retreats/retreat-jaisalmer.png',
    imageAlt:
      'Jaisalmer Fort at golden hour — Trika sound healing retreat in the Thar Desert',
    gradientFrom: '#D8C5A4',
    gradientTo: '#A55A42',
  },
  {
    slug: 'rishikesh',
    name: 'Rishikesh',
    tagline: 'River-side sound healing & breathwork',
    description:
      'Immerse yourself in the spiritual capital of yoga, where the sacred flow of the Ganga and the rhythmic tones of Himalayan singing bowls harmonize to restore your nervous system.',
    image: '/images/retreats/retreat-rishikesh.png',
    imageAlt:
      'Sacred Ganga river at the Himalayan foothills — Trika sound healing retreat in Rishikesh',
    gradientFrom: '#7A8B6F',
    gradientTo: '#5a6e55',
  },
  {
    slug: 'gangtok',
    name: 'Gangtok',
    tagline: 'Mountain retreat & nervous system reset',
    description:
      'Embark on a mountain-top journey toward inner peace, utilizing high-altitude serenity and meditative practices to cultivate mental clarity and deep emotional balance.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    imageAlt:
      'Misty Eastern Himalaya peaks — Trika nervous system reset retreat in Gangtok',
    gradientFrom: '#8C82B6',
    gradientTo: '#5c6680',
  },
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    tagline: 'Coastal restoration & digital detox',
    description:
      'Reconnect with your senses on tranquil coastal shores, where the healing power of the ocean breeze complements meditative breathwork and restorative sound therapy.',
    image: '/images/retreats/retreat-sri-lanka.png',
    imageAlt:
      'Sigiriya rock fortress surrounded by lush forest — Trika sound healing retreat in Sri Lanka',
    gradientFrom: '#7A8B6F',
    gradientTo: '#4a8a7a',
  },
];
