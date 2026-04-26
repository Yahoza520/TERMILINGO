"use client";

import { useState, useEffect } from "react";
import {
  User,
  Globe,
  BookOpen,
  Mic,
  Briefcase,
  CreditCard,
  Save,
  Plus,
  Trash2,
} from "lucide-react";

// ===========================================
// PROFIL DUZENLEME FORMU (TEK SAYFA)
// Tercumanlar tüm bilgilerini tek bir ekranda
// gorebilir ve guncelleyebilir.
// ===========================================

// Dil seçenekleri
const LANGUAGES = [
  "Türkçe", "İngilizce", "Almanca", "Fransızca", "Arapça", "Rusça",
  "İspanyolca", "İtalyanca", "Çince", "Japonca", "Korece", "Farsça",
  "Hollandaca", "Portekizce", "Lehçe", "Ukraynaca",
];

const SPECIALIZATIONS = [
  "Hukuk", "Tıp/Sağlık", "Teknik", "Finans/Bankacılık", "Maden Hukuku",
  "Yapay Zeka/Teknoloji", "Edebiyat", "Pazarlama", "Turizm/Otelcilik",
  "Otomotiv", "Enerji", "İnşaat", "Tarım", "Eğitim", "Diplomatik/Resmi",
  "Patent/Fikri Mülkiyet", "Çevre", "Savunma Sanayi", "E-Ticaret", "Genel",
];

const CAT_TOOLS = [
  "SDL Trados", "MemoQ", "Smartcat", "Wordfast", "Memsource",
  "Across", "OmegaT", "MateCat", "Phrase TMS", "Crowdin",
];

interface LanguagePair {
  source: string;
  target: string;
  level: string;
}

interface Certification {
  name: string;
  score: string;
  year: number;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  year: number;
}

interface GlossaryTerm {
  sourceTerm: string;
  targetTerm: string;
}

