"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Briefcase, Send, Clock, Loader2, MapPin, Calendar, DollarSign,
  FileText, Mic, Globe, ChevronDown, CheckCircle2, X,
} from "lucide-react";

export default function TercumanTalepler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proposalForm, setProposalForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ price: "", currency: "TRY", message: "", estimatedDays: "" });
  const [sending, setSending] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests?status=OPEN");
      if (res.ok) { const d = await res.json(); setRequests(d.requests || []); }
    } catch {} finally { setLoading(false); }
  };

  const sendProposal = async (requestId: string) => {
    if (!formData.price) return;
    setSending(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, ...formData, estimatedDays: formData.estimatedDays || undefined }),
      });
      if (res.ok) {
        setSuccessId(requestId);
        setProposalForm(null);
        setFormData({ price: "", currency: "TRY", message: "", estimatedDays: "" });
        setTimeout(() => setSuccessId(null), 3000);
        await loadData();
      }
    } catch {} finally { setSending(false); }
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    WRITTEN: { label: "Yazılı Çeviri", icon: FileText, color: "bg-blue-100 text-blue-600" },
    SIMULTANEOUS: { label: "Simültane", icon: Mic, color: "bg-violet-100 text-violet-600" },
    CONSECUTIVE: { label: "Ardıl", icon: Globe, color: "bg-indigo-100 text-indigo-600" },
    LIAISON: { label: "İrtibat", icon: Globe, color: "bg-cyan-100 text-cyan-600" },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Açık Çeviri Talepleri</h1>
        <p className="text-gray-500 text-sm mt-1">Müşterilerden gelen talepleri inceleyin ve teklif gönderin.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-1">Şu anda açık talep yok</h3>
          <p className="text-sm text-gray-400">Yeni talepler geldiğinde bildirim alacaksınız.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r: any) => {
            const tc = typeConfig[r.type] || typeConfig.WRITTEN;
            const TIcon = tc.icon;
            const alreadyProposed = r.proposals?.some?.((p: any) => p.status);
            const isSuccess = successId === r.id;

            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg ${tc.color} flex items-center justify-center`}><TIcon className="w-4 h-4" /></div>
                        <h3 className="font-semibold text-gray-900">{r.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                        <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{r.sourceLanguage} → {r.targetLanguage}</span>
                        {r.field && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{r.field}</span>}
                        {r.city && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{r.city}</span>}
                        {r.deadline && <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.deadline).toLocaleDateString("tr-TR")}</span>}
                        {r.wordCount && <span>{r.wordCount} kelime</span>}
                      </div>
                      {r.description && <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>}
                      {r.budget && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                          <DollarSign className="w-3 h-3" />Bütçe: {r.budget.toString()} {r.currency}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isSuccess ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" /> Gönderildi!
                        </div>
                      ) : alreadyProposed ? (
                        <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">Teklif Verildi</span>
                      ) : (
                        <button
                          onClick={() => setProposalForm(proposalForm === r.id ? null : r.id)}
                          className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-all inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" /> Teklif Ver
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proposal Form */}
                {proposalForm === r.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm">Teklif Gönder</h4>
                      <button onClick={() => setProposalForm(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat *</label>
                        <input type="number" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} placeholder="5000" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Para Birimi</label>
                        <select value={formData.currency} onChange={(e)=>setFormData({...formData,currency:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                          <option value="TRY">₺ TRY</option><option value="USD">$ USD</option><option value="EUR">€ EUR</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Tahmini Süre (gün)</label>
                        <input type="number" value={formData.estimatedDays} onChange={(e)=>setFormData({...formData,estimatedDays:e.target.value})} placeholder="5" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Müşteriye Mesaj</label>
                      <textarea value={formData.message} onChange={(e)=>setFormData({...formData,message:e.target.value})} placeholder="Kendinizi ve yaklaşımınızı tanıtın..." rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none" />
                    </div>
                    <button onClick={()=>sendProposal(r.id)} disabled={sending||!formData.price} className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2">
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Teklifi Gönder</>}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
