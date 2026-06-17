/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { MenuLink } from '../types';
import { SERVICE_GROUPS } from './servicesData';

const SERVICE_CHILDREN = [
  ...SERVICE_GROUPS.flatMap((group) => [
    { label: group.label, url: `/services#${group.id}` },
    ...group.items.map((item) => ({
      label: item.title,
      url: `/services#${item.id}`,
    })),
  ]),
];

export const NAV_LINKS: MenuLink[] = [
  { label: 'About', url: '/about' },
  { label: 'Services', url: '/services', children: SERVICE_CHILDREN },
  { label: 'Testimonials', url: '/#testimonials' },
  { label: 'Contact', url: '/contact' },
];
