/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Users } from 'lucide-react';
import {
  newsletterService,
  type NewsletterSubscriber,
} from '../../api/services/newsletterService';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function LoadingFrame() {
  return (
    <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex items-center justify-center py-24 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
      <Loader2 className="w-8 h-8 text-[#A55A42] animate-spin" aria-hidden />
      <span className="sr-only">Loading newsletter subscribers</span>
    </div>
  );
}

export default function NewsletterList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [total, setTotal] = useState(0);

  const loadSubscribers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsletterService.getSubscribers({ page: 1, limit: 200 });
      setSubscribers(res.data.subscribers);
      setTotal(res.data.pagination.totalSubscribers ?? res.data.subscribers.length);
    } catch {
      setError('Failed to load newsletter subscribers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubscribers();
  }, []);

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#888888]">
          <Users className="w-4 h-4 text-[#A55A42]" />
          <p className="font-sans text-body-sm">
            {loading ? 'Loading registry…' : `${total} active subscriber${total === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadSubscribers()}
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
      ) : subscribers.length === 0 ? (
        <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl flex flex-col items-center justify-center py-16 px-6 text-center shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <Users className="w-10 h-10 text-[#2B2B2B]/20 mb-3" />
          <p className="font-sans text-body-sm text-[#888888]">No newsletter subscribers yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-[#D8C5A4]/25 bg-[#F8F5F0]">
                  <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Email
                  </th>
                  <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Registered
                  </th>
                  <th className="px-5 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888] hidden sm:table-cell">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8C5A4]/20">
                {subscribers.map((row) => (
                  <tr key={row._id} className="hover:bg-[#F8F5F0] transition-colors">
                    <td className="px-5 py-3.5 font-sans text-sm text-[#2B2B2B]">{row.email}</td>
                    <td className="px-5 py-3.5 font-sans text-caption text-[#888888]">
                      {formatDate(row.createdAt)}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider ${
                          row.status === 'active'
                            ? 'bg-emerald-500/12 text-emerald-700'
                            : 'bg-[#2B2B2B]/5 text-[#888888]'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
