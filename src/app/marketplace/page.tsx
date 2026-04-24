"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

// ===========================================
// MARKETPLACE SAYFASI
// İşverenlerin tercüman aradığı ana sayfa.
// Yazılı / Sözlü / Öğrenci sekmeleri,
// Konum filtreleme, terminoloji ön izleme.
// ===========================================

// Demo verileri (gerçek uygulamada API'den gelecek)
const DEMO_TRANSLATORS = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    title: "Yeminli Tercüman & Konferans Tercümanı",
    city: "İstanbul",
    badge: "CERTIFIED_PRO",
    tier: "PRO",
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 47,
    languagePairs: [
      { source: "Türkçe", target: "İngilizce", level: "Anadil" },
      { source: "Türkçe", target: "Almanca", level: "İleri" },
      { source: "İngilizce", target: "Türkçe", level: "Anadil" },
    ],
    specializations: ["Hukuk", "Maden Hukuku", "Teknik", "Yapay Zeka"],
    catTools: ["SDL Trados", "MemoQ", "Smartcat"],
    interpreterTypes: ["SIMULTANEOUS", "CONSECUTIVE"],
    hasInfoport: true,
    education: [
      { school: "Boğaziçi Üniversitesi", degree: "Lisans", field: "Mütercim-Tercümanlık", year: 2010 },
    ],
    certifications: [
      { name: "YDS", score: "95", year: 2020 },
      { name: "TOEFL", score: "115", year: 2019 },
    ],
    glossary: {
      title: "Maden Hukuku Terminolojisi",
      field: "Maden Hukuku",
      terms: [
        { sourceTerm: "Maden ruhsatı", targetTerm: "Mining license" },
        { sourceTerm: "İşletme izni", targetTerm: "Operating permit" },
        { sourceTerm: "Cevher", targetTerm: "Ore" },
        { sourceTerm: "Sondaj", targetTerm: "Drilling" },
        { sourceTerm: "Çevre etki değerlendirmesi", targetTerm: "Environmental impact assessment" },
      ],
    },
    sample: {
      title: "Hukuk Metni - Maden Ruhsatı Başvurusu",
      field: "Maden Hukuku",
      sourceText:
        "Maden ruhsatı başvurusu, ilgili mevzuat çerçevesinde Maden ve Petrol İşleri Genel Müdürlüğü'ne yapılır. Başvuru sahibi, arama izni almak için gerekli teknik ve mali yeterliliği belgelemelidir.",
      targetText:
        "Mining license applications are submitted to the General Directorate of Mining and Petroleum Affairs within the framework of the relevant legislation. The applicant must document the required technical and financial competency to obtain an exploration permit.",
    },
    hourlyRate: 1500,
    dailyRate: 10000,
    wordRate: 0.35,
    currency: "TRY",
    profileSlug: "ahmet-yilmaz",
  },
  {
    id: "2",
    name: "Zeynep Arslan",
    title: "Tıp & İlaç Sektörü Çevirmenʼi",
    city: "Ankara",
    badge: "CERTIFIED_PRO",
    tier: "PRO",
    experienceYears: 10,
    rating: 4.8,
    reviewCount: 32,
    languagePairs: [
      { source: "Türkçe", target: "İngilizce", level: "İleri" },
      { source: "Türkçe", target: "Fransızca", level: "İleri" },
    ],
    specializations: ["Tıp/Sağlık", "Eczacılık", "Biyoteknoloji"],
    catTools: ["SDL Trados", "Memsource"],
    interpreterTypes: [],
    hasInfoport: false,
    education: [
      { school: "Hacettepe Üniversitesi", degree: "Yüksek Lisans", field: "Çeviribilim", year: 2014 },
    ],
    certifications: [{ name: "DELF C1", score: "Geçti", year: 2018 }],
    glossary: {
      title: "Tıbbi Terminoloji",
      field: "Tıp/Sağlık",
      terms: [
        { sourceTerm: "Klinik araştırma", targetTerm: "Clinical trial" },
        { sourceTerm: "İlaç prospektüsü", targetTerm: "Drug leaflet" },
        { sourceTerm: "Yan etki", targetTerm: "Side effect / Adverse event" },
      ],
    },
    sample: undefined,
    hourlyRate: undefined,
    dailyRate: undefined,
    wordRate: 0.3,
    currency: "TRY",
    profileSlug: "zeynep-arslan",
  },
  {
    id: "3",
    name: "Mehmet Can Öztürk",
    title: "Simültane Konferans Tercümanı",
    city: "Ankara",
    badge: "ENTERPRISE",
    tier: "ENTERPRISE",
    experienceYears: 20,
    rating: 5.0,
    reviewCount: 85,
    languagePairs: [
      { source: "Türkçe", target: "İngilizce", level: "Anadil" },
      { source: "Türkçe", target: "Arapça", level: "İleri" },
    ],
    specializations: ["Diplomatik/Resmi", "Hukuk", "Enerji"],
    catTools: [],
    interpreterTypes: ["SIMULTANEOUS", "CONSECUTIVE", "WHISPERED"],
    hasInfoport: true,
    education: [
      { school: "Ankara Üniversitesi", degree: "Doktora", field: "Çeviribilim", year: 2008 },
    ],
    certifications: [
      { name: "AIIC Üyeliği", score: "Aktif", year: 2012 },
    ],
    glossary: undefined,
    sample: undefined,
    hourlyRate: 3000,
    dailyRate: 20000,
    wordRate: undefined,
    currency: "TRY",
    profileSlug: "mehmet-can-ozturk",
  },
  {
    id: "4",
    name: "Elif Demir",
    title: "Mütercim-Tercümanlık Öğrencisi",
    city: "Ankara",
    badge: "VERIFIED_STUDENT",
    tier: "JUNIOR",
    experienceYears: 0,
    rating: 4.5,
    reviewCount: 3,
    languagePairs: [
      { source: "Türkçe", target: "İngilizce", level: "İleri" },
      { source: "İngilizce", target: "Türkçe", level: "İleri" },
    ],
    specializations: ["Edebiyat", "Genel"],
    catTools: ["Smartcat"],
    interpreterTypes: [],
    hasInfoport: false,
    education: [
      { school: "Hacettepe Üniversitesi", degree: "Lisans (devam)", field: "Mütercim-Tercümanlık", year: 2027 },
    ],
    certifications: [],
    glossary: undefined,
    sample: undefined,
    hourlyRate: undefined,
    dailyRate: undefined,
    wordRate: 0.1,
    currency: "TRY",
    profileSlug: "elif-demir",
  },
  {
    id: "5",
    name: "Ali Rıza Korkut",
    title: "Teknik Çeviri Uzmanı",
    city: "İzmir",
    badge: "CERTIFIED_PRO",
    tier: "PRO",
    experienceYears: 8,
    rating: 4.7,
    reviewCount: 21,
    languagePairs: [
      { source: "Türkçe", target: "Almanca", level: "Anadil" },
      { source: "Almanca", target: "Türkçe", level: "Anadil" },
    ],
    specializations: ["Teknik", "Otomotiv", "İnşaat", "Enerji"],
    catTools: ["SDL Trados", "Wordfast", "MemoQ"],
    interpreterTypes: ["CONSECUTIVE"],
    hasInfoport: false,
    education: [
      { school: "Ege Üniversitesi", degree: "Lisans", field: "Alman Dili ve Edebiyatı", year: 2016 },
    ],
    certifications: [{ name: "TestDaF", score: "TDN 5", year: 2017 }],
    glossary: {
      title: "Otomotiv Terminolojisi",
      field: "Otomotiv",
      terms: [
        { sourceTerm: "Şanzıman", targetTerm: "Getriebe" },
        { sourceTerm: "Yakıt enjeksiyonu", targetTerm: "Kraftstoffeinspritzung" },
        { sourceTerm: "Fren sistemi", targetTerm: "Bremssystem" },
      ],
    },
    sample: undefined,
    hourlyRate: 1000,
    dailyRate: 7000,
    wordRate: 0.28,
    currency: "TRY",
    profileSlug: "ali-riza-korkut",
  },
];

