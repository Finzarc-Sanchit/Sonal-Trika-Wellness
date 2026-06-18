/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BOOKING_MODAL_EVENT = 'trika:open-booking-modal';

export function openBookingModal() {
  window.dispatchEvent(new CustomEvent(BOOKING_MODAL_EVENT));
}
