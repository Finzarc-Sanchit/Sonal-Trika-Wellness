/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import ServicesMegaMenu from './navigation/ServicesMegaMenu';
import { MenuLink, MenuLinkChild } from '../types';
import TrikaLogo from './ui/TrikaLogo';
import ContactBookingModal from './contact/ContactBookingModal';
import { onScrollThreshold } from '../utils/performance';
import { parseInternalUrl, scrollToHashTarget } from '../utils/scrollToHash';
import { NavLinkLabel } from './navigation/NavLinkParts';
import { getDesktopNavLinkClass } from '../utils/navLinkStyles';
import { BOOKING_MODAL_EVENT } from '../utils/bookingModal';

interface NavigationBarProps {
  logoText?: string;
  links: MenuLink[];
  ctaText: string;
  onCtaClick?: () => void;
  onLogoClick?: () => void;
  variant?: 'overlay' | 'solid';
  floating?: boolean;
  homeUrl?: string;
}

function isInternalPath(url: string) {
  return url.startsWith('/') && !url.startsWith('//');
}

function NavChildLink({
  child,
  className,
  onClick,
}: {
  child: MenuLinkChild;
  className: string;
  onClick?: () => void;
}) {
  const location = useLocation();
  const parsed = parseInternalUrl(child.url);

  const handleClick = useCallback(() => {
    onClick?.();

    if (!parsed?.hash) return;

    const id = parsed.hash.replace('#', '');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const delay =
      parsed.pathname === '/services' && location.pathname === '/services'
        ? isMobile
          ? 300
          : 400
        : parsed.pathname === '/services'
          ? isMobile
            ? 500
            : 500
          : 120;

    window.setTimeout(() => scrollToHashTarget(id), delay);
  }, [onClick, parsed, location.pathname]);

  if (parsed) {
    return (
      <Link
        to={{ pathname: parsed.pathname, hash: parsed.hash || undefined }}
        className={className}
        onClick={handleClick}
      >
        {child.label}
      </Link>
    );
  }

  return (
    <a href={child.url} className={className} onClick={onClick}>
      {child.label}
    </a>
  );
}

function NavAnchor({
  link,
  className,
  onClick,
}: {
  link: MenuLink;
  className: string;
  onClick?: () => void;
}) {
  const cls = `${className} group relative transition-colors duration-200`;

  if (isInternalPath(link.url)) {
    const parsed = parseInternalUrl(link.url);
    const to = parsed
      ? { pathname: parsed.pathname, hash: parsed.hash || undefined }
      : link.url;

    return (
      <Link to={to} className={cls} onClick={onClick}>
        <span>{link.label}</span>
        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D8C5A4] transition-all duration-300 group-hover:w-full" />
      </Link>
    );
  }

  return (
    <a href={link.url} className={cls} onClick={onClick}>
      <span>{link.label}</span>
      <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D8C5A4] transition-all duration-300 group-hover:w-full" />
    </a>
  );
}

function DesktopNavMenuLink({
  link,
  isSolid,
}: {
  link: MenuLink;
  isSolid: boolean;
}) {
  const cls = getDesktopNavLinkClass(isSolid);

  if (isInternalPath(link.url)) {
    const parsed = parseInternalUrl(link.url);
    const to = parsed
      ? { pathname: parsed.pathname, hash: parsed.hash || undefined }
      : link.url;

    return (
      <NavigationMenuLink asChild>
        <Link to={to} className={cls}>
          <NavLinkLabel label={link.label} />
        </Link>
      </NavigationMenuLink>
    );
  }

  return (
    <NavigationMenuLink asChild>
      <a href={link.url} className={cls}>
        <NavLinkLabel label={link.label} />
      </a>
    </NavigationMenuLink>
  );
}

function DesktopNavItem({
  link,
  isSolid,
}: {
  link: MenuLink;
  isSolid: boolean;
}) {
  if (link.label === 'Services') {
    return <ServicesMegaMenu isSolid={isSolid} />;
  }

  return (
    <NavigationMenuItem>
      <DesktopNavMenuLink link={link} isSolid={isSolid} />
    </NavigationMenuItem>
  );
}

