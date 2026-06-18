/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  retreatService,
  type Retreat,
  type RetreatLocation,
  type RetreatStatsOverview,
  type RetreatStatus,
} from '../../api/services/retreatService';

const unescapeHTML = (str: string): string => {
  if (!str) return '';
  const doc = new DOMParser().parseFromString(str, 'text/html');
  return doc.documentElement.textContent || str;
};

const STATUS_OPTIONS: { value: RetreatStatus; label: string }[] = [
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'deposit_pending', label: 'Deposit Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const LOCATION_OPTIONS: { value: RetreatLocation; label: string }[] = [
  { value: 'rishikesh', label: 'Rishikesh' },
  { value: 'jaisalmer', label: 'Jaisalmer' },
  { value: 'sri-lanka', label: 'Sri Lanka' },
  { value: 'gangtok', label: 'Gangtok' },
];

type StatusFilter = RetreatStatus | 'all';
type LocationFilter = RetreatLocation | 'all';

const selectClass =
  'w-full rounded-xl border border-[#D8C5A4]/45 bg-white px-3 py-2.5 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4] cursor-pointer';

function formatLocation(location: RetreatLocation) {
  const map: Record<RetreatLocation, string> = {
    rishikesh: 'Rishikesh',
    jaisalmer: 'Jaisalmer',
    'sri-lanka': 'Sri Lanka',
    gangtok: 'Gangtok',
  };
  return map[location];
}

function statusLabel(status: RetreatStatus) {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label ?? status;
}

function statusTone(status: RetreatStatus) {
  const map: Record<RetreatStatus, string> = {
    inquiry: 'bg-[#D8C5A4]/25 text-[#8B7355] border border-[#D8C5A4]/50',
    waitlisted: 'bg-amber-500/12 text-amber-700 border border-amber-500/20',
    deposit_pending: 'bg-indigo-500/12 text-indigo-700 border border-indigo-500/20',
    confirmed: 'bg-emerald-500/12 text-emerald-700 border border-emerald-500/20',
    cancelled: 'bg-rose-500/12 text-rose-700 border border-rose-500/20',
  };
  return map[status];
}

function LoadingFrame({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex items-center justify-center py-24 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex flex-col items-center justify-center py-16 px-6 text-center shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <MapPin className="w-10 h-10 text-[#2B2B2B]/20 mb-3" />
      <p className="font-sans text-body-sm text-[#888888]">{message}</p>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-5 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#888888]">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl tracking-tight text-[#2B2B2B]">{value}</p>
      {hint && (
        <p className="mt-1.5 font-sans text-caption text-[#888888] leading-relaxed">{hint}</p>
      )}
    </div>
  );
}

