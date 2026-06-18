/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { SERVICE_GROUPS } from '@/data/servicesData';
import { getDesktopNavLinkClass } from '@/utils/navLinkStyles';
import { NavLinkUnderline } from '@/components/navigation/NavLinkParts';
import { parseInternalUrl, scrollToHashTarget } from '@/utils/scrollToHash';

const FEATURED_IMAGE =
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80';

interface ServicesMegaMenuProps {
  isSolid: boolean;
}

function navTriggerClass(isSolid: boolean) {
  return cn(
    getDesktopNavLinkClass(isSolid),
    'gap-1 px-0 h-auto rounded-none',
    'hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
    'data-[state=open]:text-[#D8C5A4]',
  );
}

function useHashNavigation() {
  const location = useLocation();

  return React.useCallback(
    (url: string) => {
      const parsed = parseInternalUrl(url);
      if (!parsed?.hash) return;

      const id = parsed.hash.replace('#', '');
      const delay =
        parsed.pathname === '/services' && location.pathname === '/services' ? 400 : 500;

      window.setTimeout(() => scrollToHashTarget(id), delay);
    },
    [location.pathname],
  );
}

const MegaMenuListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link> & {
    title: string;
  }
>(({ className, title, children, to, onClick, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <Link
        ref={ref}
        to={to}
        onClick={onClick}
        className={cn(
          'group/item block select-none space-y-1 rounded-lg px-1 py-2.5 leading-none no-underline outline-none transition-colors',
          'hover:bg-[#F8F5F0]/60 focus:bg-[#F8F5F0]/60',
          className,
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none text-[#2B2B2B] transition-colors group-hover/item:text-[#D8C5A4] group-focus/item:text-[#D8C5A4]">
          {title}
        </div>
        <p className="line-clamp-2 text-xs leading-snug text-[#888888] pt-1.5">{children}</p>
      </Link>
    </NavigationMenuLink>
  </li>
));
MegaMenuListItem.displayName = 'MegaMenuListItem';

export default function ServicesMegaMenu({ isSolid }: ServicesMegaMenuProps) {
  const navigateToHash = useHashNavigation();

  const handleServiceClick = (url: string) => {
    navigateToHash(url);
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={navTriggerClass(isSolid)}>
        <span className="relative z-10">Services</span>
        <NavLinkUnderline />
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[min(980px,calc(100vw-2rem))] p-4 md:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-4 lg:items-stretch">
            <div className="h-full min-h-[260px] flex flex-col lg:col-span-1">
              <NavigationMenuLink asChild>
                <Link
                  to="/services"
                  className="group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-2xl no-underline outline-none"
                >
                  <img
                    src={FEATURED_IMAGE}
                    alt="Sound healing studio with singing bowls"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="relative z-[2] mt-auto p-4">
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      Studio Offerings
                    </p>
                    <p className="mt-1 font-serif text-base text-white">Explore Trika</p>
                  </div>
                </Link>
              </NavigationMenuLink>
            </div>

            {SERVICE_GROUPS.map((group, index) => (
              <div
                key={group.id}
                className={cn(
                  'flex h-full min-h-[260px] flex-col bg-transparent border-none p-0',
                  index === 0 && 'md:pl-4',
                  index > 0 && 'md:border-l md:border-slate-200/60 md:pl-6',
                )}
              >
                <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D8C5A4]">
                  {group.label}
                </p>
                <ul className="flex flex-1 flex-col space-y-0.5">
                  {group.items.map((item) => (
                    <MegaMenuListItem
                      key={item.id}
                      title={item.title}
                      to={`/services#${item.id}`}
                      onClick={() => handleServiceClick(`/services#${item.id}`)}
                    >
                      {item.summary}
                    </MegaMenuListItem>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