export default function NavigationBar({
  links,
  ctaText,
  onLogoClick,
  variant = 'overlay',
  floating = false,
  homeUrl = '/',
}: NavigationBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  useEffect(() => {
    return onScrollThreshold(20, setScrolled);
  }, []);

  useEffect(() => {
    const openBooking = () => {
      setIsOpen(false);
      setBookingOpen(true);
    };

    window.addEventListener(BOOKING_MODAL_EVENT, openBooking);
    return () => window.removeEventListener(BOOKING_MODAL_EVENT, openBooking);
  }, []);

  const isSolid = variant === 'solid' || scrolled;
  const showFloatingPill = floating || scrolled;

  const pillClass = isSolid
    ? 'bg-white/90 backdrop-blur-xl rounded-[24px] border border-[#e5e5e5]/60 px-6 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
    : 'bg-white/10 backdrop-blur-md rounded-[24px] border border-white/15 px-6 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.12)]';

  const mobileLinkClass =
    'font-display text-lg font-medium text-[#F8F5F0]/80 hover:text-[#D8C5A4] py-2 border-b border-[#F8F5F0]/10 transition-colors duration-200 block';

  const mobileChildClass =
    'block py-2 pl-4 font-sans text-sm text-[#F8F5F0]/60 hover:text-[#D8C5A4] transition-colors duration-200';

  const handleBookSession = () => {
    setIsOpen(false);
    setBookingOpen(true);
  };

  return (
    <>
    <motion.header
      id="navigation-header"
      animate={{
        paddingTop: showFloatingPill ? '16px' : '28px',
        paddingBottom: showFloatingPill ? '0px' : '28px',
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 w-full z-40 px-6 md:px-10 pointer-events-none"
    >
      <div
        className={`max-w-[1200px] mx-auto flex items-center justify-between overflow-visible transition-all duration-500 pointer-events-auto ${pillClass}`}
      >
        {onLogoClick ? (
          <button
            id="nav-logo"
            type="button"
            onClick={onLogoClick}
            className="cursor-pointer focus:outline-none"
          >
            <TrikaLogo homeUrl={homeUrl} variant={isSolid ? 'dark' : 'light'} />
          </button>
        ) : (
          <div id="nav-logo">
            <TrikaLogo homeUrl={homeUrl} variant={isSolid ? 'dark' : 'light'} />
          </div>
        )}

        <NavigationMenu id="desktop-nav" className="hidden md:flex max-w-none flex-none">
          <NavigationMenuList className="gap-8">
            {links.map((link) => (
              <Fragment key={link.label}>
                <DesktopNavItem link={link} isSolid={isSolid} />
              </Fragment>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div id="nav-cta-area" className="hidden md:block">
          <motion.button
            id="nav-cta-btn"
            onClick={handleBookSession}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden px-5 py-2.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider text-white flex items-center gap-1.5 cursor-pointer shadow-[0_4px_16px_rgba(165,90,66,0.25)]"
          >
            <span className="absolute inset-0 bg-[#A55A42] transition-opacity duration-400 group-hover:opacity-0" />
            <span className="absolute inset-0 bg-[#8C82B6] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
            <span className="relative z-10">{ctaText}</span>
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </motion.span>
          </motion.button>
        </div>

        <div id="mobile-menu-trigger" className="block md:hidden">
          <motion.button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.92 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isSolid
                ? 'bg-[#8C82B6]/10 text-[#8C82B6] hover:bg-[#8C82B6]/20'
                : 'glass-effect hover:bg-white/10 text-[#F8F5F0]'
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-4 h-4" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-4 h-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 w-full bg-[#2B2B2B]/95 backdrop-blur-2xl border-b border-[#F8F5F0]/10 px-6 py-8 md:hidden shadow-2xl flex flex-col gap-6 pointer-events-auto mt-3 mx-6 rounded-[24px] max-w-[calc(100%-3rem)]"
          >
            <div className="flex flex-col gap-4">
              {links.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {link.children?.length ? (
                    <div>
                      <div className="flex items-center border-b border-[#F8F5F0]/10">
                        <Link
                          to="/services"
                          onClick={() => setIsOpen(false)}
                          className="flex-1 font-display text-lg font-medium text-[#F8F5F0]/80 hover:text-[#D8C5A4] py-2 transition-colors duration-200"
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobile((prev) =>
                              prev === link.label ? null : link.label,
                            )
                          }
                          className="shrink-0 p-2 text-[#F8F5F0]/60 hover:text-[#D8C5A4] transition-colors duration-200"
                          aria-label={`Expand ${link.label} menu`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${
                              expandedMobile === link.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                      {expandedMobile === link.label && (
                        <div className="mt-2 flex flex-col gap-1 border-l border-[#F8F5F0]/15 pl-3">
                          {link.children.map((child) => (
                            <Fragment key={`${child.label}-${child.url}`}>
                              <NavChildLink
                                child={child}
                                className={mobileChildClass}
                                onClick={() => setIsOpen(false)}
                              />
                            </Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavAnchor
                      link={link}
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            <button
              id="mobile-nav-cta-btn"
              onClick={() => {
                setIsOpen(false);
                handleBookSession();
              }}
              className="w-full py-3 rounded-full text-center text-sm font-sans font-semibold uppercase tracking-wider text-white bg-[#A55A42] hover:bg-[#8C82B6] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

    <ContactBookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
