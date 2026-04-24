"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  ArrowUpRight,
  Loader2,
  Archive,
  Bell,
  TrendingUp,
} from "lucide-react";

// ===========================================
// MÜŞTERİ PANELİ — GENEL BAKIŞ
// ===========================================

export default function MusteriDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    totalProposals: 0,
    acceptedProposals: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/giris");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Müşterinin talepleri
      const reqRes = await fetch("/api/requests?myRequests=true");
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData.requests || []);

        const reqs = reqData.requests || [];
        const openReqs = reqs.filter((r: any) => r.status === "OPEN" || r.status === "IN_REVIEW");
        const totalProps = reqs.reduce((sum: number, r: any) => sum + (r._count?.proposals || 0), 0);
        const acceptedProps = reqs.reduce(
          (sum: number, r: any) =>
            sum + (r.proposals?.filter((p: any) => p.status === "ACCEPTED").length || 0),
          0
        );

        setStats({
          totalRequests: reqs.length,
          openRequests: openReqs.length,
          totalProposals: totalProps,
          acceptedProposals: acceptedProps,
        });
      }

      // Bildirimler
      const notifRes = await fetch("/api/notifications?unread=true");
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    OPEN: { label: "Açık", color: "bg-green-100 text-green-700", icon: Clock },
    IN_REVIEW: { label: "Teklifler Geldi", color: "bg-blue-100 text-blue-700", icon: Send },
    ASSIGNED: { label: "Atandı", color: "bg-violet-100 text-violet-700", icon: CheckCircle2 },
    COMPLETED: { label: "Tamamlandı", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    CANCELLED: { label: "İptal", color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const typeLabels: Record<string, string> = {
    WRITTEN: "Yazılı",
    SIMULTANEOUS: "Simültane",
    CONSECUTIVE: "Ardıl",
    LIAISON: "İrtibat",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hoş geldiniz, {session?.user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Çeviri taleplerinizi ve gelen teklifleri yönetin.
          </p>
        </div>
        <Link
          href="/talep"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm hover:bg-emerald-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Yeni Talep
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Talep", value: stats.totalRequests, icon: FileText, color: "text-blue-600 bg-blue-50" },
          { label: "Açık Talepler", value: stats.openRequests, icon: Clock, color: "text-emerald-600 bg-emerald-50" },
          { label: "Gelen Teklifler", value: stats.totalProposals, icon: Send, color: "text-violet-600 bg-violet-50" },
          { label: "Kabul Edilen", value: stats.acceptedProposals, icon: CheckCircle2, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-blue-900 text-sm">Yeni Bildirimler</h3>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif: any) => (
              <div key={notif.id} className="flex items-start gap-3 bg-white/70 rounded-lg p-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Requests */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Son Talepler</h2>
          <Link
            href="/dashboard/musteri/taleplerim"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
          >
            Tümünü Gör <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-600 mb-1">Henüz talebiniz yok</h3>
            <p className="text-xs text-gray-400 mb-4">
              İlk çeviri talebinizi oluşturun, tercümanlardan teklif alsın.
            </p>
            <Link
              href="/talep"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              + Yeni Talep Oluştur
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {requests.slice(0, 5).map((req: any) => {
              const st = statusConfig[req.status] || statusConfig.OPEN;
              const StIcon = st.icon;
              return (
                <div key={req.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{req.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          <StIcon className="w-3 h-3" />
                          {st.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{typeLabels[req.type] || req.type}</span>
                        <span>•</span>
                        <span>{req.sourceLanguage} → {req.targetLanguage}</span>
                        {req.field && (<><span>•</span><span>{req.field}</span></>)}
                        <span>•</span>
                        <span>{req._count?.proposals || 0} teklif</span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/musteri/teklifler?requestId=${req.id}`}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium whitespace-nowrap ml-4"
                    >
                      Teklifleri Gör →
                    </Link>
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
