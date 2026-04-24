// TermiLingo - KVKK Aydınlatma Metni & Gizlilik Politikası

export const metadata = {
  title: "KVKK Aydınlatma Metni - TermiLingo",
  description: "Kişisel verilerinizin korunması hakkında aydınlatma metni ve gizlilik politikası.",
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl text-gray-900">TermiLingo</span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/marketplace" className="text-gray-600 hover:text-gray-900">Pazar Yeri</a>
            <a href="/kayit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">Üye Ol</a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          {/* Başlık */}
          <div className="mb-10 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Aydınlatma Metni</h1>
            <p className="text-gray-500">Son güncelleme: 24 Nisan 2026</p>
          </div>

          {/* Giriş */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Giriş</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              TermiLingo ("Platform", "biz" veya "bizim" olarak anılır), kişisel verilerinizin gizliliğine ve güvenliğine saygı duyar. Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili mevzuat kapsamında, kişisel verilerinizin nasıl toplandığını, işlendiğini, saklandığını ve korunduğunu açıklar.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Platformumuzu kullanarak, bu aydınlatma metninin tümünü okuduğunuzu, anladığınızı ve kişisel verilerinizin işlenmesine rıza gösterdiğinizi kabul etmiş olursunuz. Rızanız, verilerinizin işlenmesini yasalar gereği yöntemlere tabi tutar.
            </p>
          </section>

          {/* Veri Sorumlusu */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Veri Sorumlusu</h2>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <p className="text-gray-700">
                <strong>Veri Sorumlusu:</strong> TermiLingo Teknoloji A.Ş.<br />
                <strong>Adres:</strong> Türkiye<br />
                <strong>Email:</strong> info@termilingo.com<br />
                <strong>Telefon:</strong> +90 (555) 000 00 00
              </p>
            </div>
          </section>

          {/* Toplanan Veriler */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Toplanan Kişisel Veriler</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Platformumuz aşağıdaki kişisel verilerinizi toplayabilir:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Kimlik Bilgileri</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ad, soyad</li>
                  <li>• Email adresi</li>
                  <li>• Telefon numarası</li>
                  <li>• Konum (şehir)</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Tercüman Profili</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Uzmanlık alanları</li>
                  <li>• Dil yetkinlikleri</li>
                  <li>• CAT araçları</li>
                  <li>• Fiyatlandırma</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Eğitim & Deneyim</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Eğitim geçmişi</li>
                  <li>• Sertifikalar</li>
                  <li>• Referanslar</li>
                  <li>• Çeviri portföyü</li>
                </ul>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-2">Teknik Veriler</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• IP adresi</li>
                  <li>• Çerez bilgileri</li>
                  <li>• Kullanım verileri</li>
                  <li>• Cihaz bilgileri</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Veri İleninge Amaçları */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Verilerin İşlenme Amaçları</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, aşağıdaki amaçlar doğrultusunda yasal olarak işlenir:
            </p>
            <ul className="space-y-3">
              {[
                "Hizmetlerimizi size sunmak ve profil oluşturmak",
                "Tercüman-ağ kümeleri kurmak ve eşleştirmek",
                "Mesajlaşma ve iletişim sistemini çalıştırmak",
                "Ödemeleri ve abonelikleri yönetmek",
                "Platform güvenliğini sağlamak",
                "Yasal yükümlülükleri yerine getirmek",
                "Hizmet kalitesini iyileştirmek için analiz yapmak",
                "Size özel teklif ve duyurular göndermek",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Veri Paylaşımı */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Verilerin Paylaşımı</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, yasalara uygun olarak aşağıdaki durumlarda üçüncü taraflarla paylaşılabilir:
            </p>
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Ödeme Hizmeti Sağlayıcıları:</strong> Stripe (kredi kartı işlemleri)</li>
                <li>• <strong>Bulut Hizmeti Sağlayıcıları:</strong> Vercel, AWS (veri saklama)</li>
                <li>• <strong>Email Hizmeti:</strong> SendGrid (bildirim email'leri)</li>
                <li>• <strong>Yasal Zorunluluk:</strong> Mahkeme veya kanuni otorite talebi</li>
                <li>• <strong>İş Ortağı Hizmetler:</strong> Size ek hizmet sağlayan iş ortakları (izninizle)</li>
              </ul>
            </div>
          </section>

          {/* Veri Saklama */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Veri Saklama Süresi</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz, aşağıdaki kriterlere göre saklanır:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <strong>Aktif Hesap:</strong> Hesabınız aktif olduğu sürece verileriniz saklanır.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <strong>Abonelik Geçmişi:</strong> Muhasebe ve vergi yükümlülükleri için 5 yıl.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <strong>Mesajlaşma:</strong> İletişim geçmişi 2 yıl.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <strong>Hesap Silme:</strong> Hesabınızı sildiğinizde tüm verileriniz 30 günde tamamen silinir.
                </div>
              </li>
            </ul>
          </section>

          {/* Haklarınız */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. KVKK Kapsamındaki Haklarınız</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
                "Kişisel verilerinizi işlenme amacını öğrenme",
                "Yurtdışına aktarılıp aktarılmadığını öğrenme",
                "Kişisel verilerinizin eksik veya yanlış işlenmesinin düzeltilmesini talep etme",
                "KVKK'da öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini talep etme",
                "Kişisel verilerinizin düzeltilmesi, silinmesi veya yok edilmesini talep etme",
                "İşlenen verilerinizin kontrol edilmesini talep etme",
                "KVKK'da öngörülen şartlar çerçevesinde ihlalin giderilmesini talep etme",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* İletişim */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. İletişim</h2>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verilerinizle ilgili talepleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz:
            </p>
            <div className="mt-4 p-5 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-gray-700">
                <strong>Email:</strong> kvkk@termilingo.com<br />
                <strong>Adres:</strong> TermiLingo Teknoloji A.Ş., Beşiktaş/İstanbul<br />
                <strong>Talep Formu:</strong> {" "}
                <a href="mailto:kvkk@termilingo.com" className="text-blue-600 hover:underline">
                  kvkk@termilingo.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p className="mb-2">
            <a href="/gizlilik" className="hover:text-gray-600">Gizlilik Politikası</a>
            {" "}•{" "}
            <a href="/kullanim-sartlari" className="hover:text-gray-600">Kullanım Şartları</a>
          </p>
          <p>© {new Date().getFullYear()} TermiLingo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
