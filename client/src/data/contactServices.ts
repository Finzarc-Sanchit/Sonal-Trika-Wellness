/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/** Slug values aligned with server/models/contactModel.js service enum */
export type ContactServiceSlug =
  | 'chakra-therapy'
  | 'ocean-therapy'
  | 'clinical-protocols'
  | 'corporate-wellness'
  | 'retreats-and-festivals'
  | 'new-moon-full-moon-sound-bath'
  | 'beginner-sound-healing-workshop'
  | 'gong-and-bowl-learning-modules';

export interface ContactServiceOption {
  value: ContactServiceSlug;
  label: string;
}

export const CONTACT_SERVICE_OPTIONS: ContactServiceOption[] = [
  { value: 'chakra-therapy', label: 'Chakra Therapy' },
  { value: 'ocean-therapy', label: 'Ocean Therapy' },
  { value: 'clinical-protocols', label: 'Clinical Protocols' },
  { value: 'corporate-wellness', label: 'Corporate Wellness' },
  { value: 'retreats-and-festivals', label: 'Retreats & Festivals' },
  { value: 'new-moon-full-moon-sound-bath', label: 'New Moon / Full Moon Sound Bath' },
  { value: 'beginner-sound-healing-workshop', label: "Beginners' Sound Healing Workshop" },
  { value: 'gong-and-bowl-learning-modules', label: 'Gong and Bowl Learning Modules' },
];

const SERVICE_LABELS = Object.fromEntries(
  CONTACT_SERVICE_OPTIONS.map((opt) => [opt.value, opt.label]),
) as Record<ContactServiceSlug, string>;

export function formatContactService(slug: ContactServiceSlug | string): string {
  return SERVICE_LABELS[slug as ContactServiceSlug] ?? slug;
}

/** Maps servicesData card `id` values to backend contact `service` enum slugs */
const SERVICE_CARD_TO_CONTACT_SLUG: Record<string, ContactServiceSlug> = {
  'chakra-therapy': 'chakra-therapy',
  'ocean-therapy': 'ocean-therapy',
  'clinical-protocols': 'clinical-protocols',
  'corporate-wellness': 'corporate-wellness',
  'retreats-festivals': 'retreats-and-festivals',
  'moon-sound-baths': 'new-moon-full-moon-sound-bath',
  'beginners-workshop': 'beginner-sound-healing-workshop',
  'gong-bowl-modules': 'gong-and-bowl-learning-modules',
};

export function toContactServiceSlug(cardId: string): ContactServiceSlug | '' {
  return SERVICE_CARD_TO_CONTACT_SLUG[cardId] ?? '';
}

export function isContactServiceSlug(value: string): value is ContactServiceSlug {
  return value in SERVICE_LABELS;
}
