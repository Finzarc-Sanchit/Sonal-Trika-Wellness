/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ServiceCard } from '../data/servicesData';
import { toContactServiceSlug, type ContactServiceSlug } from '../data/contactServices';

export const CONNECT_PANEL_EVENT = 'trika:open-connect-panel';

export interface ConnectPanelDetail {
  service: string;
  action: string;
  duration?: string;
  retreatDestination?: string;
  showRetreatPicker?: boolean;
  /** Backend contact enum slug for pre-selected service submission */
  serviceSlug?: ContactServiceSlug;
}

export function openConnectPanel(detail: ConnectPanelDetail) {
  window.dispatchEvent(
    new CustomEvent<ConnectPanelDetail>(CONNECT_PANEL_EVENT, { detail }),
  );
}

export function handleServicePrimaryCta(item: ServiceCard) {
  if (item.primaryHref) {
    window.location.href = item.primaryHref;
    return;
  }
  openConnectPanel({
    service: item.title,
    action: item.primaryCta,
    duration: item.duration,
    serviceSlug: toContactServiceSlug(item.id) || undefined,
  });
}

export function handleServiceSecondaryCta(
  item: ServiceCard,
  onLearnMore?: (item: ServiceCard) => void,
) {
  if (item.secondaryHref) {
    window.location.href = item.secondaryHref;
    return;
  }
  const learnMoreCtas = ['Learn More', 'View Curriculum', 'Module Details'];
  if (
    item.learnMore &&
    item.secondaryCta &&
    learnMoreCtas.includes(item.secondaryCta) &&
    onLearnMore
  ) {
    onLearnMore(item);
    return;
  }
  openConnectPanel({
    service: item.title,
    action: item.secondaryCta ?? 'Learn More',
    duration: item.duration,
    serviceSlug: toContactServiceSlug(item.id) || undefined,
  });
}
