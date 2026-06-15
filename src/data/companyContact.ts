/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const TRIKA_CONTACT = {
  company: 'Trika Wellness',
  address: {
    lines: [
      'RAHEJA CLASSIQUE, Phase D',
      'Shastri Nagar, Andheri West',
      'Mumbai, Maharashtra 400053',
    ],
    full: 'RAHEJA CLASSIQUE, Phase D, Shastri Nagar, Andheri West, Mumbai, Maharashtra 400053',
  },
  email: 'oniarazdan4@gmail.com',
  phones: [
    { label: 'Primary', value: '+91 91524 82025', href: 'tel:+919152482025' },
    { label: 'Alternate', value: '+91 98210 82025', href: 'tel:+919821082025' },
  ],
  social: {
    instagram: {
      label: 'Instagram',
      href: 'https://www.instagram.com/trika_soundhealing/',
    },
    facebook: {
      label: 'Facebook',
      href: 'https://www.facebook.com/p/Trika-Wellness-100092263917235/',
    },
  },
  mapEmbedUrl:
    'https://maps.google.com/maps?q=RAHEJA+CLASSIQUE,+Phase+D,+Shastri+Nagar,+Andheri+West,+Mumbai,+Maharashtra+400053&t=&z=16&ie=UTF8&iwloc=&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/search/?api=1&query=RAHEJA+CLASSIQUE,+Phase+D,+Shastri+Nagar,+Andheri+West,+Mumbai,+Maharashtra+400053',
} as const;
