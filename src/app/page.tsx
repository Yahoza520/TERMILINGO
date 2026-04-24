import { ArrowRight, Globe, Mic, GraduationCap, BookOpen, Shield, Users, ChevronRight, Star, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Full width gradient */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100/80 text-blue-700 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
              <Star className="w-4 h-4" />
              Türkiye&apos;nin #1 Tercüman Platformu
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Profesyonel Tercümana
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Bir Tık Uzaktasınız
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Yazılı çeviri, konferans tercümanlığı ve akademik çeviri için
              Türkiye&apos;nin en nitelikli tercümanlarını tek platformda bulun.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
              >
                Tercüman Bul <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/talep"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Çeviri Talebi Oluştur
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                KVKK Uyumlu
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                100+ Tercüman
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Hızlı Eşleştirme
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              3 basit adımda profesyonel çeviri hizmeti alın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Talebi Oluşturun",
                desc: "Çeviri ihtiyacınızı detaylarıyla paylaşın. Dil çifti, alan ve bütçenizi belirleyin.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "02",
                title: "Teklif Alın",
                desc: "Uygun tercümanlar size otomatik bildirilir ve tekliflerini gönderir.",
                color: "from-violet-500 to-purple-500",
              },
              {
                step: "03",
                title: "Çeviriyi Teslim Alın",
                desc: "Teklifi kabul edin, tercüman işe başlasın. Kaliteli çeviriyi zamanında teslim alın.",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item) => (
              <div key={item.step} className="relative group">
                <div className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden TermiLingo?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Her ihtiyaca uygun özellikler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: "Yazılı Çeviri",
                desc: "Hukuk, tıp, teknik ve daha birçok alanda uzman yazılı tercümanlar.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Mic,
                title: "Konferans Tercümanlığı",
                desc: "Simültane, ardıl ve irtibat tercümanlığı. İnfoport ekipmanı dahil.",
                color: "bg-violet-100 text-violet-600",
              },
              {
                icon: GraduationCap,
                title: "Akademik Köprü",
                desc: "Öğrenciler mentor eşliğinde deneyim kazanır, uygun fiyatlı hizmet.",
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                icon: BookOpen,
                title: "Terminoloji Sözlüğü",
                desc: "Branş bazlı terminoloji listeleri ile kaliteyi önceden görün.",
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                icon: Shield,
                title: "Güven & Kalite",
                desc: "Sertifikalar, çeviri örnekleri ve değerlendirmeler ile doğrulama.",
                color: "bg-amber-100 text-amber-600",
              },
              {
                icon: Users,
                title: "Mentor Sistemi",
                desc: "Kıdemli tercümanlar öğrencilere referans olur. Herkes büyür.",
                color: "bg-rose-100 text-rose-600",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Hemen Başlayın
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto mb-8">
                Tercüman mısınız? Profilinizi oluşturun, müşteri taleplerini alın.
                Müşteri misiniz? Çeviri talebi oluşturun, teklifler gelsin.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/kayit"
                  className="px-8 py-3.5 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                >
                  Ücretsiz Kayıt Ol
                </Link>
                <Link
                  href="/fiyatlandirma"
                  className="px-8 py-3.5 bg-zinc-700/50 text-white rounded-xl font-semibold hover:bg-zinc-700 transition-all border border-zinc-600"
                >
                  Planları İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-gray-900">TermiLingo</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/fiyatlandirma" className="hover:text-gray-900">Fiyatlandırma</Link>
              <Link href="/marketplace" className="hover:text-gray-900">Pazar Yeri</Link>
              <Link href="/kvkk" className="hover:text-gray-900">KVKK</Link>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TermiLingo
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
