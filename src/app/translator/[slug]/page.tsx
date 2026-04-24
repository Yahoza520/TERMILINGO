"use client";

import { useParams } from "next/navigation";
import {
  MapPin,
  Star,
  Globe,
  Mic,
  Headphones,
  BookOpen,
  GraduationCap,
  Award,
  Wrench,
  CreditCard,
  Calendar,
  Mail,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

// ===========================================
// PUBLIC PROFILE SAYFASI
// Standart şablon: Eğitim, Sertifikalar,
// CAT Tools, Uzmanlık Branşları, Referanslar,
// Terminoloji Sözlüğü, Çeviri Örneği
// ===========================================

// Demo veri (gerçek uygulamada API'den gelecek)
const DEMO_PROFILE = {
  name: "Ahmet Yılmaz",
  title: "Yeminli Tercüman & Konferans Tercümanı",
  bio: "15 yıllık deneyime sahip, hukuk ve teknik alanda uzmanlaşmış yeminli tercüman. Bosch Integrus mobil simültane sistemi ile konferans hizmeti veriyorum. 500'den fazla konferans ve 2000+ belge çevirisi deneyimim var.",
  city: "İstanbul",
  country: "Türkiye",
  badge: "CERTIFIED_PRO",
  tier: "PRO",
  experienceYears: 15,
  rating: 4.9,
  reviewCount: 47,
  isVerified: true,
  languagePairs: [
    { source: "Türkçe", target: "İngilizce", level: "Anadil" },
    { source: "Türkçe", target: "Almanca", level: "İleri" },
    { source: "İngilizce", target: "Türkçe", level: "Anadil" },
  ],
  specializations: ["Hukuk", "Maden Hukuku", "Teknik", "Yapay Zeka"],
  catTools: ["SDL Trados", "MemoQ", "Smartcat"],
  interpreterTypes: ["Simültane", "Ardıl"],
  hasInfoport: true,
  equipmentNotes: "Bosch Integrus 20 alıcılı mobil simültane sistemi",
  education: [
    { school: "Boğaziçi Üniversitesi", degree: "Lisans", field: "Mütercim-Tercümanlık", year: 2010 },
    { school: "İstanbul Üniversitesi", degree: "Yüksek Lisans", field: "Hukuk Çevirisi", year: 2013 },
  ],
  certifications: [
    { name: "YDS", score: "95", year: 2020 },
    { name: "TOEFL iBT", score: "115", year: 2019 },
    { name: "Yeminli Tercüman Belgesi", score: "Noterden Onaylı", year: 2015 },
  ],
  references: [
    { name: "Av. Kemal Demir", company: "Demir & Ortakları Hukuk", note: "5 yıldır düzenli iş birliği" },
    { name: "Dr. Selin Yıldız", company: "ODTÜ Teknokent", note: "Teknik çeviri projeleri" },
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
      { sourceTerm: "Ruhsat sahası", targetTerm: "License area" },
      { sourceTerm: "Maden Kanunu", targetTerm: "Mining Law" },
    ],
  },
  sample: {
    title: "Hukuk Metni - Maden Ruhsatı Başvurusu",
    field: "Maden Hukuku",
    sourceText:
      "Maden ruhsatı başvurusu, ilgili mevzuat çerçevesinde Maden ve Petrol İşleri Genel Müdürlüğü'ne yapılır. Başvuru sahibi, arama izni almak için gerekli teknik ve mali yeterliliği belgelemelidir. Ruhsat alanının çakışma kontrolü yapıldıktan sonra başvuru değerlendirmeye alınır.",
    targetText:
      "Mining license applications are submitted to the General Directorate of Mining and Petroleum Affairs within the framework of the relevant legislation. The applicant must document the required technical and financial competency to obtain an exploration permit. After the overlap check of the license area is conducted, the application is taken under evaluation.",
  },
  hourlyRate: 1500,
  dailyRate: 10000,
  wordRate: 0.35,
  currency: "TRY",
};

const BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  CERTIFIED_PRO: { label: "Sertifikalı Profesyonel", color: "bg-emerald-100 text-emerald-800" },
  VERIFIED_STUDENT: { label: "Doğrulanmış Öğrenci", color: "bg-indigo-100 text-indigo-800" },
  TOP_RATED: { label: "En Yüksek Puan", color: "bg-amber-100 text-amber-800" },
  ENTERPRISE: { label: "Kurumsal", color: "bg-blue-100 text-blue-800" },
};

