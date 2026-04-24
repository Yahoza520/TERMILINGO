"use client";

import { useState } from "react";
import {
  Send,
  Loader2,
  FileText,
  Mic,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  X,
  ArrowRight,
  Hash,
} from "lucide-react";

// ===========================================
// ÇEVİRİ TALEBİ FORMU
// Müşterinin çeviri talebi oluşturma formu.
// Talep oluşturulduğunda sistem, eşleşen
// tercümanlara bildirim gönderir.
// ===========================================

const REQUEST_TYPES = [
  { value: "WRITTEN", label: "Yazılı Çeviri", icon: FileText, desc: "Belge, metin, web sitesi çevirisi" },
  { value: "SIMULTANEOUS", label: "Simültane Tercümanlık", icon: Mic, desc: "Konferans, toplantı" },
  { value: "CONSECUTIVE", label: "Ardıl Tercümanlık", icon: Globe, desc: "Sunum, görüşme" },
  { value: "LIAISON", label: "İrtibat Tercümanlığı", icon: Globe, desc: "Eşlik, fabrika ziyareti" },
];

const LANGUAGES = [
  "Türkçe", "İngilizce", "Almanca", "Fransızca", "Arapça",
  "Rusça", "İspanyolca", "İtalyanca", "Çince", "Japonca",
  "Korece", "Portekizce", "Hollandaca", "Lehçe", "Farsça",
];

const FIELDS = [
  "Hukuk", "Tıp/Sağlık", "Teknik", "Ticari/Finansal",
  "Enerji", "Otomotiv", "Bilişim/Yazılım", "Maden Hukuku",
  "Diplomatik/Resmi", "Edebiyat", "Akademik", "Genel",
];

const CITIES = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya",
  "Adana", "Konya", "Gaziantep", "Kayseri", "Online",
];

type FormState = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  title: string;
  description: string;
  type: string;
  sourceLanguage: string;
  targetLanguage: string;
  field: string;
  city: string;
  venue: string;
  eventDate: string;
  budget: string;
  currency: string;
  deadline: string;
  wordCount: string;
};

export default function RequestForm({
  onClose,
  onSuccess,
}: {
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [notifiedCount, setNotifiedCount] = useState(0);

  const [form, setForm] = useState<FormState>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    title: "",
    description: "",
    type: "",
    sourceLanguage: "",
    targetLanguage: "",
    field: "",
    city: "",
    venue: "",
    eventDate: "",
    budget: "",
    currency: "TRY",
    deadline: "",
    wordCount: "",
  });

  const updateForm = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isInterpreting = ["SIMULTANEOUS", "CONSECUTIVE", "LIAISON"].includes(
    form.type
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Talep oluşturulamadı.");
      }

      setNotifiedCount(data.notifiedTranslators || 0);
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Başarılı durum
  if (success) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Talebiniz Oluşturuldu!
        </h3>
        <p className="text-gray-500 mb-2">
          {notifiedCount > 0
            ? `${notifiedCount} tercümana bildirim gönderildi.`
            : "Talebiniz sisteme kaydedildi."}
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Tercümanların teklifleri e-posta adresinize gönderilecektir.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-black transition-all"
        >
          Tamam
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Çeviri Talebi Oluşturun
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Adım {step}/3 — {step === 1 ? "İletişim Bilgileri" : step === 2 ? "Talep Detayları" : "Bütçe & Zamanlama"}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= step ? "bg-blue-600" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Step 1: İletişim Bilgileri */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adınız Soyadınız *
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => updateForm("clientName", e.target.value)}
              placeholder="Ahmet Yılmaz"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresiniz *
            </label>
            <input
              type="email"
              value={form.clientEmail}
              onChange={(e) => updateForm("clientEmail", e.target.value)}
              placeholder="ornek@email.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={form.clientPhone}
              onChange={(e) => updateForm("clientPhone", e.target.value)}
              placeholder="+90 5XX XXX XX XX"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>

          <button
            onClick={() => {
              if (!form.clientName || !form.clientEmail) {
                setError("İsim ve e-posta zorunludur.");
                return;
              }
              setError("");
              setStep(2);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all mt-4"
          >
            Devam <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step 2: Talep Detayları */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Çeviri Türü */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Çeviri Türü *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REQUEST_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => updateForm("type", t.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      form.type === t.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mb-1 ${
                        form.type === t.value
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="font-medium text-sm text-gray-900">
                      {t.label}
                    </div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Başlık */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Talep Başlığı *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="Ör: Hukuk belgesi İngilizce çevirisi"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>

          {/* Dil çifti */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kaynak Dil *
              </label>
              <select
                value={form.sourceLanguage}
                onChange={(e) => updateForm("sourceLanguage", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">Seçin</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hedef Dil *
              </label>
              <select
                value={form.targetLanguage}
                onChange={(e) => updateForm("targetLanguage", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="">Seçin</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uzmanlık Alanı
            </label>
            <select
              value={form.field}
              onChange={(e) => updateForm("field", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="">Seçin (opsiyonel)</option>
              {FIELDS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detaylı Açıklama
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="Projenizin detaylarını yazın..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 resize-none"
            />
          </div>

          {/* Sözlü çeviri: konum & tarih */}
          {isInterpreting && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Şehir
                </label>
                <select
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="">Seçin</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Etkinlik Tarihi
                </label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => updateForm("eventDate", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Navigasyon */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Geri
            </button>
            <button
              onClick={() => {
                if (
                  !form.type ||
                  !form.title ||
                  !form.sourceLanguage ||
                  !form.targetLanguage
                ) {
                  setError("Tür, başlık ve dil çifti zorunludur.");
                  return;
                }
                setError("");
                setStep(3);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
            >
              Devam <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Bütçe & Zamanlama */}
      {step === 3 && (
        <div className="space-y-4">
          {!isInterpreting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Hash className="w-3.5 h-3.5 inline mr-1" />
                Kelime Sayısı (tahmini)
              </label>
              <input
                type="number"
                value={form.wordCount}
                onChange={(e) => updateForm("wordCount", e.target.value)}
                placeholder="Ör: 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-3.5 h-3.5 inline mr-1" />
                Bütçe (opsiyonel)
              </label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => updateForm("budget", e.target.value)}
                placeholder="Ör: 5000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Para Birimi
              </label>
              <select
                value={form.currency}
                onChange={(e) => updateForm("currency", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white"
              >
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>
          </div>

          {!isInterpreting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                Teslim Tarihi
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => updateForm("deadline", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
              />
            </div>
          )}

          {/* Özet */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-4">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">
              Talep Özeti
            </h4>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tür:</span>
                <span className="text-gray-900 font-medium">
                  {REQUEST_TYPES.find((t) => t.value === form.type)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dil:</span>
                <span className="text-gray-900 font-medium">
                  {form.sourceLanguage} → {form.targetLanguage}
                </span>
              </div>
              {form.field && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Alan:</span>
                  <span className="text-gray-900 font-medium">
                    {form.field}
                  </span>
                </div>
              )}
              {form.budget && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Bütçe:</span>
                  <span className="text-gray-900 font-medium">
                    {form.budget} {form.currency}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigasyon */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Geri
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-black transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Talebi Gönder
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
