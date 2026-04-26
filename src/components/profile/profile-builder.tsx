"use client";

import { useState } from "react";
import StepIndicator from "@/components/ui/step-indicator";
import {
  User,
  Globe,
  BookOpen,
  Mic,
  Briefcase,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Save,
} from "lucide-react";

// ===========================================
// ADIM ADIM PROFIL OLUSTURMA FORMU
// Tercumanlar bu formu doldurarak platformdaki
// profillerini olusturur.
// ===========================================

const STEPS = [
  { label: "Kişisel", description: "Temel bilgiler" },
  { label: "Diller", description: "Dil çiftleri" },
  { label: "Uzmanlık", description: "Alan & araçlar" },
  { label: "Sözlü", description: "Konferans bilgileri" },
  { label: "Portfolyo", description: "Örnek & sertifika" },
  { label: "Fiyat", description: "Ücretlendirme" },
];

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

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

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* ========== ADIM 1: KİŞİSEL BİLGİLER ========== */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Kişisel Bilgiler</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unvan
              </label>
              <select
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none text-gray-900"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hakkında
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => updateForm("bio", e.target.value)}
                rows={3}
                placeholder="Kendinizi kısaca tanıtın (deneyim, uzmanlık alanları...)"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none resize-none text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şehir
                </label>
                <select
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Seçiniz</option>
                  {["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri", "Eskişehir", "Trabzon", "Samsun", "Diyarbakır", "Diğer"].map(
                    (city) => (
                      <option key={city} value={city}>{city}</option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deneyim (yıl)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={form.experienceYears}
                  onChange={(e) => updateForm("experienceYears", parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profil URL
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-500">
                  termilingo.com/
                </span>
                <input
                  type="text"
                  value={form.profileSlug}
                  onChange={(e) =>
                    updateForm("profileSlug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                  }
                  placeholder="ahmet-yilmaz"
                  className="flex-1 px-4 py-2.5 rounded-r-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========== ADIM 2: DİL ÇİFTLERİ ========== */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Dil Çiftleri</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Çeviri yaptığınız dil çiftlerini ekleyin.
            </p>

            {form.languagePairs.map((pair, i) => (
              <div key={i} className="flex items-end gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Kaynak Dil</label>
                  <select
                    value={pair.source}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].source = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="text-gray-400 pb-2">→</div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Hedef Dil</label>
                  <select
                    value={pair.target}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].target = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Seviye</label>
                  <select
                    value={pair.level}
                    onChange={(e) => {
                      const updated = [...form.languagePairs];
                      updated[i].level = e.target.value;
                      updateForm("languagePairs", updated);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Anadil">Anadil</option>
                    <option value="İleri">İleri</option>
                    <option value="Orta-İleri">Orta-İleri</option>
                  </select>
                </div>
                {form.languagePairs.length > 1 && (
                  <button
                    onClick={() => {
                      const updated = form.languagePairs.filter((_, idx) => idx !== i);
                      updateForm("languagePairs", updated);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() =>
                updateForm("languagePairs", [
                  ...form.languagePairs,
                  { source: "", target: "", level: "İleri" },
                ])
              }
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Dil çifti ekle
            </button>
          </div>
        )}

        {/* ========== ADIM 3: UZMANLIK & EĞİTİM ========== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Uzmanlık & Eğitim</h3>
            </div>

            {/* Uzmanlık Alanları */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uzmanlık Alanları (birden fazla seçebilirsiniz)
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALIZATIONS.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => {
                      const current = form.specializations;
                      if (current.includes(spec)) {
                        updateForm("specializations", current.filter((s) => s !== spec));
                      } else {
                        updateForm("specializations", [...current, spec]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      form.specializations.includes(spec)
                        ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* CAT Tools */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CAT Araçları (Çeviri Yazılımları)
              </label>
              <div className="flex flex-wrap gap-2">
                {CAT_TOOLS.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => {
                      const current = form.catTools;
                      if (current.includes(tool)) {
                        updateForm("catTools", current.filter((t) => t !== tool));
                      } else {
                        updateForm("catTools", [...current, tool]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      form.catTools.includes(tool)
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-medium"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            {/* Sertifikalar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sertifikalar</label>
              {form.certifications.map((cert, i) => (
                <div key={i} className="flex gap-3 mb-2">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const updated = [...form.certifications];
                      updated[i].name = e.target.value;
                      updateForm("certifications", updated);
                    }}
                    placeholder="Sertifika adı (ör: YDS)"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={cert.score}
                    onChange={(e) => {
                      const updated = [...form.certifications];
                      updated[i].score = e.target.value;
                      updateForm("certifications", updated);
                    }}
                    placeholder="Puan"
                    className="w-24 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={cert.year}
                    onChange={(e) => {
                      const updated = [...form.certifications];
                      updated[i].year = parseInt(e.target.value);
                      updateForm("certifications", updated);
                    }}
                    placeholder="Yıl"
                    className="w-24 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => updateForm("certifications", form.certifications.filter((_, idx) => idx !== i))}
                    className="p-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateForm("certifications", [
                    ...form.certifications,
                    { name: "", score: "", year: new Date().getFullYear() },
                  ])
                }
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Sertifika ekle
              </button>
            </div>

            {/* Eğitim */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim</label>
              {form.education.map((edu, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl mb-3 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = [...form.education];
                        updated[i].school = e.target.value;
                        updateForm("education", updated);
                      }}
                      placeholder="Üniversite"
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const updated = [...form.education];
                        updated[i].field = e.target.value;
                        updateForm("education", updated);
                      }}
                      placeholder="Bölüm"
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...form.education];
                        updated[i].degree = e.target.value;
                        updateForm("education", updated);
                      }}
                      placeholder="Derece (Lisans, Yüksek Lisans...)"
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...form.education];
                        updated[i].year = parseInt(e.target.value);
                        updateForm("education", updated);
                      }}
                      placeholder="Mezuniyet yılı"
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => updateForm("education", form.education.filter((_, idx) => idx !== i))}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  updateForm("education", [
                    ...form.education,
                    { school: "", degree: "", field: "", year: new Date().getFullYear() },
                  ])
                }
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" /> Eğitim ekle
              </button>
            </div>
          </div>
        )}

        {/* ========== ADIM 4: SÖZLÜ ÇEVİRİ ========== */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <Mic className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Sözlü Çeviri Bilgileri</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Konferans ve sözlü çeviri hizmeti veriyorsanız bu bölümü doldurun. Vermiyorsanız atlayabilirsiniz.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sözlü Çeviri Türleri
              </label>
              <div className="space-y-2">
                {[
                  { value: "SIMULTANEOUS", label: "Simültane (Konferans)", desc: "Eş zamanlı çeviri, kabin veya infoport ile" },
                  { value: "CONSECUTIVE", label: "Ardıl", desc: "Konuşmacı durduktan sonra çeviri" },
                  { value: "LIAISON", label: "İrtibat", desc: "İki taraf arasında diyalog çevirisi" },
                  { value: "WHISPERED", label: "Fısıldama (Chuchotage)", desc: "Tek kişiye yakın mesafeden çeviri" },
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.interpreterTypes.includes(type.value)
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.interpreterTypes.includes(type.value)}
                      onChange={() => {
                        const current = form.interpreterTypes;
                        if (current.includes(type.value)) {
                          updateForm("interpreterTypes", current.filter((t) => t !== type.value));
                        } else {
                          updateForm("interpreterTypes", [...current, type.value]);
                        }
                      }}
                      className="mt-1 rounded border-gray-300"
                    />
                    <div>
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.hasInfoport}
                  onChange={(e) => updateForm("hasInfoport", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <div>
                  <div className="font-medium text-sm">Kendi simültane sistemim (infoport) var</div>
                  <div className="text-xs text-gray-500">
                    Mobil simültane çeviri ekipmanınız varsa işaretleyin
                  </div>
                </div>
              </label>

              {form.hasInfoport && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Ekipman Detayları
                  </label>
                  <input
                    type="text"
                    value={form.equipmentNotes}
                    onChange={(e) => updateForm("equipmentNotes", e.target.value)}
                    placeholder="ör: Bosch Integrus 20 alıcılı sistem"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== ADIM 5: PORTFOLYO ========== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Portfolyo & Terminoloji</h3>
            </div>

            {/* Terminoloji Sözlüğü */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl space-y-4">
              <h4 className="font-semibold text-blue-900">Terminoloji Sözlüğü</h4>
              <p className="text-xs text-blue-700">
                Uzman olduğunuz alanda 10-30 kelimelik mini sözlük oluşturun. İşverenler uzmanlığınızı böyle görür.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.glossaryTitle}
                  onChange={(e) => updateForm("glossaryTitle", e.target.value)}
                  placeholder="Sözlük başlığı (ör: Maden Hukuku Terimleri)"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={form.glossaryField}
                  onChange={(e) => updateForm("glossaryField", e.target.value)}
                  placeholder="Alan (ör: Maden Hukuku)"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {form.glossaryTerms.map((term, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={term.sourceTerm}
                    onChange={(e) => {
                      const updated = [...form.glossaryTerms];
                      updated[i].sourceTerm = e.target.value;
                      updateForm("glossaryTerms", updated);
                    }}
                    placeholder="Kaynak terim"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">→</span>
                  <input
                    type="text"
                    value={term.targetTerm}
                    onChange={(e) => {
                      const updated = [...form.glossaryTerms];
                      updated[i].targetTerm = e.target.value;
                      updateForm("glossaryTerms", updated);
                    }}
                    placeholder="Hedef terim"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {form.glossaryTerms.length > 1 && (
                    <button
                      onClick={() => updateForm("glossaryTerms", form.glossaryTerms.filter((_, idx) => idx !== i))}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() =>
                  updateForm("glossaryTerms", [...form.glossaryTerms, { sourceTerm: "", targetTerm: "" }])
                }
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-3 h-3" /> Terim ekle
              </button>
            </div>

            {/* Çeviri Örneği (Önce/Sonra) */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl space-y-4">
              <h4 className="font-semibold text-emerald-900">Çeviri Örneği (Önce / Sonra)</h4>
              <p className="text-xs text-emerald-700">
                Daha önce yaptığınız bir çeviriden 200 kelimelik kesit paylaşın. Gizlilik ihlali yapmamaya dikkat edin.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={form.sampleTitle}
                  onChange={(e) => updateForm("sampleTitle", e.target.value)}
                  placeholder="Örnek başlığı"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={form.sampleField}
                  onChange={(e) => updateForm("sampleField", e.target.value)}
                  placeholder="Alan"
                  className="px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <textarea
                value={form.sourceText}
                onChange={(e) => updateForm("sourceText", e.target.value)}
                rows={4}
                placeholder="Kaynak metin (orijinal)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <textarea
                value={form.targetText}
                onChange={(e) => updateForm("targetText", e.target.value)}
                rows={4}
                placeholder="Hedef metin (çeviri)"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* ========== ADIM 6: FİYATLANDIRMA ========== */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Fiyatlandırma</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
              <select
                value={form.currency}
                onChange={(e) => updateForm("currency", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">ABD Doları ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">İngiliz Sterlini (£)</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Saatlik Ücret
                </label>
                <input
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) => updateForm("hourlyRate", e.target.value)}
                  placeholder="ör: 1500"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <span className="text-xs text-gray-400">Sözlü çeviri için</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Günlük Ücret
                </label>
                <input
                  type="number"
                  value={form.dailyRate}
                  onChange={(e) => updateForm("dailyRate", e.target.value)}
                  placeholder="ör: 10000"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <span className="text-xs text-gray-400">Tam gün konferans</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kelime Başı Ücret
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.wordRate}
                  onChange={(e) => updateForm("wordRate", e.target.value)}
                  placeholder="ör: 0.35"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <span className="text-xs text-gray-400">Yazılı çeviri için</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800">
                <strong>İpucu:</strong> Fiyatlarınızı rekabetçi tutmak için sektör ortalamalarını takip edin.
                Öğrenci iseniz başlangıç için daha uygun fiyatlar belirleyebilirsiniz.
              </p>
            </div>
          </div>
        )}

        {/* ========== NAVİGASYON BUTONLARI ========== */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentStep === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Geri
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              İleri <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {isSubmitting ? <span className="animate-spin">⏳</span> : <Save className="w-4 h-4" />} 
              {isSubmitting ? "Kaydediliyor..." : "Profili Oluştur"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
