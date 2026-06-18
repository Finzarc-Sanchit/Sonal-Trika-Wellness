/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { clearAdminToken } from '../../api/auth';

export interface SidebarItem {
  name: string;
  path: string;
  icon: 'LayoutDashboard' | 'Mail' | 'Users' | 'MapPin';
  countKey?: 'unreadContacts';
}

export const sidebarItems: SidebarItem[] = [
  { name: 'Overview', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  {
    name: 'Contact Messages',
    path: '/admin/messages',
    icon: 'Mail',
    countKey: 'unreadContacts',
  },
  { name: 'Newsletter List', path: '/admin/newsletter', icon: 'Users' },
  { name: 'Retreat Bookings', path: '/admin/retreats', icon: 'MapPin' },
];

const iconMap: Record<SidebarItem['icon'], LucideIcon> = {
  LayoutDashboard,
  Mail,
  Users,
  MapPin,
};

export type SidebarCounts = Partial<Record<'unreadContacts', number>>;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  counts?: SidebarCounts;
  onLogout: () => void;
}

function NavItem({
  item,
  counts,
  onNavigate,
}: {
  item: SidebarItem;
  counts?: SidebarCounts;
  onNavigate?: () => void;
}) {
  const Icon = iconMap[item.icon];
  const badge = item.countKey ? counts?.[item.countKey] : undefined;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-colors duration-200 ${
          isActive
            ? 'bg-[#D8C5A4]/18 text-[#2B2B2B] font-semibold border-l-2 border-[#D8C5A4] pl-[calc(0.75rem-2px)]'
            : 'text-[#2B2B2B]/70 hover:bg-[#F8F5F0] hover:text-[#2B2B2B] border-l-2 border-transparent pl-[calc(0.75rem-2px)]'
        }`
      }
    >
      <Icon className="w-4 h-4 shrink-0 opacity-80" />
      <span className="flex-1 truncate">{item.name}</span>
      {typeof badge === 'number' && badge > 0 && (
        <span className="min-w-[1.25rem] rounded-full bg-[#A55A42] px-1.5 py-0.5 text-center font-sans text-[10px] font-semibold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </NavLink>
  );
}

function SidebarPanel({
  counts,
  onClose,
  onLogout,
}: {
  counts?: SidebarCounts;
  onClose?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-[#D8C5A4]/35">
      <div className="flex items-center justify-between gap-3 px-5 py-5 border-b border-[#D8C5A4]/25">
        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#888888]">
            Trika Admin
          </p>
          <p className="font-display text-lg tracking-tight text-[#2B2B2B]">Wellness</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden w-9 h-9 rounded-xl hover:bg-[#2B2B2B]/5 flex items-center justify-center cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4 text-[#2B2B2B]/70" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <div key={item.path}>
            <NavItem item={item} counts={counts} onNavigate={onClose} />
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#D8C5A4]/25">
        <button
          type="button"
          onClick={() => {
            clearAdminToken();
            onLogout();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-[#2B2B2B]/70 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ open, onClose, counts, onLogout }: SidebarProps) {
  return (
    <>
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:h-screen md:w-64">
        <SidebarPanel counts={counts} onLogout={onLogout} />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close navigation overlay"
              className="fixed inset-0 z-40 bg-[#1A1A1A]/50 md:hidden cursor-pointer border-0 p-0"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-2xl"
            >
              <SidebarPanel counts={counts} onClose={onClose} onLogout={onLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
