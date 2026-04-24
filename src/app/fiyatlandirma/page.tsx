"use client";

import { useState } from "react";
import {
  Check,
  Star,
  Zap,
  Crown,
  Building2,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// ===========================================
// FİYATLANDIRMA SAYFASI
// Tercümanların abonelik planlarını görüntüler
// ===========================================

type BillingPeriod = "monthly" | "yearly";

const PLANS = [
  {
    id: "free",
    name: "Ücretsiz",
    description: "Platformu keşfetmek isteyenler için",
    icon: Star,
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "from-gray-100 to-gray-200",
    textColor: "text-gray-700",
    buttonStyle: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    borderColor: "border-gray-200",
    popular: false,
    features: [
      "Temel profil oluşturma",
      "Pazar yerinde listeleme",
      "1 dil çifti",
      "3 terminoloji terimi",
      "Aylık 2 teklif gönderme",
      "Topluluk desteği",
    ],
    limits: {
      languagePairs: 1,
      glossaryTerms: 3,
      proposalsPerMonth: 2,
      portfolioAssets: 0,
    },
  },
  {
    id: "student",
    name: "Öğrenci",
    description: "Üniversite öğrencileri ve junior tercümanlar için",
    icon: GraduationCap,
    monthlyPrice: 49,
    yearlyPrice: 399,
    color: "from-indigo-500 to-purple-600",
    textColor: "text-indigo-600",
    buttonStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
    borderColor: "border-indigo-200",
    popular: false,
    features: [
      "Doğrulanmış Öğrenci rozeti",
      "3 dil çifti",
      "20 terminoloji terimi",
      "Aylık 10 teklif gönderme",
      "Mentor eşleştirme",
      "Portföy oluşturma (3 örnek)",
      "E-posta desteği",
      ".edu.tr doğrulama",
    ],
    limits: {
      languagePairs: 3,
      glossaryTerms: 20,
      proposalsPerMonth: 10,
      portfolioAssets: 3,
    },
  },
  {
    id: "individual",
    name: "Bireysel",
    description: "Bağımsız profesyonel tercümanlar için",
    icon: Zap,
    monthlyPrice: 149,
    yearlyPrice: 1199,
    color: "from-blue-600 to-cyan-500",
    textColor: "text-blue-600",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-700",
    borderColor: "border-blue-200",
    popular: true,
    features: [
      "Sertifikalı Profesyonel rozeti",
      "Sınırsız dil çifti",
      "100 terminoloji terimi",
      "Aylık 50 teklif gönderme",
      "Detaylı portföy (10 örnek)",
      "Çeviri örnekleri önizleme",
      "Müsaitlik takvimi",
      "Öncelikli sıralama",
      "E-posta + canlı destek",
    ],
    limits: {
      languagePairs: -1,
      glossaryTerms: 100,
      proposalsPerMonth: 50,
      portfolioAssets: 10,
    },
  },
  {
    id: "pro",
    name: "Profesyonel",
    description: "Yoğun çalışan deneyimli tercümanlar için",
    icon: Crown,
    monthlyPrice: 349,
    yearlyPrice: 2799,
    color: "from-amber-500 to-orange-500",
    textColor: "text-amber-600",
    buttonStyle: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600",
    borderColor: "border-amber-200",
    popular: false,
    features: [
      "Top Rated rozeti",
      "Sınırsız her şey",
      "Sınırsız teklif gönderme",
      "Sınırsız portföy",
      "Öncelikli eşleştirme",
      "Analitik dashboard",
      "API erişimi",
      "Özel profil URL",
      "Müsaitlik takvimi + push bildirim",
      "7/24 öncelikli destek",
    ],
    limits: {
      languagePairs: -1,
      glossaryTerms: -1,
      proposalsPerMonth: -1,
      portfolioAssets: -1,
    },
  },
  {
    id: "enterprise",
    name: "Kurumsal",
    description: "Çeviri ajansları ve büyük ekipler için",
    icon: Building2,
    monthlyPrice: null,
    yearlyPrice: null,
    color: "from-zinc-800 to-zinc-900",
    textColor: "text-zinc-800",
    buttonStyle: "bg-zinc-900 text-white hover:bg-black",
    borderColor: "border-zinc-300",
    popular: false,
    features: [
      "Enterprise rozeti",
      "Çoklu kullanıcı yönetimi",
      "Ekip analitikleri",
      "Özel entegrasyon (API)",
      "SLA garantisi",
      "Toplu faturalama",
      "Markalı alt sayfa",
      "Özel müşteri temsilcisi",
      "Onboarding desteği",
      "Özel fiyatlandırma",
    ],
    limits: {
      languagePairs: -1,
      glossaryTerms: -1,
      proposalsPerMonth: -1,
      portfolioAssets: -1,
    },
  },
];

const FAQ = [
  {
    q: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    a: "Evet, aboneliğinizi dilediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar planınız aktif kalır.",
  },
  {
    q: "Öğrenci planı için ne tür belgeler gerekiyor?",
    a: "Öğrenci planından faydalanmak için .edu.tr uzantılı e-posta adresiniz ile doğrulama yapmanız yeterlidir. Ayrıca üniversite belgenizi yükleyebilirsiniz.",
  },
  {
    q: "Planlar arasında geçiş yapabilir miyim?",
    a: "Evet, dilediğiniz zaman daha üst bir plana yükseltme yapabilirsiniz. Fark faturası otomatik hesaplanır. Alt plana geçişlerde mevcut dönem sonunda aktif olur.",
  },
  {
    q: "Ödeme yöntemleri nelerdir?",
    a: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Kurumsal planlar için fatura karşılığı ödeme seçeneği de mevcuttur.",
  },
  {
    q: "Yıllık aboneliğin avantajı nedir?",
    a: "Yıllık aboneliklerde %30'a varan indirimlerden faydalanırsınız. Ayrıca yıllık planlara özel ek özellikler de sunulmaktadır.",
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Basit ve Şeffaf Fiyatlandırma
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          İhtiyacınıza Uygun
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Plan Seçin
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Küçükten başlayın, büyüdükçe yükseltin. Tüm planlar 14 gün ücretsiz
          deneme içerir.
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              billingPeriod === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Aylık
          </button>
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yıllık
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              %30 İndirim
            </span>
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const price =
              billingPeriod === "monthly"
                ? plan.monthlyPrice
                : plan.yearlyPrice;
            const isEnterprise = plan.id === "enterprise";
            const savingsPercent =
              plan.monthlyPrice && plan.yearlyPrice
                ? Math.round(
                    (1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100
                  )
                : 0;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border ${
                  plan.popular
                    ? "border-blue-300 shadow-xl shadow-blue-500/10 scale-[1.02]"
                    : plan.borderColor
                } bg-white flex flex-col overflow-hidden transition-all hover:shadow-lg`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold text-center py-1.5">
                    ⭐ En Popüler
                  </div>
                )}

                <div
                  className={`p-6 ${plan.popular ? "pt-10" : ""}`}
                >
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Plan name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-5 min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    {isEnterprise ? (
                      <div>
                        <span className="text-3xl font-bold text-gray-900">
                          Özel
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          İhtiyaçlarınıza göre
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-gray-900">
                          ₺{price}
                        </span>
                        <span className="text-gray-500 text-sm">
                          /{billingPeriod === "monthly" ? "ay" : "yıl"}
                        </span>
                        {billingPeriod === "yearly" &&
                          savingsPercent > 0 && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                              Aylık ₺
                              {Math.round(
                                (plan.yearlyPrice || 0) / 12
                              )}{" "}
                              (%{savingsPercent} tasarruf)
                            </p>
                          )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={isEnterprise ? "/iletisim" : "/kayit"}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${plan.buttonStyle}`}
                  >
                    {isEnterprise ? "İletişime Geçin" : "Başla"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Features */}
                <div className="px-6 pb-6 flex-1">
                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Özellikler
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-gray-600"
                        >
                          <Check
                            className={`w-4 h-4 mt-0.5 shrink-0 ${plan.textColor}`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Detaylı Karşılaştırma
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700 w-1/4">
                  Özellik
                </th>
                {PLANS.filter((p) => p.id !== "enterprise").map((plan) => (
                  <th
                    key={plan.id}
                    className={`text-center py-4 px-3 font-semibold ${
                      plan.popular ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Dil Çifti", key: "languagePairs" },
                { label: "Terminoloji Terimi", key: "glossaryTerms" },
                { label: "Aylık Teklif", key: "proposalsPerMonth" },
                { label: "Portföy Örnekleri", key: "portfolioAssets" },
              ].map((row) => (
                <tr key={row.key} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {row.label}
                  </td>
                  {PLANS.filter((p) => p.id !== "enterprise").map((plan) => {
                    const value =
                      plan.limits[row.key as keyof typeof plan.limits];
                    return (
                      <td
                        key={plan.id}
                        className="text-center py-3 px-3 text-gray-700"
                      >
                        {value === -1 ? (
                          <span className="text-green-600 font-semibold">
                            Sınırsız
                          </span>
                        ) : value === 0 ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className="font-medium">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {[
                "Müsaitlik Takvimi",
                "Mentor Eşleştirme",
                "Analitik Dashboard",
                "Öncelikli Sıralama",
                "API Erişimi",
              ].map((feature, idx) => (
                <tr key={feature} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {feature}
                  </td>
                  {PLANS.filter((p) => p.id !== "enterprise").map(
                    (plan, planIdx) => (
                      <td
                        key={plan.id}
                        className="text-center py-3 px-3"
                      >
                        {(idx === 1 && planIdx >= 1) || // Mentor
                        (idx === 0 && planIdx >= 2) || // Takvim
                        (idx === 2 && planIdx >= 3) || // Analitik
                        (idx === 3 && planIdx >= 2) || // Öncelikli
                        (idx === 4 && planIdx >= 3) ? ( // API
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Sıkça Sorulan Sorular
        </h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-gray-900 text-sm">
                  {item.q}
                </span>
                <span
                  className={`text-gray-400 transition-transform text-lg ${
                    openFaq === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-12 text-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Hâlâ kararsız mısınız?
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-8">
              Tüm planlar 14 gün ücretsiz deneme içerir. Kredi kartı
              gerekmeden hemen başlayın.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/kayit"
                className="px-8 py-3.5 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Ücretsiz Dene
              </Link>
              <Link
                href="/iletisim"
                className="px-8 py-3.5 bg-zinc-700/50 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all border border-zinc-600"
              >
                Bize Ulaşın
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