export default function ProfileBuilder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    // Adım 1: Kişisel
    title: "",
    bio: "",
    city: "",
    experienceYears: 0,
    profileSlug: "",

    // Adım 2: Diller
    languagePairs: [{ source: "", target: "", level: "İleri" }] as LanguagePair[],

    // Adım 3: Uzmanlık
    specializations: [] as string[],
    catTools: [] as string[],
    certifications: [] as Certification[],
    education: [] as Education[],

    // Adım 4: Sözlü Çeviri
    interpreterTypes: [] as string[],
    hasInfoport: false,
    equipmentNotes: "",

    // Adım 5: Portfolyo
    glossaryTitle: "",
    glossaryField: "",
    glossaryTerms: [{ sourceTerm: "", targetTerm: "" }] as GlossaryTerm[],
    sampleTitle: "",
    sampleField: "",
    sourceText: "",
    targetText: "",

    // Adım 6: Fiyat
    hourlyRate: "",
    dailyRate: "",
    wordRate: "",
    currency: "TRY",
  });

  const updateForm = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            setForm((prev) => ({
              ...prev,
              title: p.title || "",
              bio: p.bio || "",
              city: p.city || "",
              experienceYears: p.experienceYears || 0,
              profileSlug: p.profileSlug || "",
              languagePairs: p.languagePairs?.length ? p.languagePairs : prev.languagePairs,
              specializations: p.specializations || [],
              catTools: p.catTools || [],
              certifications: p.certifications || [],
              education: p.education || [],
              interpreterTypes: p.interpreterTypes || [],
              hasInfoport: p.hasInfoport || false,
              equipmentNotes: p.equipmentNotes || "",
              hourlyRate: p.hourlyRate?.toString() || "",
              dailyRate: p.dailyRate?.toString() || "",
              wordRate: p.wordRate?.toString() || "",
              currency: p.currency || "TRY",
              glossaryTitle: p.glossaries?.[0]?.title || "",
              glossaryField: p.glossaries?.[0]?.field || "",
            }));
          }
        }
      } catch (err) {
        console.error("Profil yuklenemedi", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Profil kaydedilirken bir hata oluştu.");
      }

      alert("Profiliniz başarıyla kaydedildi! Panele yönlendiriliyorsunuz... 🎉");
      setTimeout(() => {
        window.location.href = "/dashboard/tercuman";
      }, 1500);
    } catch (err) {
      alert("Hata: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Profiliniz yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        
        {/* ========== BÖLÜM 1: KİŞİSEL BİLGİLER ========== */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Kişisel Bilgiler</h3>
              <p className="text-sm text-gray-500">Profilinizde görünecek temel bilgileriniz.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unvan</label>
              <select
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 outline-none"
              >
                <option value="">Ünvan seçiniz</option>
                <option value="Yeminli Tercüman">Yeminli Tercüman</option>
                <option value="Konferans Tercümanı">Konferans Tercümanı</option>
                <option value="Simültane Tercüman">Simültane Tercüman</option>
                <option value="Ardıl Tercüman">Ardıl Tercüman</option>
                <option value="Mütercim-Tercüman">Mütercim-Tercüman</option>
                <option value="Tıbbi Çevirmen">Tıbbi Çevirmen</option>
                <option value="Hukuki Çevirmen">Hukuki Çevirmen</option>
                <option value="Teknik Çevirmen">Teknik Çevirmen</option>
                <option value="Akademik Çevirmen">Akademik Çevirmen</option>
                <option value="Öğrenci">Öğrenci</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
              <select
                value={form.city}
                onChange={(e) => updateForm("city", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 outline-none"
              >
                <option value="">Seçiniz</option>
                {["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Trabzon", "Samsun", "Diyarbakır", "Diğer"].map(
                  (city) => (
                    <option key={city} value={city}>{city}</option>
                  )
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hakkında</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateForm("bio", e.target.value)}
              rows={3}
              placeholder="Kendinizi tanıtın..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deneyim (yıl)</label>
              <input
                type="number"
                value={form.experienceYears}
                onChange={(e) => updateForm("experienceYears", parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profil URL</label>
              <div className="flex">
                <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">termilingo.com/</span>
                <input
                  type="text"
                  value={form.profileSlug}
                  onChange={(e) => updateForm("profileSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                  placeholder="ahmet-yilmaz"
                  className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== BÖLÜM 2: DİL ÇİFTLERİ ========== */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Dil Çiftleri</h3>
              <p className="text-sm text-gray-500">Çeviri yaptığınız dilleri ekleyin.</p>
            </div>
          </div>

          <div className="space-y-4">
            {form.languagePairs.map((pair, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Kaynak Dil</label>
                  <select
                    value={pair.source}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].source = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="text-gray-400 pb-2">→</div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Hedef Dil</label>
                  <select
                    value={pair.target}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].target = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="">Seçiniz</option>
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Seviye</label>
                  <select
                    value={pair.level}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].level = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                  >
                    <option value="Anadil">Anadil</option>
                    <option value="İleri">İleri</option>
                    <option value="Orta-İleri">Orta-İleri</option>
                  </select>
                </div>
                <button
                  onClick={() => updateForm("languagePairs", form.languagePairs.filter((_, idx) => idx !== i))}
                  className="p-2 text-red-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateForm("languagePairs", [...form.languagePairs, { source: "", target: "", level: "İleri" }])}
              className="flex items-center gap-2 text-sm text-blue-600 font-medium"
            >
              <Plus className="w-4 h-4" /> Dil Çifti Ekle
            </button>
          </div>
        </div>

        {/* ========== BÖLÜM 3: UZMANLIK & EĞİTİM ========== */}
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Uzmanlık & Eğitim</h3>
              <p className="text-sm text-gray-500">Alanlarınızı ve geçmişinizi belirtin.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Uzmanlık Alanları</label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      const current = form.specializations;
                      updateForm("specializations", current.includes(spec) ? current.filter(s => s !== spec) : [...current, spec]);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      form.specializations.includes(spec) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">CAT Araçları</label>
              <div className="flex flex-wrap gap-2">
                {CAT_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => {
                      const current = form.catTools;
                      updateForm("catTools", current.includes(tool) ? current.filter(t => t !== tool) : [...current, tool]);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      form.catTools.includes(tool) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========== BÖLÜM 4: SÖZLÜ ÇEVİRİ ========== */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Mic className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Sözlü Çeviri (Opsiyonel)</h3>
              <p className="text-sm text-gray-500">Sözlü çeviri yetkinlikleriniz.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: "SIMULTANEOUS", label: "Simültane (Konferans)" },
              { value: "CONSECUTIVE", label: "Ardıl" },
              { value: "LIAISON", label: "İrtibat" },
              { value: "WHISPERED", label: "Fısıldama" },
            ].map((type) => (
              <label key={type.value} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={form.interpreterTypes.includes(type.value)}
                  onChange={() => {
                    const current = form.interpreterTypes;
                    updateForm("interpreterTypes", current.includes(type.value) ? current.filter(t => t !== type.value) : [...current, type.value]);
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasInfoport}
                onChange={(e) => updateForm("hasInfoport", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Kendi infoport sistemim var</span>
            </label>
            {form.hasInfoport && (
              <input
                type="text"
                value={form.equipmentNotes}
                onChange={(e) => updateForm("equipmentNotes", e.target.value)}
                placeholder="Ekipman detayları..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            )}
          </div>
        </div>

        {/* ========== BÖLÜM 5: PORTFOLYO ========== */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Portfolyo & Terminoloji</h3>
              <p className="text-sm text-gray-500">Örnek çalışmalarınızı ekleyin.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
              <h4 className="font-bold text-blue-900">Terminoloji Sözlüğü</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.glossaryTitle}
                  onChange={(e) => updateForm("glossaryTitle", e.target.value)}
                  placeholder="Sözlük Başlığı"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
                <input
                  type="text"
                  value={form.glossaryField}
                  onChange={(e) => updateForm("glossaryField", e.target.value)}
                  placeholder="Alan (ör: Hukuk)"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
            </div>

            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-4">
              <h4 className="font-bold text-emerald-900">Çeviri Örneği</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.sampleTitle}
                  onChange={(e) => updateForm("sampleTitle", e.target.value)}
                  placeholder="Örnek Başlığı"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
                <input
                  type="text"
                  value={form.sampleField}
                  onChange={(e) => updateForm("sampleField", e.target.value)}
                  placeholder="Alan"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea
                  value={form.sourceText}
                  onChange={(e) => updateForm("sourceText", e.target.value)}
                  placeholder="Kaynak metin..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none"
                />
                <textarea
                  value={form.targetText}
                  onChange={(e) => updateForm("targetText", e.target.value)}
                  placeholder="Hedef metin..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== BÖLÜM 6: FİYATLANDIRMA ========== */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Fiyatlandırma</h3>
              <p className="text-sm text-gray-500">Ücret bilgilerinizi belirleyin.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
              <select
                value={form.currency}
                onChange={(e) => updateForm("currency", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              >
                <option value="TRY">TRY (₺)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saatlik</label>
              <input
                type="number"
                value={form.hourlyRate}
                onChange={(e) => updateForm("hourlyRate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Günlük</label>
              <input
                type="number"
                value={form.dailyRate}
                onChange={(e) => updateForm("dailyRate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kelime Başı</label>
              <input
                type="number"
                step="0.01"
                value={form.wordRate}
                onChange={(e) => updateForm("wordRate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========== KAYDET BUTONU ========== */}
      <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-2xl flex items-center justify-between">
        <div className="hidden md:block">
          <p className="text-sm font-bold text-gray-900">Profilini Güncelle</p>
          <p className="text-xs text-gray-500">Tüm bilgiler tek seferde kaydedilir.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? "Kaydediliyor..." : <><Save className="w-5 h-5" /> Profilimi Güncelle</>}
        </button>
      </div>
    </div>
  );
}
