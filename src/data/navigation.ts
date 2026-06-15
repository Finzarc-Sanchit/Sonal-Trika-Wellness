/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { MenuLink } from '../types';
import { SERVICE_GROUPS } from './servicesData';

const SERVICE_CHILDREN = [
  { label: 'View All Services', url: '/services' },
  ...SERVICE_GROUPS.flatMap((group) => [
    { label: group.label, url: `/services#${group.id}` },
    ...group.items.map((item) => ({
      label: item.title,
      url: `/services#${group.id}`,
    })),
  ]),
];

export const NAV_LINKS: MenuLink[] = [
  { label: 'About', url: '/about' },
  { label: 'Services', url: '/services', children: SERVICE_CHILDREN },
  { label: 'Experiences', url: '/#experiences' },
  { label: 'Testimonials', url: '/#testimonials' },
  { label: 'Contact', url: '/#contact' },
];