type TabType = "all" | "written" | "interpreter" | "student";

const CITIES = ["Tümü", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Tümü");
  const [quickViewTranslator, setQuickViewTranslator] = useState<
    (typeof DEMO_TRANSLATORS)[0] | null
  >(null);

  // Filtreleme mantığı
  const filteredTranslators = useMemo(() => {
    return DEMO_TRANSLATORS.filter((t) => {
      // Sekme filtresi
      if (activeTab === "written" && t.interpreterTypes.length > 0 && !t.wordRate) return false;
      if (activeTab === "interpreter" && t.interpreterTypes.length === 0) return false;
      if (activeTab === "student" && t.tier !== "JUNIOR") return false;

      // Şehir filtresi
      if (selectedCity !== "Tümü" && t.city !== selectedCity) return false;

      // Arama filtresi
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchableText = [
          t.name,
          t.title,
          t.city,
          ...t.specializations,
          ...t.languagePairs.map((p) => `${p.source} ${p.target}`),
        ]
          .join(" ")
          .toLowerCase();
        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery, selectedCity]);

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

        {/* Sekmeler: Yazılı / Sözlü / Öğrenci */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all" as const, label: "Tümü", icon: Filter, count: DEMO_TRANSLATORS.length },
            {
              key: "written" as const,
              label: "Yazılı Çeviri",
              icon: PenTool,
              count: DEMO_TRANSLATORS.filter((t) => t.wordRate).length,
            },
            {
              key: "interpreter" as const,
              label: "Sözlü Çeviri",
              icon: Mic,
              count: DEMO_TRANSLATORS.filter((t) => t.interpreterTypes.length > 0).length,
            },
            {
              key: "student" as const,
              label: "Öğrenci",
              icon: GraduationCap,
              count: DEMO_TRANSLATORS.filter((t) => t.tier === "JUNIOR").length,
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

        {/* Sonuç Sayısı */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredTranslators.length} tercüman bulundu
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
            <h3 className="text-lg font-medium text-gray-600 mb-1">Sonuç bulunamadı</h3>
            <p className="text-sm text-gray-400">
              Filtrelerinizi değiştirerek tekrar deneyin.
            </p>
          </div>
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
