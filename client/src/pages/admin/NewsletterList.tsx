/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownUp,
  Download,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
} from 'lucide-react';
import {
  newsletterService,
  type NewsletterCampaignResult,
  type NewsletterStatus,
  type NewsletterSubscriber,
} from '../../api/services/newsletterService';

type StatusFilter = NewsletterStatus | 'all';
type ActiveTab = 'subscribers' | 'campaign';

const CONTENT_MAX_LENGTH = 5000;

const inputClass =
  'w-full rounded-xl border border-[#D8C5A4]/45 bg-white px-4 py-3 font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4] transition-colors';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function statusTone(status: NewsletterStatus) {
  return status === 'active'
    ? 'bg-emerald-500/12 text-emerald-700 border border-emerald-500/20'
    : 'bg-[#D8C5A4]/25 text-[#8B7355] border border-[#D8C5A4]/50';
}

function LoadingFrame() {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex items-center justify-center py-24 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
      <span className="sr-only">Loading newsletter subscribers</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex flex-col items-center justify-center py-16 px-6 text-center shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <Users className="w-10 h-10 text-[#2B2B2B]/20 mb-3" />
      <p className="font-sans text-body-sm text-[#888888]">{message}</p>
    </div>
  );
}

function escapeCsvCell(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function exportSubscribersCsv(rows: NewsletterSubscriber[]) {
  const header = ['Email', 'Status', 'Registered', 'Updated'];
  const lines = rows.map((row) =>
    [
      escapeCsvCell(row.email),
      escapeCsvCell(row.status),
      escapeCsvCell(formatDate(row.createdAt)),
      escapeCsvCell(formatDate(row.updatedAt)),
    ].join(','),
  );

  const csv = [header.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function NewsletterList() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('subscribers');
  const [loading, setLoading] = useState(true);
  const [rowActionId, setRowActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignContent, setCampaignContent] = useState('');
  const [campaignSending, setCampaignSending] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [campaignResult, setCampaignResult] = useState<{
    message: string;
    data: NewsletterCampaignResult;
  } | null>(null);

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsletterService.getSubscribers({ page: 1, limit: 500 });
      setSubscribers(res.data.subscribers);
      setTotal(res.data.pagination.totalSubscribers ?? res.data.subscribers.length);
    } catch {
      setError('Failed to load newsletter subscribers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSubscribers();
  }, [loadSubscribers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const activeSubscriberCount = useMemo(
    () => subscribers.filter((row) => row.status === 'active').length,
    [subscribers],
  );

  const filteredSubscribers = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    let result = subscribers.filter((row) => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (!query) return true;
      return row.email.toLowerCase().includes(query);
    });

    result = [...result].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortNewestFirst ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [subscribers, statusFilter, debouncedSearchQuery, sortNewestFirst]);

  const trimmedSubject = campaignSubject.trim();
  const trimmedContent = campaignContent.trim();
  const isCampaignValid =
    trimmedSubject.length > 0 &&
    trimmedContent.length > 0 &&
    trimmedContent.length <= CONTENT_MAX_LENGTH;

  const handleStatusToggle = async (subscriber: NewsletterSubscriber) => {
    const nextStatus: NewsletterStatus =
      subscriber.status === 'active' ? 'unsubscribed' : 'active';

    setRowActionId(subscriber._id);
    setError(null);

    try {
      if (nextStatus === 'unsubscribed') {
        await newsletterService.unsubscribe({ email: subscriber.email });
        setSubscribers((prev) =>
          prev.map((row) =>
            row._id === subscriber._id ? { ...row, status: 'unsubscribed' } : row,
          ),
        );
      } else {
        const res = await newsletterService.subscribe({ email: subscriber.email });
        const updated = res.data ?? { ...subscriber, status: 'active' as const };
        setSubscribers((prev) =>
          prev.map((row) => (row._id === subscriber._id ? { ...row, ...updated, status: 'active' } : row)),
        );
      }
    } catch {
      setError(
        nextStatus === 'unsubscribed'
          ? 'Failed to unsubscribe this subscriber.'
          : 'Failed to restore this subscriber.',
      );
    } finally {
      setRowActionId(null);
    }
  };

  const handleDelete = async (subscriber: NewsletterSubscriber) => {
    if (
      !window.confirm(
        `Remove ${subscriber.email} from the newsletter registry? This cannot be undone.`,
      )
    ) {
      return;
    }

    setRowActionId(subscriber._id);
    setError(null);

    try {
      await newsletterService.deleteSubscriber(subscriber._id);
      setSubscribers((prev) => prev.filter((row) => row._id !== subscriber._id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch {
      setError('Failed to delete subscriber.');
    } finally {
      setRowActionId(null);
    }
  };

  const handleCampaignSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isCampaignValid || campaignSending) return;

    if (
      activeSubscriberCount === 0 &&
      !window.confirm(
        'There are no active subscribers on record. The broadcast may not reach anyone. Continue anyway?',
      )
    ) {
      return;
    }

    if (
      activeSubscriberCount > 0 &&
      !window.confirm(
        `Send this campaign to ${activeSubscriberCount} active subscriber${activeSubscriberCount === 1 ? '' : 's'}?`,
      )
    ) {
      return;
    }

    setCampaignSending(true);
    setCampaignError(null);
    setCampaignResult(null);

    try {
      const res = await newsletterService.sendCampaign({
        subject: trimmedSubject,
        content: trimmedContent,
      });

      setCampaignResult({ message: res.message, data: res.data });
      setCampaignSubject('');
      setCampaignContent('');
    } catch {
      setCampaignError('Failed to broadcast campaign. Please try again.');
    } finally {
      setCampaignSending(false);
    }
  };

  if (loading) {
    return <LoadingFrame />;
  }

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Workspace tabs */}
      <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('subscribers')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
              activeTab === 'subscribers'
                ? 'bg-[#D8C5A4]/25 text-[#2B2B2B] border border-[#D8C5A4]/50'
                : 'text-[#888888] hover:bg-[#F8F5F0] hover:text-[#2B2B2B]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Subscribers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('campaign')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
              activeTab === 'campaign'
                ? 'bg-[#D8C5A4]/25 text-[#2B2B2B] border border-[#D8C5A4]/50'
                : 'text-[#888888] hover:bg-[#F8F5F0] hover:text-[#2B2B2B]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Campaign Composer
          </button>
        </div>
      </div>

      {activeTab === 'subscribers' && error && (
        <div role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-caption text-red-600">{error}</p>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <>
          <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-4 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,180px)_1fr] gap-3 flex-1">
                <div>
                  <label
                    htmlFor="newsletter-status-filter"
                    className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
                  >
                    Status
                  </label>
                  <select
                    id="newsletter-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="w-full rounded-xl border border-[#D8C5A4]/45 bg-white px-3 py-2.5 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4] cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="newsletter-search"
                    className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
                  >
                    Search email
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                    <input
                      id="newsletter-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by email…"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8C5A4]/45 bg-white font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40 focus:border-[#D8C5A4]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSortNewestFirst((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer"
                >
                  <ArrowDownUp className="w-3.5 h-3.5" />
                  {sortNewestFirst ? 'Newest first' : 'Oldest first'}
                </button>
                <button
                  type="button"
                  onClick={() => exportSubscribersCsv(filteredSubscribers)}
                  disabled={filteredSubscribers.length === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => void loadSubscribers()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-[#888888]">
              <Users className="w-4 h-4 text-[#A55A42]" />
              <p className="font-sans text-caption">
                {filteredSubscribers.length} of {total} subscriber{total === 1 ? '' : 's'} shown
              </p>
            </div>
          </div>

          {subscribers.length === 0 ? (
            <EmptyState message="No newsletter subscribers yet." />
          ) : filteredSubscribers.length === 0 ? (
            <EmptyState message="No subscribers match your current filters." />
          ) : (
            <div className="relative rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
              {rowActionId && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                  <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#D8C5A4]/25 bg-[#F8F5F0]">
                      <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                        Email
                      </th>
                      <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                        Registered
                      </th>
                      <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8C5A4]/20">
                    {filteredSubscribers.map((row) => {
                      const isRowBusy = rowActionId === row._id;

                      return (
                        <tr key={row._id} className="hover:bg-[#F8F5F0]/80 transition-colors">
                          <td className="px-5 py-3.5 font-sans text-sm text-[#2B2B2B] lowercase">
                            {row.email}
                          </td>
                          <td className="px-5 py-3.5 font-sans text-caption text-[#888888] whitespace-nowrap">
                            {formatDate(row.createdAt)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider ${statusTone(row.status)}`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => void handleStatusToggle(row)}
                                disabled={isRowBusy}
                                className="inline-flex items-center rounded-full border border-[#D8C5A4]/45 bg-white px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2B2B2B]/75 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D8C5A4]/40"
                              >
                                {row.status === 'active' ? 'Unsubscribe' : 'Restore'}
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(row)}
                                disabled={isRowBusy}
                                className="w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                                aria-label={`Delete ${row.email}`}
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
        </>
      )}

      {activeTab === 'campaign' && (
        <div className="space-y-4">
          <AnimatePresence>
            {campaignResult && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="status"
                className="rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-5 py-4 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
              >
                <p className="font-sans text-sm font-medium text-emerald-800">
                  {campaignResult.message}
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border border-[#D8C5A4]/35 px-4 py-3">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888]">
                      Total sent successfully
                    </p>
                    <p className="mt-1 font-display text-2xl text-emerald-700">
                      {campaignResult.data.sent}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white border border-[#D8C5A4]/35 px-4 py-3">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888]">
                      Failed deliveries
                    </p>
                    <p className="mt-1 font-display text-2xl text-[#A55A42]">
                      {campaignResult.data.failed}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCampaignResult(null);
                    setActiveTab('subscribers');
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  View subscriber roster
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {campaignError && (
            <div role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
              <p className="font-sans text-caption text-red-600">{campaignError}</p>
            </div>
          )}

          <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-6 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
            <div className="mb-6 rounded-xl border border-[#D8C5A4]/40 bg-[#D8C5A4]/12 px-4 py-3">
              <p className="font-sans text-sm text-[#2B2B2B]/85">
                <span className="font-semibold text-[#8B7355]">Broadcast reach:</span>{' '}
                This campaign will be sent to{' '}
                <span className="font-semibold text-[#A55A42]">{activeSubscriberCount}</span>{' '}
                active subscriber{activeSubscriberCount === 1 ? '' : 's'}.
              </p>
            </div>

            <form onSubmit={(e) => void handleCampaignSubmit(e)} className="space-y-5">
              <div>
                <label
                  htmlFor="campaign-subject"
                  className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888888] mb-2 block"
                >
                  Subject line <span className="text-[#A55A42]">*</span>
                </label>
                <input
                  id="campaign-subject"
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  disabled={campaignSending}
                  placeholder="Your newsletter subject…"
                  className={inputClass}
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="campaign-content"
                    className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[#888888]"
                  >
                    Content body <span className="text-[#A55A42]">*</span>
                  </label>
                  <span className="font-sans text-caption text-[#888888]">
                    {campaignContent.length}/{CONTENT_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  id="campaign-content"
                  required
                  rows={12}
                  maxLength={CONTENT_MAX_LENGTH}
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  disabled={campaignSending}
                  placeholder="Write your newsletter content here. Markdown or HTML is supported."
                  className={`${inputClass} resize-y min-h-[200px]`}
                />
              </div>

              <button
                type="submit"
                disabled={!isCampaignValid || campaignSending}
                className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-8 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-300 border ${
                  !isCampaignValid || campaignSending
                    ? 'bg-[#A55A42]/70 text-white/90 cursor-not-allowed border-transparent opacity-75'
                    : 'bg-[#A55A42] text-white hover:bg-[#8C82B6] cursor-pointer border-transparent'
                }`}
              >
                {campaignSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Broadcasting Campaign…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send campaign
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
