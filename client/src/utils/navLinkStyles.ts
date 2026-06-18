/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getDesktopNavLinkClass(isSolid: boolean, isOpen = false) {
  return [
    'group relative inline-flex items-center font-sans text-sm font-medium py-2',
    'transition-colors duration-200 bg-transparent shadow-none',
    'hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent',
    isSolid
      ? 'text-[#888888] hover:text-[#D8C5A4] data-[active]:text-[#D8C5A4]'
      : 'text-white/90 hover:text-[#D8C5A4] data-[active]:text-[#D8C5A4]',
    isOpen ? 'text-[#D8C5A4]' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

export const NAV_LINK_UNDERLINE_CLASS =
  'absolute bottom-0 left-0 h-[2px] w-0 bg-[#D8C5A4] transition-all duration-300 group-hover:w-full group-data-[state=open]:w-full';
