/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MailOpen,
  Trash2,
} from 'lucide-react';
import {
  contactService,
  type Contact,
  type ContactStatus,
} from '../../api/services/contactService';
import { useAdminLayout } from './DashboardLayout';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function statusLabel(status: ContactStatus) {
  const map: Record<ContactStatus, string> = {
    new: 'New',
    contacted: 'Read',
    in_progress: 'In Progress',
    completed: 'Resolved',
  };
  return map[status];
}

function statusTone(status: ContactStatus) {
  const map: Record<ContactStatus, string> = {
    new: 'bg-[#A55A42]/10 text-[#A55A42]',
    contacted: 'bg-[#8C82B6]/12 text-[#5B4A8A]',
    in_progress: 'bg-amber-500/12 text-amber-700',
    completed: 'bg-emerald-500/12 text-emerald-700',
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

export default function ContactMessages() {
  const { refreshSidebarCounts } = useAdminLayout();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = contacts.find((c) => c._id === selectedId) ?? null;

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await contactService.getContacts({ page: 1, limit: 100 });
      const list = res.data.contacts;
      setContacts(list);
      setSelectedId((prev) => {
        if (prev && list.some((c) => c._id === prev)) return prev;
        const desktop = window.matchMedia('(min-width: 1024px)').matches;
        return desktop ? (list[0]?._id ?? null) : null;
      });
    } catch {
      setError('Failed to load contact messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  const handleMarkRead = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await contactService.updateContact(selected._id, { status: 'contacted' });
      setContacts((prev) =>
        prev.map((c) => (c._id === selected._id ? res.data : c)),
      );
      await refreshSidebarCounts();
    } catch {
      setError('Failed to update message status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await contactService.updateContact(selected._id, { status: 'completed' });
      setContacts((prev) =>
        prev.map((c) => (c._id === selected._id ? res.data : c)),
      );
      await refreshSidebarCounts();
    } catch {
      setError('Failed to resolve message.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm('Delete this contact message permanently?')) return;

    setActionLoading(true);
    try {
      await contactService.deleteContact(selected._id);
      const remaining = contacts.filter((c) => c._id !== selected._id);
      setContacts(remaining);
      setSelectedId(remaining[0]?._id ?? null);
      await refreshSidebarCounts();
    } catch {
      setError('Failed to delete message.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingFrame label="Loading contact messages" />;
  }

  if (!contacts.length) {
    return (
      <div className="max-w-4xl">
        {error && (
          <div role="alert" className="mb-4 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3">
            <p className="font-sans text-caption text-red-600">{error}</p>
          </div>
        )}
        <EmptyState message="No contact messages yet. Submissions from the website will appear here." />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5.5rem)] md:h-[calc(100vh-6rem)] flex flex-col">
      {error && (
        <div role="alert" className="mb-4 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3 shrink-0">
          <p className="font-sans text-caption text-red-600">{error}</p>
        </div>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-4">
        {/* Inbox list */}
        <div
          className={`rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden flex flex-col min-h-0 shadow-[0_10px_28px_rgba(0,0,0,0.06)] ${
            selectedId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <div className="px-4 py-3 border-b border-[#D8C5A4]/25 shrink-0">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888888]">
              Inbox · {contacts.length}
            </p>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-[#D8C5A4]/20">
            {contacts.map((contact) => {
              const isActive = contact._id === selectedId;
              return (
                <li key={contact._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(contact._id)}
                    className={`w-full text-left px-4 py-3.5 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#D8C5A4]/18 border-l-2 border-[#D8C5A4]'
                        : 'hover:bg-[#F8F5F0] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans text-sm font-medium text-[#2B2B2B] truncate">
                        {contact.fullName || 'Unknown'}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold ${statusTone(contact.status)}`}
                      >
                        {statusLabel(contact.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 font-sans text-caption text-[#888888] truncate">
                      {contact.email}
                    </p>
                    <p className="mt-1 font-sans text-[11px] text-[#2B2B2B]/50 line-clamp-1">
                      {contact.help || contact.subject}
                    </p>
                    <p className="mt-1 font-sans text-[10px] text-[#888888]">
                      {formatDate(contact.createdAt)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Detail inspector */}
        <div
          className={`rounded-2xl border border-[#D8C5A4]/40 bg-white/85 backdrop-blur-xl overflow-hidden flex flex-col min-h-0 shadow-[0_10px_28px_rgba(0,0,0,0.06)] ${
            selectedId ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {selected ? (
            <>
              <div className="px-4 sm:px-6 py-4 border-b border-[#D8C5A4]/25 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden w-9 h-9 rounded-xl border border-[#D8C5A4]/40 bg-white flex items-center justify-center cursor-pointer"
                  aria-label="Back to inbox"
                >
                  <ArrowLeft className="w-4 h-4 text-[#2B2B2B]" />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg text-[#2B2B2B] truncate">
                    {selected.fullName}
                  </h2>
                  <p className="font-sans text-caption text-[#888888] truncate">{selected.email}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold ${statusTone(selected.status)}`}
                >
                  {statusLabel(selected.status)}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-[#F8F5F0] border border-[#D8C5A4]/35 px-4 py-3">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888]">Phone</p>
                    <p className="mt-1 font-sans text-sm text-[#2B2B2B]/80">{selected.phone || '—'}</p>
                  </div>
                  <div className="rounded-xl bg-[#F8F5F0] border border-[#D8C5A4]/35 px-4 py-3">
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888]">Received</p>
                    <p className="mt-1 font-sans text-sm text-[#2B2B2B]/80">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                {selected.subject && (
                  <div>
                    <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">Subject</p>
                    <p className="font-sans text-sm text-[#2B2B2B]/80">{selected.subject}</p>
                  </div>
                )}

                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-[#888888] mb-1.5">Message</p>
                  <div className="rounded-xl bg-[#F8F5F0] border border-[#D8C5A4]/35 px-4 py-4">
                    <p className="font-sans text-body-sm text-[#2B2B2B]/80 leading-relaxed whitespace-pre-wrap">
                      {selected.help || 'No message body.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-6 py-4 border-t border-[#D8C5A4]/25 flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => void handleMarkRead()}
                  disabled={actionLoading || selected.status === 'contacted' || selected.status === 'completed'}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D8C5A4]/45 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#2B2B2B]/75 hover:bg-[#F8F5F0] hover:text-[#A55A42] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <MailOpen className="w-3.5 h-3.5" />
                  )}
                  Mark Read
                </button>
                <button
                  type="button"
                  onClick={() => void handleMarkResolved()}
                  disabled={actionLoading || selected.status === 'completed'}
                  className="inline-flex items-center gap-2 rounded-full border border-[#8C82B6]/35 bg-[#8C82B6]/10 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#5B4A8A] hover:bg-[#8C82B6]/15 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Mark Resolved
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50 ml-auto"
                >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="font-sans text-body-sm text-[#888888]">Select a message to inspect</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
