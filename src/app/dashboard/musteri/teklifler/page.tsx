"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Send, CheckCircle2, Clock, XCircle, Archive,
  Calendar, Loader2, ChevronDown, DollarSign,
} from "lucide-react";

export default function MusteriTeklifler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests?myRequests=true&includeProposals=true");
      if (res.ok) { const d = await res.json(); setRequests((d.requests||[]).filter((r:any)=>!r.isArchived)); }
    } catch {} finally { setLoading(false); }
  };

  const proposalAction = async (id: string, action: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/proposals/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({action}) });
      await loadData();
    } catch {} finally { setActionLoading(null); }
  };

  const requestAction = async (id: string, action: string) => {
    try {
      await fetch(`/api/requests/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({action}) });
      await loadData();
    } catch {}
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const stColors: Record<string,string> = { PENDING:"bg-yellow-100 text-yellow-700", SENT:"bg-blue-100 text-blue-700", ACCEPTED:"bg-green-100 text-green-700", REJECTED:"bg-red-100 text-red-700", WITHDRAWN:"bg-gray-100 text-gray-500" };
  const stLabels: Record<string,string> = { PENDING:"Beklemede", SENT:"Gönderildi", ACCEPTED:"Kabul Edildi", REJECTED:"Reddedildi", WITHDRAWN:"Geri Çekildi" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gelen Teklifler</h1>
        <p className="text-gray-500 text-sm mt-1">Taleplerinize gelen tercüman tekliflerini kabul edin veya reddedin.</p>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center">
          <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-1">Henüz teklif yok</h3>
          <Link href="/talep" className="text-sm text-emerald-600 font-medium">+ Yeni Talep Oluştur</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => {
            const props = (req.proposals||[]).filter((p:any) => p.status !== "WITHDRAWN" && !p.isArchived);
            const isOpen = expanded === req.id;
            return (
              <div key={req.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div onClick={() => setExpanded(isOpen ? null : req.id)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 text-left cursor-pointer select-none" role="button" tabIndex={0}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{req.title}</h3>
                      {props.length > 0 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{props.length} teklif</span>}
                    </div>
                    <p className="text-xs text-gray-500">{req.sourceLanguage} → {req.targetLanguage}{req.field && ` • ${req.field}`}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={(e)=>{e.stopPropagation();requestAction(req.id,"archive")}} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Arşivle"><Archive className="w-4 h-4" /></button>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen?"rotate-180":""}`} />
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-gray-100">
                    {props.length === 0 ? (
                      <div className="py-8 text-center"><Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-sm text-gray-400">Henüz teklif gelmedi.</p></div>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {props.map((p: any) => (
                          <div key={p.id} className="px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 font-semibold text-sm">{(p.translator?.name||"?")[0].toUpperCase()}</div>
                                <div>
                                  <p className="font-medium text-gray-900 text-sm">{p.translator?.name || "Tercüman"}</p>
                                  <p className="text-xs text-gray-500">{p.translator?.translatorProfile?.title || "Profesyonel Tercüman"}</p>
                                  {p.message && <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">&ldquo;{p.message}&rdquo;</div>}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-gray-900">{p.price?.toString()} {p.currency}</p>
                                {p.estimatedDays && <p className="text-xs text-gray-500 flex items-center justify-end gap-1"><Calendar className="w-3 h-3" />{p.estimatedDays} gün</p>}
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${stColors[p.status]||"bg-gray-100 text-gray-500"}`}>{stLabels[p.status]||p.status}</span>
                                {(p.status==="PENDING"||p.status==="SENT") && (
                                  <div className="flex items-center gap-2 mt-3">
                                    <button onClick={()=>proposalAction(p.id,"accept")} disabled={actionLoading===p.id} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 disabled:opacity-50">{actionLoading===p.id?<Loader2 className="w-3 h-3 animate-spin"/>:"✓ Kabul Et"}</button>
                                    <button onClick={()=>proposalAction(p.id,"reject")} disabled={actionLoading===p.id} className="px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50">Reddet</button>
                                    <button onClick={()=>proposalAction(p.id,"archive")} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Arşivle"><Archive className="w-3.5 h-3.5" /></button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
