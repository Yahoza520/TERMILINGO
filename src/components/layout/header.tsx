"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown,
  Bell,
  CreditCard,
  FileText,
  Plus,
  Send,
  Building2,
  GraduationCap,
} from "lucide-react";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const userRole = (session?.user as any)?.role;
  const isLoggedIn = status === "authenticated" && !!session;

  // Tıklama dışında menü kapat
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Bildirim sayısını çek
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?unread=true");
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
        setNotifications(data.notifications || []);
      }
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleSignOut = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    signOut({ callbackUrl: "/" });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Az önce";
    if (minutes < 60) return `${minutes}dk önce`;
    if (hours < 24) return `${hours}sa önce`;
    return `${days}g önce`;
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case "TRANSLATOR": return { label: "Tercüman", color: "bg-violet-100 text-violet-700", icon: User };
      case "EMPLOYER": return { label: "İşveren", color: "bg-emerald-100 text-emerald-700", icon: Building2 };
      case "STUDENT": return { label: "Öğrenci", color: "bg-blue-100 text-blue-700", icon: GraduationCap };
      case "ADMIN": return { label: "Admin", color: "bg-red-100 text-red-700", icon: Shield };
      default: return { label: "Kullanıcı", color: "bg-gray-100 text-gray-700", icon: User };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  // Role-based dashboard link
  const getDashboardLink = () => {
    if (userRole === "EMPLOYER") return "/dashboard/musteri";
    if (userRole === "TRANSLATOR" || userRole === "STUDENT") return "/dashboard/tercuman";
    return "/dashboard/musteri";
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">TermiLingo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Pazar Yeri
            </Link>
            <Link href="/fiyatlandirma" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Fiyatlandırma
            </Link>
            {isLoggedIn && (
              <Link href={getDashboardLink()} className="font-bold text-blue-600 hover:text-blue-800 transition-colors text-sm flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Panelim
              </Link>
            )}
            
            {/* Sadece Müşteriler talep oluşturabilir */}
            {(userRole === "EMPLOYER" || !isLoggedIn) && (
              <Link
                href="/talep"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Çeviri Talebi
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      setUserMenuOpen(false);
                    }}
                    className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-500" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 text-sm">Bildirimler</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Tümünü okundu işaretle
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Bildirim yok</p>
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <div
                              key={notif.id}
                              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                !notif.isRead ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                    notif.type === "NEW_REQUEST"
                                      ? "bg-violet-100 text-violet-600"
                                      : notif.type === "PROPOSAL_SENT"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {notif.type === "NEW_REQUEST" ? (
                                    <FileText className="w-4 h-4" />
                                  ) : (
                                    <Bell className="w-4 h-4" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{notif.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{formatTime(notif.createdAt)}</p>
                                </div>
                                {!notif.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setNotifOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {(session.user?.name || "U")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 leading-tight">{session.user?.name}</p>
                      <p className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${roleBadge.color}`}>
                        {roleBadge.label}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-2 ${roleBadge.color}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleBadge.label}
                        </span>
                      </div>

                      {/* Dashboard — Role-based */}
                      <div className="py-1">
                        <Link
                          href={getDashboardLink()}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          Panelim
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 my-1" />

                      <div className="py-1">
                        {/* Sadece Tercümanlar profilini düzenleyebilir */}
                        {(userRole === "TRANSLATOR" || userRole === "STUDENT") && (
                          <Link
                            href="/profile/create"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Profilimi Düzenle
                          </Link>
                        )}
                        <Link
                          href="/fiyatlandirma"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          Abonelik
                        </Link>
                      </div>

                      {/* Admin Link */}
                      {userRole === "ADMIN" && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        </>
                      )}

                      {/* Sign Out */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Oturumu Kapat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Not Authenticated */}
                <Link
                  href="/giris"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors hidden sm:block"
                >
                  Giriş
                </Link>
                <Link
                  href="/kayit"
                  className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-all"
                >
                  Üye Ol
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="space-y-1">
              {/* User info on mobile */}
              {isLoggedIn && (
                <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${roleBadge.color}`}>
                    <RoleIcon className="w-3 h-3" />
                    {roleBadge.label}
                  </span>
                </div>
              )}

              <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg">
                Pazar Yeri
              </Link>
              <Link href="/fiyatlandirma" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg">
                Fiyatlandırma
              </Link>
              
              {(userRole === "EMPLOYER" || !isLoggedIn) && (
                <Link href="/talep" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-blue-600 font-medium hover:bg-blue-50 rounded-lg">
                  + Çeviri Talebi Oluştur
                </Link>
              )}

              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg">
                    📊 Panelim
                  </Link>
                  {(userRole === "TRANSLATOR" || userRole === "STUDENT") && (
                    <Link href="/profile/create" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg">
                      ⚙️ Profilimi Düzenle
                    </Link>
                  )}
                  {userRole === "ADMIN" && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-lg">
                      🛡️ Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-2" />
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2.5 text-red-600 font-medium hover:bg-red-50 rounded-lg"
                  >
                    🚪 Oturumu Kapat
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <Link href="/giris" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-lg">
                    Giriş Yap
                  </Link>
                  <Link href="/kayit" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 bg-zinc-900 text-white text-center font-medium rounded-lg">
                    Hesap Oluştur
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
