"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, FileText, Send, CheckCircle2, XCircle, Loader2, CheckCheck } from "lucide-react";

export default function BildirimlerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === "unauthenticated") router.push("/giris"); }, [status, router]);
  useEffect(() => { if (session?.user?.id) loadData(); }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) { const d = await res.json(); setNotifications(d.notifications || []); }
    } catch {} finally { setLoading(false); }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({markAllRead:true}) });
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({notificationId:id}) });
      setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n));
    } catch {}
  };

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;

  const iconMap: Record<string, any> = {
    NEW_REQUEST: FileText,
    PROPOSAL_SENT: Send,
    PROPOSAL_ACCEPTED: CheckCircle2,
    PROPOSAL_REJECTED: XCircle,
    SYSTEM: Bell,
  };
  const colorMap: Record<string, string> = {
    NEW_REQUEST: "bg-violet-100 text-violet-600",
    PROPOSAL_SENT: "bg-blue-100 text-blue-600",
    PROPOSAL_ACCEPTED: "bg-green-100 text-green-600",
    PROPOSAL_REJECTED: "bg-red-100 text-red-600",
    SYSTEM: "bg-gray-100 text-gray-600",
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const dy = Math.floor(diff / 86400000);
    if (m < 1) return "Az önce"; if (m < 60) return `${m}dk önce`; if (h < 24) return `${h}sa önce`; return `${dy}g önce`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-500 text-sm mt-1">{unreadCount > 0 ? `${unreadCount} okunmamış bildirim` : "Tüm bildirimler okundu"}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <CheckCheck className="w-4 h-4" /> Tümünü Okundu İşaretle
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border py-16 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-1">Bildirim yok</h3>
          <p className="text-sm text-gray-400">Yeni bildirimler burada görünecek.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50 overflow-hidden">
          {notifications.map((n: any) => {
            const Icon = iconMap[n.type] || Bell;
            const color = colorMap[n.type] || colorMap.SYSTEM;
            return (
              <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}
                className={`px-5 py-4 flex items-start gap-4 cursor-pointer transition-colors ${!n.isRead ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-gray-50"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{n.title}</p>
                    {!n.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
