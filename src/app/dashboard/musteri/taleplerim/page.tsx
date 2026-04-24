"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Clock, CheckCircle2, XCircle, Send, Loader2, Plus, Archive } from "lucide-react";

export default function MusteriTaleplerim() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests?myRequests=true");
      if (res.ok) { const d = await res.json(); setRequests((d.requests||[]).filter((r:any)=>!r.isArchived)); }
    } catch {} finally { setLoading(false); }
  };

  const doAction = async (id: string, action: string) => {
    try {
      await fetch(`/api/requests/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({action}) });
      await loadData();
    } catch {}
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const stConfig: Record<string,{label:string;color:string;icon:any}> = {
    OPEN:{label:"Açık",color:"bg-green-100 text-green-700",icon:Clock},
    IN_REVIEW:{label:"İnceleniyor",color:"bg-blue-100 text-blue-700",icon:Send},
    ASSIGNED:{label:"Atandı",color:"bg-violet-100 text-violet-700",icon:CheckCircle2},
    COMPLETED:{label:"Tamamlandı",color:"bg-emerald-100 text-emerald-700",icon:CheckCircle2},
    CANCELLED:{label:"İptal",color:"bg-red-100 text-red-700",icon:XCircle},
  };
  const typeLabels: Record<string,string> = {WRITTEN:"Yazılı",SIMULTANEOUS:"Simültane",CONSECUTIVE:"Ardıl",LIAISON:"İrtibat"};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold text-gray-900">Taleplerim</h1><p className="text-gray-500 text-sm mt-1">Oluşturduğunuz çeviri taleplerini yönetin.</p></div>
        <Link href="/talep" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-all"><Plus className="w-4 h-4" />Yeni Talep</Link>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border py-16 text-center"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-sm text-gray-400">Henüz talebiniz yok.</p></div>
      ) : (
        <div className="space-y-3">
          {requests.map((r:any) => {
            const st = stConfig[r.status]||stConfig.OPEN;
            const StIcon = st.icon;
            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-sm">{r.title}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}><StIcon className="w-3 h-3" />{st.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {typeLabels[r.type]||r.type} • {r.sourceLanguage} → {r.targetLanguage}
                      {r.field && ` • ${r.field}`}
                      • {r._count?.proposals || 0} teklif
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link href={`/dashboard/musteri/teklifler?requestId=${r.id}`} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100">Teklifleri Gör</Link>
                    {(r.status==="OPEN"||r.status==="IN_REVIEW") && <button onClick={()=>doAction(r.id,"cancel")} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50">İptal</button>}
                    <button onClick={()=>doAction(r.id,"archive")} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Arşivle"><Archive className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
