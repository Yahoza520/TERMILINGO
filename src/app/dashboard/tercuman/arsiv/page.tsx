"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Archive, RotateCcw, Loader2, Send } from "lucide-react";

export default function TercumanArsiv() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proposals?archived=true");
      if (res.ok) { const d = await res.json(); setProposals((d.proposals||[]).filter((p:any)=>p.isArchived)); }
    } catch {} finally { setLoading(false); }
  };

  const unarchive = async (id: string) => {
    try {
      // Arşivden çıkarmak için teklifi güncelle
      await fetch(`/api/proposals/${id}`, { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({action:"unarchive"}) });
      await loadData();
    } catch {}
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Arşiv</h1>
        <p className="text-gray-500 text-sm mt-1">Arşivlediğiniz teklifleriniz burada görüntülenir.</p>
      </div>

      {proposals.length === 0 ? (
        <div className="bg-white rounded-xl border py-16 text-center">
          <Archive className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-1">Arşiv boş</h3>
          <p className="text-sm text-gray-400">Arşivlediğiniz teklifler burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p: any) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 px-5 py-4 opacity-75 hover:opacity-100 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{p.request?.title || "Teklif"}</h3>
                  <p className="text-xs text-gray-500">{p.price?.toString()} {p.currency} • {p.request?.sourceLanguage} → {p.request?.targetLanguage}</p>
                </div>
                <button onClick={() => unarchive(p.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 inline-flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3" /> Geri Al
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
