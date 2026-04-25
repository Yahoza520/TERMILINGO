"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, Users, FileText, Send, BarChart3, Settings,
  Loader2, Search, ChevronDown, Mail, Ban, CheckCircle2,
  AlertTriangle, RefreshCw, ArrowLeft,
} from "lucide-react";

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/giris");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") loadData();
  }, [session]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, requestsRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/requests"),
        fetch("/api/admin/stats"),
      ]);
      if (usersRes.ok) setUsers(await usersRes.json());
      if (requestsRes.ok) setRequests(await requestsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch {} finally { setLoading(false); }
  };

  const updateUserRole = async (userId: string, role: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    await loadData();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (session?.user?.role !== "ADMIN") return null;

  const roleColors: Record<string, string> = {
    TRANSLATOR: "bg-violet-500/20 text-violet-400",
    EMPLOYER: "bg-blue-500/20 text-blue-400",
    STUDENT: "bg-emerald-500/20 text-emerald-400",
    ADMIN: "bg-red-500/20 text-red-400",
  };

  const roleLabels: Record<string, string> = {
    TRANSLATOR: "Tercüman",
    EMPLOYER: "İşveren",
    STUDENT: "Öğrenci",
    ADMIN: "Admin",
  };

  const filteredUsers = users.filter((u: any) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Genel Bakış", icon: BarChart3 },
    { id: "users", label: "Kullanıcılar", icon: Users },
    { id: "requests", label: "Talepler", icon: FileText },
    { id: "settings", label: "Ayarlar", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-md">TermiLingo</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-zinc-400" />
            </button>
            <Link href="/" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Siteye Dön
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-zinc-900 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview */}
        {activeTab === "overview" && stats && (
          <div>
            <h2 className="text-xl font-bold mb-6">Platform İstatistikleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Toplam Kullanıcı", value: stats.totalUsers, icon: Users, color: "from-blue-600 to-blue-800" },
                { label: "Tercümanlar", value: stats.translators, icon: Users, color: "from-violet-600 to-violet-800" },
                { label: "Açık Talepler", value: stats.openRequests, icon: FileText, color: "from-emerald-600 to-emerald-800" },
                { label: "Toplam Teklifler", value: stats.totalProposals, icon: Send, color: "from-amber-600 to-amber-800" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stat.value || 0}</p>
                    <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Son kayıtlar */}
            <h3 className="text-lg font-semibold mb-4">Son Kayıt Olan Kullanıcılar</h3>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              {users.slice(0, 5).map((u: any) => (
                <div key={u.id} className="px-5 py-3 flex items-center justify-between border-b border-zinc-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                      {(u.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                      {roleLabels[u.role]}
                    </span>
                    {u.emailVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Kullanıcılar ({users.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="İsim veya email ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 w-64"
                />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Kullanıcı</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Rol</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Doğrulama</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Kayıt</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-zinc-500 uppercase">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u: any) => (
                    <tr key={u.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                            {(u.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name || "-"}</p>
                            <p className="text-xs text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white"
                        >
                          <option value="TRANSLATOR">Tercüman</option>
                          <option value="EMPLOYER">İşveren</option>
                          <option value="STUDENT">Öğrenci</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        {u.emailVerified ? (
                          <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Doğrulandı</span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-400 text-xs"><AlertTriangle className="w-3.5 h-3.5" /> Bekliyor</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-zinc-500">
                        {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-400" title="Mail Gönder">
                          <Mail className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Talepler ({requests.length})</h2>
            <div className="space-y-3">
              {requests.map((r: any) => (
                <div key={r.id} className="bg-zinc-900 rounded-xl border border-zinc-800 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{r.title}</h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        {r.sourceLanguage} → {r.targetLanguage} • {r.clientName} • {r._count?.proposals || 0} teklif
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "OPEN" ? "bg-green-500/20 text-green-400" :
                      r.status === "COMPLETED" ? "bg-blue-500/20 text-blue-400" :
                      "bg-zinc-700 text-zinc-400"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-12 text-zinc-500">Henüz talep yok.</div>
              )}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Platform Ayarları</h2>
            <div className="space-y-4">
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h3 className="font-medium mb-4">SMTP Email Durumu</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-400">Host: <span className="text-white">{process.env.NEXT_PUBLIC_SMTP_HOST || "Ayarlanmadı"}</span></p>
                  <p className="text-zinc-400">Gönderen: <span className="text-white">{process.env.NEXT_PUBLIC_SMTP_USER || "Ayarlanmadı"}</span></p>
                </div>
              </div>
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h3 className="font-medium mb-4">Veritabanı</h3>
                <p className="text-sm text-zinc-400">PostgreSQL bağlantısı aktif</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