export default function TranslatorProfilePage() {
  const params = useParams();
  const profile = DEMO_PROFILE; // Gerçek uygulamada slug'a göre API çağrısı

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/marketplace" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Pazar Yerine Dön
          </a>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-lg text-gray-900">TermiLingo</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* ======= PROFIL BAŞLIĞI ======= */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                {profile.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                )}
                {profile.badge && BADGE_CONFIG[profile.badge] && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_CONFIG[profile.badge].color}`}>
                    {BADGE_CONFIG[profile.badge].label}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{profile.title}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.city}, {profile.country}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  {profile.rating} ({profile.reviewCount} değerlendirme)
                </span>
                <span>{profile.experienceYears} yıl deneyim</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
              <Mail className="w-4 h-4" /> İletişime Geç
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{profile.bio}</p>

          {/* Dil Çiftleri */}
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.languagePairs.map((pair, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                <Globe className="w-3.5 h-3.5" />
                {pair.source} → {pair.target}
                <span className="text-blue-400 text-xs">({pair.level})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ======= SOL KOLON: Ana Bilgiler ======= */}
          <div className="md:col-span-2 space-y-6">
            {/* Uzmanlık Alanları */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" /> Uzmanlık Alanları
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-100">
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* Sözlü Çeviri */}
            {profile.interpreterTypes.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <Mic className="w-5 h-5 text-violet-600" /> Sözlü Çeviri
                </h2>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.interpreterTypes.map((type) => (
                    <span key={type} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-sm font-medium">
                      {type}
                    </span>
                  ))}
                </div>
                {profile.hasInfoport && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-800">
                    <Headphones className="w-4 h-4" />
                    <span><strong>İnfoport:</strong> {profile.equipmentNotes}</span>
                  </div>
                )}
              </section>
            )}

            {/* Terminoloji Sözlüğü */}
            {profile.glossary && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-1">
                  <BookOpen className="w-5 h-5 text-indigo-600" /> Terminoloji Sözlüğü
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {profile.glossary.title} — <span className="text-indigo-600">{profile.glossary.field}</span>
                </p>
                <div className="overflow-hidden rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Türkçe</th>
                        <th className="text-left px-4 py-2.5 text-gray-500 font-medium">İngilizce</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.glossary.terms.map((term, i) => (
                        <tr key={i} className="border-t border-gray-50">
                          <td className="px-4 py-2.5 text-gray-900">{term.sourceTerm}</td>
                          <td className="px-4 py-2.5 text-blue-700 font-medium">{term.targetTerm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Çeviri Örneği (Önce/Sonra) */}
            {profile.sample && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Çeviri Örneği</h2>
                <p className="text-sm text-gray-500 mb-4">
                  {profile.sample.title} — <span className="text-emerald-600">{profile.sample.field}</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h5 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                      Kaynak Metin
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {profile.sample.sourceText}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h5 className="text-xs font-semibold text-blue-500 mb-2 uppercase tracking-wide">
                      Çeviri
                    </h5>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {profile.sample.targetText}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ======= SAĞ KOLON: Yan Bilgiler ======= */}
          <div className="space-y-6">
            {/* Fiyatlandırma */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <CreditCard className="w-5 h-5 text-emerald-600" /> Ücret
              </h2>
              <div className="space-y-3">
                {profile.wordRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Kelime başı</span>
                    <span className="text-lg font-bold text-gray-900">₺{profile.wordRate}</span>
                  </div>
                )}
                {profile.hourlyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Saatlik</span>
                    <span className="text-lg font-bold text-gray-900">₺{profile.hourlyRate.toLocaleString()}</span>
                  </div>
                )}
                {profile.dailyRate && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Günlük</span>
                    <span className="text-lg font-bold text-gray-900">₺{profile.dailyRate.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Eğitim */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Eğitim
              </h2>
              <div className="space-y-3">
                {profile.education.map((edu, i) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium text-gray-900">{edu.school}</div>
                    <div className="text-gray-500">
                      {edu.degree} — {edu.field} ({edu.year})
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sertifikalar */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Award className="w-5 h-5 text-amber-600" /> Sertifikalar
              </h2>
              <div className="space-y-2">
                {profile.certifications.map((cert, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{cert.name}</span>
                    <span className="font-medium text-gray-900">{cert.score}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* CAT Araçları */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Wrench className="w-5 h-5 text-gray-600" /> CAT Araçları
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.catTools.map((tool) => (
                  <span key={tool} className="px-2.5 py-1 bg-gray-50 text-gray-700 rounded-lg text-xs border border-gray-100">
                    {tool}
                  </span>
                ))}
              </div>
            </section>

            {/* Referanslar */}
            {profile.references.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Referanslar</h2>
                <div className="space-y-3">
                  {profile.references.map((ref, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-gray-900">{ref.name}</div>
                      <div className="text-gray-500">{ref.company}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{ref.note}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Müsaitlik */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Calendar className="w-5 h-5 text-green-600" /> Müsaitlik
              </h2>
              <div className="p-3 bg-green-50 rounded-xl text-sm text-green-800">
                Müsaitlik takvimi için <strong>FullCalendar</strong> entegrasyonu yapılacak.
                İşverenler burada tarih bazlı filtreleme yapabilecek.
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
