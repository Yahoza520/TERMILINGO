# TermiLingo - Kurulum Rehberi

## Proje Nedir?
TermiLingo, tercumanlar ve isverenler icin bir SaaS pazar yeri platformudur.
Yazili ceviri, sozlu ceviri (similtane/ardil), ogrenci mentorluğu ve
terminoloji portfolyo ozelliklerini bir arada sunar.

## Teknoloji
- **Next.js 16** (React framework)
- **Prisma ORM** (Veritabani yonetimi)
- **PostgreSQL** (Veritabani)
- **Shadcn/ui** (Arayuz bilesenleri)
- **Tailwind CSS** (Stil)
- **NextAuth.js** (Kimlik dogrulama)

---

## Kurulum Adimlari

### 1. PostgreSQL Kur
Bilgisayarinda PostgreSQL yoksa:
- **Mac:** `brew install postgresql@16`
- **Windows:** https://www.postgresql.org/download/windows/
- Sonra `termilingo` adinda bir veritabani olustur:
  ```
  createdb termilingo
  ```

### 2. Bagimlilikları Yukle
```bash
cd TERMILINGO
npm install
```

### 3. Ortam Degiskenlerini Ayarla
`.env` dosyasindaki `DATABASE_URL` satirini kendi PostgreSQL bilgilerinle guncelle:
```
DATABASE_URL="postgresql://KULLANICI:SIFRE@localhost:5432/termilingo"
```

### 4. Veritabanini Olustur
```bash
npx prisma migrate dev --name init
```
Bu komut tum tablolari otomatik olusturur.

### 5. Ornek Verileri Yukle
```bash
npx prisma db seed
```

### 6. Projeyi Calistir
```bash
npm run dev
```
Tarayicida `http://localhost:3000` adresini ac.

---

## Veritabani Seması Ozeti

| Tablo | Aciklama |
|-------|----------|
| `users` | Tum kullanicilar (tercuman, isveren, ogrenci, admin) |
| `translator_profiles` | Tercuman detay profili (dil, uzmanlik, fiyat, ekipman) |
| `employer_profiles` | Isveren sirket bilgileri |
| `glossaries` | Terminoloji sozlukleri (alan bazli) |
| `glossary_terms` | Sozlukteki terim ciftleri (TR→EN vb.) |
| `portfolio_assets` | Ceviri ornekleri ve sertifikalar |
| `availability_slots` | Musaitlik takvimi (sozlu ceviri icin) |
| `projects` | Is ilanlari ve projeler |
| `mentorships` | Mentor-mentee iliskileri |
| `mentor_approvals` | Mentor onay kayitlari |
| `reviews` | Degerlendirme/puanlama |
| `subscriptions` | Kullanici abonelikleri |
| `pricing_plans` | Abonelik paket tanimlari ve fiyatlari |

## Sonraki Adimlar
1. **Asama 2:** Profile Builder (adim adim form)
2. **Asama 3:** Marketplace listeleme sayfasi (Yazili/Sozlu/Ogrenci sekmeleri)
3. **Asama 4:** Stripe/Iyzico abonelik entegrasyonu
