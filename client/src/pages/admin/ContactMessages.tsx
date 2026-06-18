/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowDownUp,
  Loader2,
  MailOpen,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import {
  contactService,
  type Contact,
  type ContactStatus,
} from '../../api/services/contactService';
import { formatContactService } from '../../data/contactServices';
import { useAdminLayout } from './DashboardLayout';

const STATUS_OPTIONS: { value: ContactStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

type StatusFilter = ContactStatus | 'all';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function statusLabel(status: ContactStatus) {
  const map: Record<ContactStatus, string> = {
    new: 'New',
    contacted: 'Contacted',
    in_progress: 'In Progress',
    completed: 'Completed',
  };
  return map[status];
}

function statusTone(status: ContactStatus) {
  const map: Record<ContactStatus, string> = {
    new: 'bg-[#D8C5A4]/25 text-[#8B7355] border border-[#D8C5A4]/50',
    contacted: 'bg-[#8C82B6]/12 text-[#5B4A8A] border border-[#8C82B6]/25',
    in_progress: 'bg-amber-500/12 text-amber-700 border border-amber-500/20',
    completed: 'bg-emerald-500/12 text-emerald-700 border border-emerald-500/20',
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
      <MailOpen className="w-10 h-10 text-[#2B2B2B]/20 mb-3" />
      <p className="font-sans text-body-sm text-[#888888]">{message}</p>
    </div>
  );
}

interface MessageModalProps {
  contact: Contact | null;
  onClose: () => void;
}

function MessageModal({ contact, onClose }: MessageModalProps) {
  return (
    <AnimatePresence>
      {contact && (
        <motion.div
          key="message-modal"
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
            aria-labelledby="message-modal-title"
            className="w-full max-w-lg rounded-2xl border border-[#D8C5A4]/45 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#D8C5A4]/25">
              <div className="min-w-0">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#888888]">
                  Full message
                </p>
                <h2 id="message-modal-title" className="font-display text-lg text-[#2B2B2B] truncate">
                  {contact.name}
                </h2>
                <p className="font-sans text-caption text-[#888888] truncate">
                  {formatContactService(contact.service)} · {contact.email}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-9 h-9 rounded-xl hover:bg-[#2B2B2B]/5 flex items-center justify-center cursor-pointer"
                aria-label="Close message"
              >
                <X className="w-4 h-4 text-[#2B2B2B]/70" />
              </button>
            </div>
            <div className="px-5 py-4 max-h-[min(60vh,420px)] overflow-y-auto">
              <p className="font-sans text-body-sm text-[#2B2B2B]/85 leading-relaxed whitespace-pre-wrap">
                {contact.message || 'No message body.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ContactMessages() {
  const { refreshSidebarCounts } = useAdminLayout();

  const [loading, setLoading] = useState(true);
  const [rowActionId, setRowActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [expandedContact, setExpandedContact] = useState<Contact | null>(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactService.getContacts({ page: 1, limit: 200 });
      setContacts(res.data.contacts);
    } catch {
      setError('Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const filteredContacts = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    let result = contacts.filter((contact) => {
      if (statusFilter !== 'all' && contact.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = [
        contact.name,
        contact.email,
        contact.message,
        contact.phone,
        formatContactService(contact.service),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    result = [...result].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortNewestFirst ? bTime - aTime : aTime - bTime;
    });

    return result;
  }, [contacts, statusFilter, debouncedSearchQuery, sortNewestFirst]);

  const handleStatusChange = async (id: string, nextStatus: ContactStatus) => {
    const current = contacts.find((c) => c._id === id);
    if (!current || current.status === nextStatus) return;

    setRowActionId(id);
    setError(null);
    try {
      const res = await contactService.updateContact(id, { status: nextStatus });
      setContacts((prev) => prev.map((c) => (c._id === id ? res.data : c)));
      await refreshSidebarCounts();
    } catch {
      setError('Failed to update message status.');
    } finally {
      setRowActionId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete the message from ${name}? This cannot be undone.`)) return;

    setRowActionId(id);
    setError(null);
    try {
      await contactService.deleteContact(id);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      await refreshSidebarCounts();
    } catch {
      setError('Failed to delete message.');
    } finally {
      setRowActionId(null);
    }
  };

  if (loading) {
    return <LoadingFrame label="Loading contact messages" />;
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {error && (
        <div role="alert" className="rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
          <p className="font-sans text-caption text-red-600">{error}</p>
        </div>
      )}

      {/* Controls panel */}
      <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl p-4 shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,180px)_1fr_auto] gap-3">
          <div>
            <label
              htmlFor="status-filter"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full rounded-xl border border-[#D8C5A4]/45 bg-white px-3 py-2.5 font-sans text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#8C82B6]/10 focus:border-[#8C82B6]/55 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="contact-search"
              className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#888888] mb-1.5 block"
            >
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                id="contact-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, email, or message…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8C5A4]/45 bg-white font-sans text-sm text-[#2B2B2B] placeholder:text-[#2B2B2B]/30 focus:outline-none focus:ring-2 focus:ring-[#8C82B6]/10 focus:border-[#8C82B6]/55"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setSortNewestFirst((prev) => !prev)}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/80 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer"
            >
              <ArrowDownUp className="w-3.5 h-3.5" />
              {sortNewestFirst ? 'Newest first' : 'Oldest first'}
            </button>
          </div>
        </div>

        <p className="mt-3 font-sans text-caption text-[#888888]">
          {filteredContacts.length} of {contacts.length} message{contacts.length === 1 ? '' : 's'}
        </p>
      </div>

      {contacts.length === 0 ? (
        <EmptyState message="No contact messages yet. Submissions from the website will appear here." />
      ) : filteredContacts.length === 0 ? (
        <EmptyState message="No messages match your current filters. Try adjusting search or status." />
      ) : (
        <div className="rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px]">
              <thead>
                <tr className="border-b border-[#D8C5A4]/25 bg-[#F8F5F0]">
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Client
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Phone
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Service
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Message
                  </th>
                  <th className="px-4 py-3.5 text-left font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
                    Received
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
                {filteredContacts.map((contact) => {
                  const isRowBusy = rowActionId === contact._id;

                  return (
                    <tr key={contact._id} className="hover:bg-[#F8F5F0]/80 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-sans text-sm font-medium text-[#2B2B2B]">
                          {contact.name || 'Unknown'}
                        </p>
                        <p className="font-sans text-caption text-[#888888] lowercase">
                          {contact.email}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 font-sans text-sm text-[#2B2B2B]/80 whitespace-nowrap">
                        {contact.phone || '—'}
                      </td>
                      <td className="px-4 py-3.5 font-sans text-sm text-[#2B2B2B]/80 whitespace-nowrap max-w-[180px]">
                        <span className="block truncate" title={formatContactService(contact.service)}>
                          {contact.service ? formatContactService(contact.service) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedContact(contact)}
                          className="w-full text-left font-sans text-sm text-[#2B2B2B]/75 truncate max-w-xs hover:text-[#A55A42] transition-colors cursor-pointer"
                          title="View full message"
                        >
                          {contact.message || '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3.5 font-sans text-caption text-[#888888] whitespace-nowrap">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold uppercase tracking-wider ${statusTone(contact.status)}`}
                        >
                          {statusLabel(contact.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={contact.status}
                            disabled={isRowBusy}
                            onChange={(e) =>
                              void handleStatusChange(
                                contact._id,
                                e.target.value as ContactStatus,
                              )
                            }
                            className="rounded-lg border border-[#D8C5A4]/45 bg-white px-2 py-1.5 font-sans text-xs text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#8C82B6]/10 focus:border-[#8C82B6]/55 cursor-pointer disabled:opacity-50"
                            aria-label={`Update status for ${contact.name}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleDelete(contact._id, contact.name)}
                            disabled={isRowBusy}
                            className="w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                            aria-label={`Delete message from ${contact.name}`}
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

      <MessageModal contact={expandedContact} onClose={() => setExpandedContact(null)} />
    </div>
  );
}