function DetailsModal({ retreat, onClose }: { retreat: Retreat | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {retreat && (
        <motion.div
          key="details-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="retreat-details-title"
            className="w-full max-w-lg rounded-2xl border border-[#D8C5A4]/45 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#D8C5A4]/25">
              <div className="min-w-0">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888888]">
                  Inquiry details
                </p>
                <h2 id="retreat-details-title" className="font-display text-lg text-[#2B2B2B] truncate">
                  {retreat.name}
                </h2>
                <p className="font-sans text-caption text-[#888888]">
                  {formatLocation(retreat.location)} · {retreat.email}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl hover:bg-[#2B2B2B]/5 flex items-center justify-center cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-4 h-4 text-[#2B2B2B]/70" />
              </button>
            </div>
            <div className="px-5 py-4 max-h-[min(60vh,420px)] overflow-y-auto">
              <p className="font-sans text-body-sm text-[#2B2B2B]/85 leading-relaxed whitespace-pre-wrap">
                {unescapeHTML(retreat.details) || 'No details provided.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function RetreatManagement() {
  const [loading, setLoading] = useState(true);
  const [rowActionId, setRowActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [stats, setStats] = useState<RetreatStatsOverview | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<LocationFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedRetreat, setExpandedRetreat] = useState<Retreat | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [retreatsRes, statsRes] = await Promise.all([
        retreatService.getRetreats(),
        retreatService.getRetreatStats(),
      ]);
      setRetreats(retreatsRes.data.retreats);
      setStats(statsRes.data.overview);
    } catch {
      setError('Failed to load retreat bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const statsRes = await retreatService.getRetreatStats();
      setStats(statsRes.data.overview);
    } catch {
      /* non-critical */
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredRetreats = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    return retreats.filter((row) => {
      if (locationFilter !== 'all' && row.location !== locationFilter) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = [row.name, row.email].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [retreats, locationFilter, statusFilter, debouncedSearchQuery]);

  const handleStatusChange = async (id: string, nextStatus: RetreatStatus) => {
    const current = retreats.find((r) => r._id === id);
    if (!current || current.status === nextStatus) return;

    setRowActionId(id);
    setError(null);

    try {
      const res = await retreatService.updateRetreat(id, { status: nextStatus });
      setRetreats((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      await refreshStats();
    } catch {
      setError('Failed to update retreat status.');
    } finally {
      setRowActionId(null);
    }
  };

  const handleDelete = async (retreat: Retreat) => {
    if (
      !window.confirm(
        `Delete the retreat inquiry from ${retreat.name}? This cannot be undone.`,
      )
    ) {
      return;
    }

    setRowActionId(retreat._id);
    setError(null);

    try {
      await retreatService.deleteRetreat(retreat._id);
      setRetreats((prev) => prev.filter((r) => r._id !== retreat._id));
      await refreshStats();
    } catch {
      setError('Failed to delete retreat booking.');
    } finally {
      setRowActionId(null);
    }
  };

  if (loading) {
    return <LoadingFrame label="Loading retreat bookings" />;
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-caption text-red-600">{error}</p>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Inquiries"
          value={stats?.totalRetreats ?? retreats.length}
          hint="All retreat booking records"
        />
        <StatCard
          label="Confirmed Registrations"
          value={stats?.confirmed ?? 0}
          hint="Spots secured with payment"
        />
        <StatCard
          label="Waitlist Queue"
          value={stats?.waitlisted ?? 0}
          hint="Clients on hold for capacity"
        />
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-4 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="lg:col-span-2">
            <label
              htmlFor="retreat-search"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                id="retreat-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name or email…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8C5A4]/45 bg-white font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="retreat-location-filter"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Location
            </label>
            <select
              id="retreat-location-filter"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value as LocationFilter)}
              className={selectClass}
            >
              <option value="all">All Locations</option>
              {LOCATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="retreat-status-filter"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Status
            </label>
            <select
              id="retreat-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={selectClass}
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-caption text-[#888888]">
            {filteredRetreats.length} of {retreats.length} booking{retreats.length === 1 ? '' : 's'}{' '}
            shown
          </p>
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {retreats.length === 0 ? (
        <EmptyState message="No retreat bookings yet. Inquiries from the website will appear here." />
      ) : filteredRetreats.length === 0 ? (
        <EmptyState message="No bookings match your current filters." />
      ) : (
        <div className="relative rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          {rowActionId && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
              <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="border-b border-[#D8C5A4]/25 bg-[#F8F5F0]">
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Client
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Phone
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Destination
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Inquiry
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C5A4]/20">
                {filteredRetreats.map((row) => {
                  const isRowBusy = rowActionId === row._id;

                  return (
                    <tr key={row._id} className="hover:bg-[#F8F5F0]/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-sans text-sm font-medium text-[#2B2B2B]">
                          {row.name}
                        </p>
                        <p className="font-sans text-caption text-[#888888] lowercase">
                          {row.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-sans text-sm text-[#2B2B2B]/80 whitespace-nowrap">
                        {row.phone || '—'}
                      </td>
                      <td className="px-4 py-3.5 font-sans text-sm text-[#2B2B2B]/80 whitespace-nowrap">
                        {formatLocation(row.location)}
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedRetreat(row)}
                          className="w-full text-left font-sans text-sm text-[#2B2B2B]/75 truncate max-w-xs hover:text-[#A55A42] transition-colors cursor-pointer"
                          title={unescapeHTML(row.details) || 'View full inquiry'}
                        >
                          {unescapeHTML(row.details) || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider ${statusTone(row.status)}`}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={row.status}
                            disabled={isRowBusy}
                            onChange={(e) =>
                              void handleStatusChange(row._id, e.target.value as RetreatStatus)
                            }
                            className="rounded-lg border border-[#D8C5A4]/45 bg-white px-2 py-1.5 font-sans text-xs text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4] cursor-pointer disabled:opacity-50"
                            aria-label={`Update status for ${row.name}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleDelete(row)}
                            disabled={isRowBusy}
                            className="w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            aria-label={`Delete booking for ${row.name}`}
                          >
                            {isRowBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DetailsModal retreat={expandedRetreat} onClose={() => setExpandedRetreat(null)} />
    </div>
  );
}
