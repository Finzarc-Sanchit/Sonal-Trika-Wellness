/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, RefreshCw } from 'lucide-react';
import { getContactStats, type ContactStatsOverview } from '../../api/services/contactService';
import { newsletterService } from '../../api/services/newsletterService';

function StatCard({
  label,
  value,
  hint,
  delay = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-5 shadow-[0_10px_28px_rgba(0,0,0,0.06)]"
    >
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888888]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-[#2B2B2B]">{value}</p>
      {hint && (
        <p className="mt-1.5 font-sans text-caption text-[#888888] leading-relaxed">{hint}</p>
      )}
    </motion.div>
  );
}

function LoadingFrame() {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex items-center justify-center py-24 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
      <span className="sr-only">Loading overview metrics</span>
    </div>
  );
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<ContactStatsOverview | null>(null);
  const [newsletterTotal, setNewsletterTotal] = useState(0);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, newsletterRes] = await Promise.all([
        getContactStats(),
        newsletterService.getSubscribers({ page: 1, limit: 1 }),
      ]);
      setOverview(statsRes.data.overview);
      setNewsletterTotal(newsletterRes.data.pagination.totalSubscribers ?? 0);
    } catch {
      setError('Unable to load dashboard metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMetrics();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-body-sm text-[#888888] max-w-xl">
          Live telemetry from contact inquiries and newsletter subscriptions.
        </p>
        <button
          type="button"
          onClick={() => void loadMetrics()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white/80 px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-caption text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <LoadingFrame />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Inquiries"
              value={overview?.totalContacts ?? 0}
              hint="All contact form submissions"
              delay={0}
            />
            <StatCard
              label="New Messages"
              value={overview?.newContacts ?? 0}
              hint="Awaiting first response"
              delay={0.05}
            />
            <StatCard
              label="In Progress"
              value={overview?.inProgressContacts ?? 0}
              hint="Active follow-ups"
              delay={0.1}
            />
            <StatCard
              label="Active Subscribers"
              value={newsletterTotal}
              hint="Newsletter audience size"
              delay={0.15}
            />
          </div>

          <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
            <h2 className="font-display text-xl tracking-tight text-[#2B2B2B] mb-2">Pipeline snapshot</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {[
                { label: 'Contacted', value: overview?.contactedContacts ?? 0 },
                { label: 'Completed', value: overview?.completedContacts ?? 0 },
                { label: 'New', value: overview?.newContacts ?? 0 },
                { label: 'Subscribers', value: newsletterTotal },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-[#F8F5F0] border border-[#D8C5A4]/35 px-4 py-3">
                  <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888]">{item.label}</p>
                  <p className="mt-1 font-display text-2xl text-[#2B2B2B]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
