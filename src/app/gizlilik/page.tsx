// TermiLingo - Gizlilik Politikası

export const metadata = {
  title: "Gizlilik Politikası - TermiLingo",
  description: "TermiLingo gizlilik politikası ve veri koruma bilgileri.",
};

export default function PrivacyPolicyPage() {
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
          <div className="mb-10 pb-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Gizlilik Politikası</h1>
            <p className="text-gray-500">Son güncelleme: 24 Nisan 2026</p>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Özet</h2>
            <p className="text-gray-600 leading-relaxed">
              TermiLingo olarak, kişisel verilerinizin gizliliğini korumak ve yasalara uygun şekilde işlemek ilkemizdir. Bu politika, verilerinizin nasıl toplandığını, kullanıldığını, paylaşıldığını ve korunduğunu açıklar.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Topladığımız Veriler</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Hesap Bilgileri:</strong> Ad, email, şifre (hash'lenmiş)</li>
              <li>• <strong>Profil Bilgileri:</strong> Şehir, uzmanlık alanları, dil bilgisi</li>
              <li>• <strong>İletişim Verileri:</strong> IP adresi, cihaz bilgisi, çerezler</li>
              <li>• <strong>Kullanım Verileri:</strong> Sayfa ziyaretleri, tıklama verileri</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Verilerin Kullanımı</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Kişisel verileriniz şu amaçlar için kullanılır:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Hizmetlerimizi sunmak</li>
              <li>Hesap yönetimi</li>
              <li>Tercüman eşleştirmeleri</li>
              <li>Mesajlaşma sistemi</li>
              <li>Ödeme işlemleri</li>
              <li>Platform güvenliği</li>
              <li>Yasal yükümlülükler</li>
              <li>Hizmet iyileştirmeleri (anonim verilerle)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Çerezler (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed">
               Platformumuz oturum çerezleri ve tercih çerezleri kullanır. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz ancak bu durumda platformun bazı özellikleri çalışmayabilir.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Veri Güvenliği</h2>
            <p className="text-gray-600 leading-relaxed">
               Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz: SSL şifreleme, güvenli sunucular, düzenli güvenlik denetimleri.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Haklarınız</h2>
            <p className="text-gray-600 leading-relaxed">
              Kişisel verilerinizle ilgili olarak erişim, düzeltme, silme ve işleme itiraz etme haklarına sahipsiniz. Taleplerinizi kvkk@termilingo.com adresine iletebilirsiniz.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Değişiklikler</h2>
            <p className="text-gray-600 leading-relaxed">
              Bu politika güncellenebilir. Önemli değişiklikler olursa size email yoluyla bilgi verilecektir.
            </p>
          </section>

          <div className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-center text-gray-500">
              Sorularınız için <a href="mailto:gizlilik@termilingo.com" className="text-blue-600 hover:underline">gizlilik@termilingo.com</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
          <p className="mb-2">
            <a href="/kvkk" className="hover:text-gray-600">KVKK Aydınlatma Metni</a>
            {" "}•{" "}
            <a href="/kullanim-sartlari" className="hover:text-gray-600">Kullanım Şartları</a>
          </p>
          <p>© {new Date().getFullYear()} TermiLingo. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
