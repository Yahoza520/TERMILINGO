"use client";

import {
  MapPin,
  Star,
  Globe,
  Mic,
  Headphones,
  BookOpen,
  Eye,
} from "lucide-react";

// ===========================================
// TERCUMAN KARTI
// Marketplace listesinde her tercüman için
// gösterilen özet kart bileşeni.
// ===========================================

interface TranslatorCardProps {
  translator: {
    id: string;
    name: string;
    title: string;
    city: string;
    badge?: string;
    tier: string;
    experienceYears: number;
    rating: number;
    reviewCount: number;
    languagePairs: { source: string; target: string }[];
    specializations: string[];
    interpreterTypes: string[];
    hasInfoport: boolean;
    hourlyRate?: number;
    wordRate?: number;
    currency: string;
  };
  onQuickView: () => void;
}

const BADGE_LABELS: Record<string, { label: string; color: string }> = {
  ACADEMIC_CANDIDATE: { label: "Akademik Aday", color: "bg-purple-100 text-purple-700" },
  VERIFIED_STUDENT: { label: "Doğrulanmış Öğrenci", color: "bg-indigo-100 text-indigo-700" },
  CERTIFIED_PRO: { label: "Sertifikalı Pro", color: "bg-emerald-100 text-emerald-700" },
  TOP_RATED: { label: "En Yüksek Puan", color: "bg-amber-100 text-amber-700" },
  ENTERPRISE: { label: "Kurumsal", color: "bg-blue-100 text-blue-700" },
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function TranslatorCard({ translator, onQuickView }: TranslatorCardProps) {
  const currencySymbol = CURRENCY_SYMBOLS[translator.currency] || translator.currency;

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-5 group">
      {/* Üst: İsim & Rozet */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{translator.name}</h3>
            {translator.badge && BADGE_LABELS[translator.badge] && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  BADGE_LABELS[translator.badge].color
                }`}
              >
                {BADGE_LABELS[translator.badge].label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{translator.title}</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-medium">{translator.rating.toFixed(1)}</span>
          <span className="text-gray-400">({translator.reviewCount})</span>
        </div>
      </div>

      {/* Konum & Deneyim */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {translator.city}
        </span>
        <span>{translator.experienceYears} yıl</span>
        {translator.interpreterTypes.length > 0 && (
          <span className="flex items-center gap-1 text-violet-600">
            <Mic className="w-3 h-3" /> Sözlü
          </span>
        )}
        {translator.hasInfoport && (
          <span className="flex items-center gap-1 text-emerald-600">
            <Headphones className="w-3 h-3" /> İnfoport
          </span>
        )}
      </div>

      {/* Dil Çiftleri */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {translator.languagePairs.slice(0, 3).map((pair, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-medium"
          >
            <Globe className="w-3 h-3" />
            {pair.source} → {pair.target}
          </span>
        ))}
        {translator.languagePairs.length > 3 && (
          <span className="text-[11px] text-gray-400">
            +{translator.languagePairs.length - 3} daha
          </span>
        )}
      </div>

      {/* Uzmanlık */}
      <div className="flex flex-wrap gap-1 mb-4">
        {translator.specializations.slice(0, 4).map((spec) => (
          <span key={spec} className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[11px]">
            {spec}
          </span>
        ))}
      </div>

      {/* Alt: Fiyat & Quick View */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex gap-4 text-sm">
          {translator.wordRate && (
            <div>
              <span className="font-semibold text-gray-900">
                {currencySymbol}{translator.wordRate}
              </span>
              <span className="text-gray-400 text-xs">/kelime</span>
            </div>
          )}
          {translator.hourlyRate && (
            <div>
              <span className="font-semibold text-gray-900">
                {currencySymbol}{translator.hourlyRate}
              </span>
              <span className="text-gray-400 text-xs">/saat</span>
            </div>
          )}
        </div>
        <button
          onClick={onQuickView}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Eye className="w-3.5 h-3.5" /> Hızlı İncele
        </button>
      </div>
    </div>
  );
}
