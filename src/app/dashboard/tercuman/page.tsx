"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, Send, CheckCircle2, Clock, TrendingUp,
  Bell, Loader2, ArrowUpRight, DollarSign, FileText, XCircle,
} from "lucide-react";

export default function TercumanDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqRes, propRes, notifRes] = await Promise.all([
        fetch("/api/requests?status=OPEN"),
        fetch("/api/proposals"),
        fetch("/api/notifications?unread=true"),
      ]);
      if (reqRes.ok) { const d = await reqRes.json(); setRequests(d.requests || []); }
      if (propRes.ok) { const d = await propRes.json(); setProposals(d.proposals || []); }
      if (notifRes.ok) { const d = await notifRes.json(); setNotifications(d.notifications || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const activeProps = proposals.filter((p:any) => !p.isArchived);
  const acceptedProps = activeProps.filter((p:any) => p.status === "ACCEPTED");
  const pendingProps = activeProps.filter((p:any) => p.status === "PENDING" || p.status === "SENT");

  const stColors: Record<string,{label:string;color:string;icon:any}> = {
    PENDING: {label:"Beklemede",color:"bg-yellow-100 text-yellow-700",icon:Clock},
    SENT: {label:"Gönderildi",color:"bg-blue-100 text-blue-700",icon:Send},
    ACCEPTED: {label:"Kabul Edildi",color:"bg-green-100 text-green-700",icon:CheckCircle2},
    REJECTED: {label:"Reddedildi",color:"bg-red-100 text-red-700",icon:XCircle},
  };
  const typeLabels: Record<string,string> = { WRITTEN:"Yazılı", SIMULTANEOUS:"Simültane", CONSECUTIVE:"Ardıl", LIAISON:"İrtibat" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoş geldiniz, {session?.user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Açık taleplere teklif verin ve tekliflerinizi yönetin.</p>
        </div>
        <Link href="/dashboard/tercuman/talepler" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-medium text-sm hover:bg-violet-700 transition-all shadow-sm">
          <Briefcase className="w-4 h-4" /> Açık Talepler
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {label:"Açık Talepler",value:requests.length,icon:Briefcase,color:"text-blue-600 bg-blue-50"},
          {label:"Gönderilen Teklifler",value:activeProps.length,icon:Send,color:"text-violet-600 bg-violet-50"},
          {label:"Bekleyen",value:pendingProps.length,icon:Clock,color:"text-amber-600 bg-amber-50"},
          {label:"Kabul Edilen",value:acceptedProps.length,icon:CheckCircle2,color:"text-emerald-600 bg-emerald-50"},
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}><Icon className="w-5 h-5" /></div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-violet-600" />
            <h3 className="font-semibold text-violet-900 text-sm">Yeni Bildirimler</h3>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-2 h-2 bg-violet-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Open Requests */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Açık Talepler</h2>
          <Link href="/dashboard/tercuman/talepler" className="text-sm text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-1">Tümü <ArrowUpRight className="w-3.5 h-3.5" /></Link>
        </div>
        {requests.length === 0 ? (
          <div className="py-12 text-center">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Şu anda açık talep bulunmuyor.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.slice(0, 5).map((r: any) => (
              <div key={r.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {typeLabels[r.type]||r.type} • {r.sourceLanguage} → {r.targetLanguage}
                      {r.field && ` • ${r.field}`}
                      {r.budget && ` • ${r.budget} ${r.currency}`}
                    </p>
                  </div>
                  <Link href={`/dashboard/tercuman/talepler?requestId=${r.id}`} className="text-xs text-violet-600 font-medium">Teklif Ver →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Recent Proposals */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Tekliflerim</h2>
          <Link href="/dashboard/tercuman/tekliflerim" className="text-sm text-violet-600 hover:text-violet-700 font-medium inline-flex items-center gap-1">Tümü <ArrowUpRight className="w-3.5 h-3.5" /></Link>
        </div>
        {activeProps.length === 0 ? (
          <div className="py-12 text-center">
            <Send className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Henüz teklif göndermediniz.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activeProps.slice(0, 5).map((p: any) => {
              const st = stColors[p.status] || stColors.PENDING;
              const StIcon = st.icon;
              return (
                <div key={p.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{p.request?.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{p.price?.toString()} {p.currency} • {p.request?.sourceLanguage} → {p.request?.targetLanguage}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                      <StIcon className="w-3 h-3" />{st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
