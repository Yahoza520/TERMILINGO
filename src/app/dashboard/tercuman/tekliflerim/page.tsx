"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Send, CheckCircle2, Clock, XCircle, Loader2, Archive,
  Edit3, RotateCcw, DollarSign, Calendar, X, Save,
} from "lucide-react";

export default function TercumanTekliflerim() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ price: "", message: "", estimatedDays: "" });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals");
      if (res.ok) { const d = await res.json(); setProposals(d.proposals || []); }
    } catch {} finally { setLoading(false); }
  };

  const doAction = async (id: string, action: string, data?: any) => {
    setActionLoading(id);
    try {
      await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...data }),
      });
      await loadData();
      setEditId(null);
    } catch {} finally { setActionLoading(null); }
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const stConfig: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: "Beklemede", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    SENT: { label: "Gönderildi", color: "bg-blue-100 text-blue-700", icon: Send },
    ACCEPTED: { label: "Kabul Edildi", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    REJECTED: { label: "Reddedildi", color: "bg-red-100 text-red-700", icon: XCircle },
    WITHDRAWN: { label: "Geri Çekildi", color: "bg-gray-100 text-gray-500", icon: RotateCcw },
  };

  const filtered = proposals.filter((p: any) => {
    if (filter === "active") return !p.isArchived && (p.status === "PENDING" || p.status === "SENT");
    if (filter === "accepted") return p.status === "ACCEPTED";
    if (filter === "rejected") return p.status === "REJECTED" || p.status === "WITHDRAWN";
    return !p.isArchived;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tekliflerim</h1>
          <p className="text-gray-500 text-sm mt-1">Gönderdiğiniz teklifleri düzenleyin, geri çekin veya arşivleyin.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Tümü" },
          { key: "active", label: "Aktif" },
          { key: "accepted", label: "Kabul Edilen" },
          { key: "rejected", label: "Reddedilen" },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Bu kategoride teklif yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p: any) => {
            const st = stConfig[p.status] || stConfig.PENDING;
            const StIcon = st.icon;
            const isEditing = editId === p.id;
            const canEdit = p.status === "PENDING" || p.status === "SENT";

            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm">{p.request?.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.request?.sourceLanguage} → {p.request?.targetLanguage}
                        {p.request?.field && ` • ${p.request.field}`}
                        {p.request?.clientName && ` • Müşteri: ${p.request.clientName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{p.price?.toString()} {p.currency}</p>
                        {p.estimatedDays && <p className="text-xs text-gray-500">{p.estimatedDays} gün</p>}
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${st.color}`}>
                        <StIcon className="w-3 h-3" />{st.label}
                      </span>
                    </div>
                  </div>

                  {p.message && !isEditing && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                      &ldquo;{p.message}&rdquo;
                    </div>
                  )}

                  {/* Actions */}
                  {canEdit && !isEditing && (
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => { setEditId(p.id); setEditData({ price: p.price?.toString() || "", message: p.message || "", estimatedDays: p.estimatedDays?.toString() || "" }); }}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 inline-flex items-center gap-1.5">
                        <Edit3 className="w-3 h-3" /> Düzenle
                      </button>
                      <button onClick={() => doAction(p.id, "withdraw")} disabled={actionLoading === p.id}
                        className="px-3 py-1.5 bg-white border border-orange-200 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-50 inline-flex items-center gap-1.5 disabled:opacity-50">
                        <RotateCcw className="w-3 h-3" /> Geri Çek
                      </button>
                      <button onClick={() => doAction(p.id, "archive")}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Arşivle">
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Edit form */}
                  {isEditing && (
                    <div className="mt-3 bg-violet-50 rounded-lg p-4 border border-violet-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-violet-900 text-sm">Teklifi Düzenle</h4>
                        <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat</label>
                          <input type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Süre (gün)</label>
                          <input type="number" value={editData.estimatedDays} onChange={(e) => setEditData({ ...editData, estimatedDays: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500" />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Mesaj</label>
                        <textarea value={editData.message} onChange={(e) => setEditData({ ...editData, message: e.target.value })}
                          rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
                      </div>
                      <button onClick={() => doAction(p.id, "edit", editData)} disabled={actionLoading === p.id}
                        className="w-full py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 disabled:opacity-50 inline-flex items-center justify-center gap-2">
                        {actionLoading === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Kaydet</>}
                      </button>
                    </div>
                  )}

                  {!canEdit && !p.isArchived && (
                    <div className="mt-3">
                      <button onClick={() => doAction(p.id, "archive")}
                        className="px-3 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs font-medium hover:bg-gray-50 inline-flex items-center gap-1.5">
                        <Archive className="w-3 h-3" /> Arşivle
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
