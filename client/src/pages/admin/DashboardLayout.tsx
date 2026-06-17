/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar, { sidebarItems, type SidebarCounts } from '../../components/admin/Sidebar';
import { authService } from '../../api/services/authService';
import { getContactStats } from '../../api/services/contactService';

export interface AdminLayoutContextValue {
  refreshSidebarCounts: () => Promise<void>;
  newContactCount: number;
}

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout() {
  const ctx = useContext(AdminLayoutContext);
  if (!ctx) {
    throw new Error('useAdminLayout must be used within DashboardLayout');
  }
  return ctx;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [newContactCount, setNewContactCount] = useState(0);

  const pageTitle = useMemo(() => {
    const match = sidebarItems.find((item) => item.path === location.pathname);
    return match?.name ?? 'Overview';
  }, [location.pathname]);

  const sidebarCounts: SidebarCounts = useMemo(
    () => ({ unreadContacts: newContactCount }),
    [newContactCount],
  );

  const refreshSidebarCounts = useCallback(async () => {
    try {
      const statsRes = await getContactStats();
      setNewContactCount(statsRes.data.overview.newContacts ?? 0);
    } catch {
      /* badge is non-critical */
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const meRes = await authService.me();
        if (active) setAdminEmail(meRes.data.email);
      } catch {
        /* optional */
      }
      if (active) void refreshSidebarCounts();
    })();

    return () => {
      active = false;
    };
  }, [refreshSidebarCounts]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <AdminLayoutContext.Provider value={{ refreshSidebarCounts, newContactCount }}>
      <div className="min-h-screen bg-[#F8F5F0] text-[#2B2B2B]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          counts={sidebarCounts}
          onLogout={() => navigate('/admin/login', { replace: true })}
        />

        <div className="md:pl-64 flex min-h-screen flex-col">
          <header className="sticky top-0 z-30 border-b border-[#D8C5A4]/30 bg-white/90 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden w-10 h-10 rounded-xl border border-[#D8C5A4]/40 bg-white flex items-center justify-center cursor-pointer"
                  aria-label="Open navigation"
                >
                  <Menu className="w-5 h-5 text-[#2B2B2B]" />
                </button>
                <div className="min-w-0">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#888888]">
                    Admin Dashboard
                  </p>
                  <h1 className="font-display text-xl sm:text-2xl tracking-tight text-[#2B2B2B] truncate">
                    {pageTitle}
                  </h1>
                </div>
              </div>

              {adminEmail && (
                <span className="hidden sm:inline font-sans text-caption text-[#888888] truncate max-w-[240px]">
                  {adminEmail}
                </span>
              )}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
