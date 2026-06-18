/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { Loader2, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { getContactStats, type ContactStatsOverview } from '../../api/services/contactService';
import { newsletterService } from '../../api/services/newsletterService';
import {
  adminService,
  type OverviewRange,
  type OverviewStats,
} from '../../api/services/adminService';
import { formatContactService } from '../../data/contactServices';
import { RETREAT_LOCATIONS } from '../../data/retreatLocations';

const BAR_FILLS = ['#D8C5A4', '#C4B59A', '#A8A29E', '#D4B896', '#B8956B', '#9CA3AF', '#8B7355', '#A55A42'];

const RANGE_OPTIONS: { value: OverviewRange; label: string }[] = [
  { value: '3_months', label: 'Last 3 Months' },
  { value: '6_months', label: 'Last 6 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'all_time', label: 'All Time' },
];

const selectClass =
  'rounded-xl border border-[#D8C5A4]/45 bg-white px-3 py-2.5 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4] cursor-pointer min-w-[11.5rem]';

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #D8C5A4',
  borderRadius: '12px',
  fontSize: '12px',
  color: '#2B2B2B',
};

function formatRetreatLocation(slug: string) {
  return RETREAT_LOCATIONS.find((loc) => loc.slug === slug)?.name ?? slug;
}

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

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-5 md:p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <h2 className="font-display text-xl tracking-tight text-[#2B2B2B]">{title}</h2>
      <p className="mt-1 font-sans text-caption text-[#888888]">{subtitle}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function EmptyChartMessage({ message }: { message: string }) {
  return (
    <div className="h-[350px] flex items-center justify-center font-sans text-sm text-[#888888]">
      {message}
    </div>
  );
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<ContactStatsOverview | null>(null);
  const [newsletterTotal, setNewsletterTotal] = useState(0);
  const [analytics, setAnalytics] = useState<OverviewStats | null>(null);
  const [range, setRange] = useState<OverviewRange>('6_months');
  const skipRangeFetch = useRef(true);

  const loadAnalytics = async (selectedRange: OverviewRange) => {
    setChartsLoading(true);
    setError(null);
    try {
      const analyticsRes = await adminService.getOverviewStats(selectedRange);
      setAnalytics(analyticsRes.data);
    } catch {
      setError('Unable to load chart metrics for the selected time range. Please try again.');
    } finally {
      setChartsLoading(false);
    }
  };

  const loadMetrics = async (selectedRange: OverviewRange = range) => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, newsletterRes, analyticsRes] = await Promise.all([
        getContactStats(),
        newsletterService.getSubscribers({ page: 1, limit: 1 }),
        adminService.getOverviewStats(selectedRange),
      ]);
      setOverview(statsRes.data.overview);
      setNewsletterTotal(newsletterRes.data.pagination.totalSubscribers ?? 0);
      setAnalytics(analyticsRes.data);
    } catch {
      setError('Unable to load dashboard metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMetrics('6_months');
  }, []);

  useEffect(() => {
    if (skipRangeFetch.current) {
      skipRangeFetch.current = false;
      return;
    }
    void loadAnalytics(range);
  }, [range]);

  const serviceChartData = useMemo(
    () =>
      (analytics?.servicesData ?? []).map((row) => ({
        name: formatContactService(row.service),
        count: row.count,
        slug: row.service,
      })),
    [analytics?.servicesData],
  );

  const retreatChartData = useMemo(
    () =>
      (analytics?.retreatsData ?? []).map((row) => ({
        name: formatRetreatLocation(row.location),
        count: row.count,
        slug: row.location,
      })),
    [analytics?.retreatsData],
  );

  const rangeLabel = RANGE_OPTIONS.find((option) => option.value === range)?.label ?? 'Last 6 Months';

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-sans text-body-sm text-[#888888] max-w-xl">
          Live telemetry from contact inquiries, retreat bookings, and newsletter subscriptions.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label
              htmlFor="overview-range-filter"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Time horizon
            </label>
            <select
              id="overview-range-filter"
              value={range}
              onChange={(e) => setRange(e.target.value as OverviewRange)}
              disabled={loading}
              className={selectClass}
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => void loadMetrics(range)}
            disabled={loading || chartsLoading}
            className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white/80 px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading || chartsLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
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

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <ChartPanel
              title="Service customer distribution"
              subtitle={`Studio service tracks ranked by contact inquiry volume (${rangeLabel.toLowerCase()})`}
            >
              {chartsLoading ? (
                <div className="h-[350px] flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#A55A42] animate-spin" aria-hidden />
                </div>
              ) : serviceChartData.length === 0 ? (
                <EmptyChartMessage message="No service inquiry data yet." />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={serviceChartData} margin={{ top: 8, right: 12, left: 0, bottom: 48 }}>
                    <CartesianGrid stroke="#E8E0D0" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#888888', fontSize: 10 }}
                      axisLine={{ stroke: '#D8C5A4' }}
                      tickLine={false}
                      interval={0}
                      angle={-22}
                      textAnchor="end"
                      height={72}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#888888', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: 'Inquiries',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#888888',
                        fontSize: 11,
                      }}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" name="Inquiries" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {serviceChartData.map((entry, index) => (
                        <Cell
                          key={entry.slug}
                          fill={BAR_FILLS[index % BAR_FILLS.length]}
                          stroke="#F8F5F0"
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>

            <ChartPanel
              title="Retreat bookings breakdown"
              subtitle={`Destination popularity across retreat registrations (${rangeLabel.toLowerCase()})`}
            >
              {chartsLoading ? (
                <div className="h-[350px] flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-[#A55A42] animate-spin" aria-hidden />
                </div>
              ) : retreatChartData.length === 0 ? (
                <EmptyChartMessage message="No retreat booking data yet." />
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={retreatChartData} margin={{ top: 8, right: 12, left: 0, bottom: 24 }}>
                    <CartesianGrid stroke="#E8E0D0" strokeDasharray="4 4" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#888888', fontSize: 11 }}
                      axisLine={{ stroke: '#D8C5A4' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: '#888888', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{
                        value: 'Bookings',
                        angle: -90,
                        position: 'insideLeft',
                        fill: '#888888',
                        fontSize: 11,
                      }}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="count" name="Bookings" radius={[6, 6, 0, 0]} maxBarSize={56}>
                      {retreatChartData.map((entry, index) => (
                        <Cell
                          key={entry.slug}
                          fill={BAR_FILLS[index % BAR_FILLS.length]}
                          stroke="#F8F5F0"
                          strokeWidth={1}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartPanel>
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
