"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Send, Archive, Bell, Settings,
  CreditCard, ChevronRight, Users, Briefcase, Menu, X,
} from "lucide-react";

const MUSTERI_LINKS = [
  { href: "/dashboard/musteri", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/musteri/taleplerim", label: "Taleplerim", icon: FileText },
  { href: "/dashboard/musteri/teklifler", label: "Gelen Teklifler", icon: Send },
  { href: "/dashboard/musteri/arsiv", label: "Arşiv", icon: Archive },
];

const TERCUMAN_LINKS = [
  { href: "/dashboard/tercuman", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/dashboard/tercuman/talepler", label: "Açık Talepler", icon: Briefcase },
  { href: "/dashboard/tercuman/tekliflerim", label: "Tekliflerim", icon: Send },
  { href: "/dashboard/tercuman/arsiv", label: "Arşiv", icon: Archive },
];

const COMMON_LINKS = [
  { href: "/dashboard/bildirimler", label: "Bildirimler", icon: Bell },
  { href: "/fiyatlandirma", label: "Abonelik", icon: CreditCard },
  { href: "/profile/create", label: "Profil Ayarları", icon: Settings },
];

function SidebarContent({
  roleLinks,
  isMusteriPanel,
  isTercumanPanel,
  pathname,
  session,
  onNavigate,
}: any) {
  const panelTitle = isMusteriPanel ? "Müşteri Paneli" : "Tercüman Paneli";
  const PanelIcon = isMusteriPanel ? Users : Briefcase;

  return (
    <>
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isMusteriPanel ? "bg-emerald-100 text-emerald-600" : "bg-violet-100 text-violet-600"
          }`}>
            <PanelIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{panelTitle}</p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.name || session?.user?.email}
            </p>
          </div>
        </div>

        {/* Panel Switcher — role'e göre gösterilir */}
        {(() => {
          const role = session?.user?.role as string | undefined;
          const showMusteri = role === "EMPLOYER" || role === "ADMIN";
          const showTercuman = role === "TRANSLATOR" || role === "STUDENT" || role === "ADMIN";
          if (!showMusteri && !showTercuman) return null;
          return (
            <div className="mt-3 flex gap-1">
              {showMusteri && (
                <Link href="/dashboard/musteri" onClick={onNavigate}
                  className={`flex-1 text-center py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isMusteriPanel ? "bg-emerald-50 text-emerald-700" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}>Müşteri</Link>
              )}
              {showTercuman && (
                <Link href="/dashboard/tercuman" onClick={onNavigate}
                  className={`flex-1 text-center py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isTercumanPanel ? "bg-violet-50 text-violet-700" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}>Tercüman</Link>
              )}
            </div>
          );
        })()}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {roleLinks.map((link: any) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? isMusteriPanel ? "bg-emerald-50 text-emerald-700 font-medium" : "bg-violet-50 text-violet-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}>
              <Icon className="w-4 h-4" />
              {link.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}

        <div className="border-t border-gray-100 my-3" />

        {COMMON_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isMusteriPanel = pathname.startsWith("/dashboard/musteri");
  const isTercumanPanel = pathname.startsWith("/dashboard/tercuman");
  const roleLinks = isMusteriPanel ? MUSTERI_LINKS : TERCUMAN_LINKS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {isMusteriPanel ? "Müşteri Paneli" : "Tercüman Paneli"}
        </span>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          <SidebarContent
            roleLinks={roleLinks}
            isMusteriPanel={isMusteriPanel}
            isTercumanPanel={isTercumanPanel}
            pathname={pathname}
            session={session}
            onNavigate={() => {}}
          />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
              {/* Close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="font-bold text-gray-900">TermiLingo</span>
                </div>
                <button onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <SidebarContent
                roleLinks={roleLinks}
                isMusteriPanel={isMusteriPanel}
                isTercumanPanel={isTercumanPanel}
                pathname={pathname}
                session={session}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
