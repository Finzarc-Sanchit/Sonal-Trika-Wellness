/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NAV_LINK_UNDERLINE_CLASS } from '@/utils/navLinkStyles';

export function NavLinkUnderline() {
  return <span className={NAV_LINK_UNDERLINE_CLASS} aria-hidden />;
}

export function NavLinkLabel({ label }: { label: string }) {
  return (
    <>
      <span className="relative z-10">{label}</span>
      <NavLinkUnderline />
    </>
  );
}
