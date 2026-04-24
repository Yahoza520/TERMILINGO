"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import {
  MapPin,
  Star,
  Globe,
  BookOpen,
  Mic,
  Headphones,
  GraduationCap,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// ===========================================
// QUICK VIEW MODAL
// İşverenler tercüman kartına tıklayınca açılan
// hızlı inceleme penceresi. Terminoloji, CV
// detayları ve çeviri örneklerini gösterir.
// ===========================================

interface Translator {
  id: string;
  name: string;
  title: string;
  city: string;
  badge?: string;
  tier: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  languagePairs: { source: string; target: string; level: string }[];
  specializations: string[];
  catTools: string[];
  interpreterTypes: string[];
  hasInfoport: boolean;
  education: { school: string; degree: string; field: string; year: number }[];
  certifications: { name: string; score: string; year: number }[];
  glossary?: {
    title: string;
    field: string;
    terms: { sourceTerm: string; targetTerm: string }[];
  };
  sample?: {
    title: string;
    field: string;
    sourceText: string;
    targetText: string;
  };
  hourlyRate?: number;
  dailyRate?: number;
  wordRate?: number;
  currency: string;
  profileSlug: string;
}

interface QuickViewProps {
  translator: Translator | null;
  isOpen: boolean;
  onClose: () => void;
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

export default function QuickView({ translator, isOpen, onClose }: QuickViewProps) {
  const [activeTab, setActiveTab] = useState<"cv" | "glossary" | "sample">("cv");

  if (!translator) return null;

  const currencySymbol = CURRENCY_SYMBOLS[translator.currency] || translator.currency;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translator.name} size="xl">
      {/* Üst Bilgi */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{translator.name}</h3>
            {translator.badge && BADGE_LABELS[translator.badge] && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  BADGE_LABELS[translator.badge].color
                }`}
              >
                {BADGE_LABELS[translator.badge].label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{translator.title}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {translator.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              {translator.rating.toFixed(1)} ({translator.reviewCount} değerlendirme)
            </span>
            <span>{translator.experienceYears} yıl deneyim</span>
          </div>
        </div>
        <a
          href={`/translator/${translator.profileSlug}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Tam Profil <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Dil Çiftleri */}
      <div className="flex flex-wrap gap-2 mb-4">
        {translator.languagePairs.map((pair, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
          >
            <Globe className="w-3 h-3" />
            {pair.source} → {pair.target}
          </span>
        ))}
        {translator.interpreterTypes.length > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
            <Mic className="w-3 h-3" />
            Sözlü Çeviri
          </span>
        )}
        {translator.hasInfoport && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
            <Headphones className="w-3 h-3" />
            İnfoport Mevcut
          </span>
        )}
      </div>

      {/* Fiyat Bilgisi */}
      {(translator.hourlyRate || translator.dailyRate || translator.wordRate) && (
        <div className="flex gap-4 mb-6 p-3 bg-gray-50 rounded-xl">
          {translator.wordRate && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {currencySymbol}{translator.wordRate}
              </div>
              <div className="text-xs text-gray-500">kelime başı</div>
            </div>
          )}
          {translator.hourlyRate && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {currencySymbol}{translator.hourlyRate}
              </div>
              <div className="text-xs text-gray-500">saatlik</div>
            </div>
          )}
          {translator.dailyRate && (
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {currencySymbol}{translator.dailyRate}
              </div>
              <div className="text-xs text-gray-500">günlük</div>
            </div>
          )}
        </div>
      )}

      {/* Sekmeler */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { key: "cv" as const, label: "CV Detay", icon: GraduationCap },
          { key: "glossary" as const, label: "Terminoloji", icon: BookOpen },
          { key: "sample" as const, label: "Çeviri Örneği", icon: ChevronRight },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CV Detay Sekmesi */}
      {activeTab === "cv" && (
        <div className="space-y-4">
          {/* Uzmanlık */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Uzmanlık Alanları</h4>
            <div className="flex flex-wrap gap-1.5">
              {translator.specializations.map((spec) => (
                <span key={spec} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* CAT Tools */}
          {translator.catTools.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">CAT Araçları</h4>
              <div className="flex flex-wrap gap-1.5">
                {translator.catTools.map((tool) => (
                  <span key={tool} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Eğitim */}
          {translator.education.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Eğitim</h4>
              {translator.education.map((edu, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    <strong>{edu.school}</strong> — {edu.degree}, {edu.field} ({edu.year})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Sertifikalar */}
          {translator.certifications.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Sertifikalar</h4>
              {translator.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-sm">
                    {cert.name}: <strong>{cert.score}</strong> ({cert.year})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Terminoloji Sekmesi */}
      {activeTab === "glossary" && (
        <div>
          {translator.glossary ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{translator.glossary.title}</h4>
                <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                  {translator.glossary.field}
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-500 font-medium">Kaynak</th>
                    <th className="text-left py-2 text-gray-500 font-medium">Hedef</th>
                  </tr>
                </thead>
                <tbody>
                  {translator.glossary.terms.map((term, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2 text-gray-900">{term.sourceTerm}</td>
                      <td className="py-2 text-blue-700 font-medium">{term.targetTerm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Bu tercüman henüz terminoloji sözlüğü eklememiş.
            </p>
          )}
        </div>
      )}

      {/* Çeviri Örneği Sekmesi */}
      {activeTab === "sample" && (
        <div>
          {translator.sample ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">{translator.sample.title}</h4>
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                  {translator.sample.field}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Kaynak Metin</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {translator.sample.sourceText}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h5 className="text-xs font-semibold text-blue-600 mb-2 uppercase">Çeviri</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {translator.sample.targetText}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Bu tercüman henüz çeviri örneği eklememiş.
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}
