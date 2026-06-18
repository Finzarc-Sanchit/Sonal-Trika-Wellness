/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState, useRef, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/admin/Login';
import DashboardLayout from './pages/admin/DashboardLayout';
import Overview from './pages/admin/Overview';
import ContactMessages from './pages/admin/ContactMessages';
import NewsletterList from './pages/admin/NewsletterList';
import RetreatManagement from './pages/admin/RetreatManagement';

import { scrollToHashTarget, scrollToTestimonialsInstant } from './utils/scrollToHash';
import { markInternalNavigationToHome } from './utils/siteIntro';
import { scrollLenisTo } from './utils/lenisInstance';
import { isAdminAuthenticated, verifyAdminToken } from './api/auth';
import { Loader2 } from 'lucide-react';
import LenisScrollProvider from './components/providers/LenisScrollProvider';

function HomeReturnTracker() {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === '/' && prevPathRef.current !== '/') {
      markInternalNavigationToHome();
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  return null;
}

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      if (!scrollLenisTo(0, { immediate: true })) {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash]);

  return null;
}

function ScrollToHash() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/' && hash === '#contact') {
      navigate('/contact', { replace: true });
      return;
    }

    if (!hash) return;

    const id = hash.replace('#', '');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const delay =
      pathname === '/services' ? (isMobile ? 500 : 500) : 120;
    const timer = window.setTimeout(() => {
      if (id === 'testimonials') {
        scrollToTestimonialsInstant();
        return;
      }
      scrollToHashTarget(id);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [pathname, hash, navigate]);

  return null;
}

function RequireAdmin() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const ok = await verifyAdminToken();
      if (!active) return;
      if (!ok) {
        navigate('/admin/login', { replace: true });
        return;
      }
      setChecking(false);
    })();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
        <span className="sr-only">Verifying admin session</span>
      </div>
    );
  }

  return <Outlet />;
}

function RedirectIfAdmin({ children }: { children: ReactNode; }) {
  const navigate = useNavigate();

  // Keep this synchronous for instant route bounce; `verifyAdminToken()` will still
  // protect the dashboard route if the token is stale.
  const authed = useMemo(() => isAdminAuthenticated(), []);

  useEffect(() => {
    if (authed) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [authed, navigate]);

  if (authed) return null;
  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <BrowserRouter>
      <LenisScrollProvider>
        <HomeReturnTracker />
        <ScrollToTopOnNavigate />
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<RedirectIfAdmin><AdminLogin /></RedirectIfAdmin>} />

          {/* Strict authenticated-only admin workspace */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="messages" element={<ContactMessages />} />
              <Route path="newsletter" element={<NewsletterList />} />
              <Route path="retreats" element={<RetreatManagement />} />
            </Route>
          </Route>
        </Routes>
      </LenisScrollProvider>
    </BrowserRouter>
  );
}
