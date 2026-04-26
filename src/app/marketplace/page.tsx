"use client";

import { useState, useMemo, useEffect } from "react";
import TranslatorCard from "@/components/marketplace/translator-card";
import QuickView from "@/components/marketplace/quick-view";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Filter,
  PenTool,
  Mic,
  GraduationCap,
  Loader2
} from "lucide-react";

// ===========================================
// MARKETPLACE SAYFASI
// Isverenlerin tercuman aradigi ana sayfa.
// Yazili / Sozlu / Ogrenci sekmeleri,
// Konum filtreleme, terminoloji on izleme.
// ===========================================

type TabType = "all" | "written" | "interpreter" | "student";

const CITIES = ["Tümü", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];

export default function MarketplacePage() {
  const [translators, setTranslators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tümü");
  const [quickViewTranslator, setQuickViewTranslator] = useState<any | null>(null);

  // Verileri API'den cek
  useEffect(() => {
    async function fetchTranslators() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/translators");
        const data = await res.json();
        if (res.ok) {
          setTranslators(data.translators || []);
        }
      } catch (error) {
        console.error("Tercumanlar yuklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTranslators();
  }, []);

  // Filtreleme mantigi
  const filteredTranslators = useMemo(() => {
    return translators.filter((t) => {
      // Sekme filtresi
      if (activeTab === "written" && t.interpreterTypes?.length > 0 && !t.wordRate) return false;
      if (activeTab === "interpreter" && (!t.interpreterTypes || t.interpreterTypes.length === 0)) return false;
      if (activeTab === "student" && t.tier !== "JUNIOR") return false;

      // Sehir filtresi
      if (selectedCity !== "Tümü" && t.city !== selectedCity) return false;

      // Arama filtresi
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchableText = [
          t.name,
          t.title,
          t.city,
          ...(t.specializations || []),
          ...(t.languagePairs || []).map((p: any) => `${p.source} ${p.target}`),
        ]
          .join(" ")
          .toLowerCase();
        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [translators, activeTab, searchQuery, selectedCity]);

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tercüman Bul</h1>
          <p className="text-gray-500">
            Yazılı çeviri, konferans tercümanlığı veya akademik çeviri için en uygun uzmanı bulun.
          </p>
        </div>

        {/* Arama & Filtreler */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İsim, alan veya dil ara... (ör: Hukuk, Almanca)"
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="pl-9 pr-8 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm appearance-none"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sekmeler: Yazili / Sozlu / Ogrenci */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: "all" as const, label: "Tumu", icon: Filter, count: translators.length },
            {
              key: "written" as const,
              label: "Yazili Ceviri",
              icon: PenTool,
              count: translators.filter((t) => t.wordRate).length,
            },
            {
              key: "interpreter" as const,
              label: "Sozlu Ceviri",
              icon: Mic,
              count: translators.filter((t) => t.interpreterTypes?.length > 0).length,
            },
            {
              key: "student" as const,
              label: "Ogrenci",
              icon: GraduationCap,
              count: translators.filter((t) => t.tier === "JUNIOR").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-blue-500 text-blue-100"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sonuc Sayisi & Loader */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
            <span className="ml-3 text-gray-600">Tercumanlar yukleniyor...</span>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredTranslators.length} tercuman bulundu
            </p>

            {/* Kart Listesi */}
            {filteredTranslators.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTranslators.map((translator) => (
                  <TranslatorCard
                    key={translator.id}
                    translator={translator}
                    onQuickView={() => setQuickViewTranslator(translator)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-1">Sonuc bulunamadi</h3>
                <p className="text-sm text-gray-400">
                  Filtrelerinizi degistirerek tekrar deneyin.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Quick View Modal */}
      <QuickView
        translator={quickViewTranslator}
        isOpen={!!quickViewTranslator}
        onClose={() => setQuickViewTranslator(null)}
      />
    </div>
  );
}
