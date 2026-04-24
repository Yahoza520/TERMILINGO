// TermiLingo - Ornek Veri (Seed)
// Calistirmak icin: npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Ornek veriler olusturuluyor...");

  // --- Fiyatlandirma Planlari ---
  const plans = [
    {
      plan: "FREE" as const,
      name: "Ucretsiz",
      description: "Platformu kesfetmek isteyenler icin",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: {
        maxGlossaries: 1,
        maxPortfolioAssets: 2,
        publicProfile: true,
        calendarAccess: false,
        mentorAccess: false,
      },
      limits: { maxProjects: 3 },
      sortOrder: 0,
    },
    {
      plan: "STUDENT" as const,
      name: "Ogrenci Paketi",
      description:
        "Universite ogrencileri icin sembolik ucretli baslangic paketi",
      monthlyPrice: 29.99,
      yearlyPrice: 249.99,
      features: {
        maxGlossaries: 3,
        maxPortfolioAssets: 5,
        publicProfile: true,
        calendarAccess: true,
        mentorAccess: true,
        studentBadge: true,
      },
      limits: { maxProjects: 10 },
      sortOrder: 1,
    },
    {
      plan: "INDIVIDUAL" as const,
      name: "Bireysel Paket",
      description: "Bireysel tercumanlar icin profesyonel paket",
      monthlyPrice: 149.99,
      yearlyPrice: 1499.99,
      features: {
        maxGlossaries: 10,
        maxPortfolioAssets: 20,
        publicProfile: true,
        calendarAccess: true,
        mentorAccess: false,
        priorityListing: false,
      },
      limits: { maxProjects: 50 },
      sortOrder: 2,
    },
    {
      plan: "PRO" as const,
      name: "Profesyonel Paket",
      description: "Dogrulanmis profesyonel tercumanlar icin",
      monthlyPrice: 349.99,
      yearlyPrice: 3499.99,
      features: {
        maxGlossaries: -1, // sinirsiz
        maxPortfolioAssets: -1,
        publicProfile: true,
        calendarAccess: true,
        mentorAccess: true,
        priorityListing: true,
        verifiedBadge: true,
      },
      limits: { maxProjects: -1 },
      sortOrder: 3,
    },
    {
      plan: "ENTERPRISE" as const,
      name: "Kurumsal Paket",
      description: "Ceviri ajanslari ve buyuk ekipler icin",
      monthlyPrice: 999.99,
      yearlyPrice: 9999.99,
      features: {
        maxGlossaries: -1,
        maxPortfolioAssets: -1,
        publicProfile: true,
        calendarAccess: true,
        mentorAccess: true,
        priorityListing: true,
        verifiedBadge: true,
        teamManagement: true,
        apiAccess: true,
      },
      limits: { maxProjects: -1, maxTeamMembers: 20 },
      sortOrder: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { plan: plan.plan },
      update: plan,
      create: plan,
    });
  }

  console.log(`✅ ${plans.length} fiyatlandirma plani olusturuldu`);

  // --- Ornek Tercuman Kullanici ---
  const translator = await prisma.user.upsert({
    where: { email: "ahmet.tercuman@example.com" },
    update: {},
    create: {
      email: "ahmet.tercuman@example.com",
      name: "Ahmet Yilmaz",
      role: "TRANSLATOR",
      translatorProfile: {
        create: {
          title: "Yeminli Tercuman & Konferans Tercumani",
          bio: "15 yillik deneyime sahip, hukuk ve teknik alanda uzmanlasmis yeminli tercuman.",
          city: "Istanbul",
          experienceYears: 15,
          tier: "PRO",
          isVerified: true,
          badge: "CERTIFIED_PRO",
          languagePairs: [
            { source: "TR", target: "EN", level: "Native" },
            { source: "TR", target: "DE", level: "Advanced" },
            { source: "EN", target: "TR", level: "Native" },
          ],
          specializations: [
            "Hukuk",
            "Maden Hukuku",
            "Teknik",
            "Yapay Zeka",
          ],
          catTools: ["Trados", "MemoQ", "Smartcat"],
          certifications: [
            { name: "YDS", score: "95", year: 2020 },
            { name: "TOEFL", score: "115", year: 2019 },
          ],
          education: [
            {
              school: "Bogazici Universitesi",
              degree: "Lisans",
              field: "Mutercim-Tercumanlik",
              year: 2010,
            },
          ],
          interpreterTypes: ["SIMULTANEOUS", "CONSECUTIVE"],
          hasInfoport: true,
          equipmentNotes: "Bosch Integrus mobil similtane sistemi mevcut",
          hourlyRate: 1500,
          dailyRate: 10000,
          wordRate: 0.35,
          profileSlug: "ahmet-yilmaz",
        },
      },
    },
  });

  // Ornek Terminoloji Sozlugu
  const profile = await prisma.translatorProfile.findUnique({
    where: { userId: translator.id },
  });

  if (profile) {
    const glossary = await prisma.glossary.create({
      data: {
        profileId: profile.id,
        title: "Maden Hukuku Terminolojisi",
        field: "Maden Hukuku",
        sourceLanguage: "TR",
        targetLanguage: "EN",
        description: "Maden hukuku alaninda sik kullanilan terimlerin Turkce-Ingilizce karsiliklari",
        terms: {
          create: [
            { sourceTerm: "Maden ruhsati", targetTerm: "Mining license", context: "Resmi belge" },
            { sourceTerm: "Isletme izni", targetTerm: "Operating permit", context: "Idari islem" },
            { sourceTerm: "Cevher", targetTerm: "Ore", context: "Madencilik" },
            { sourceTerm: "Sondaj", targetTerm: "Drilling", context: "Arama faaliyeti" },
            { sourceTerm: "Cevre etki degerlendirmesi", targetTerm: "Environmental impact assessment", context: "CED raporu" },
          ],
        },
      },
    });

    // Ornek Portfolyo (Ceviri Ornegi)
    await prisma.portfolioAsset.create({
      data: {
        profileId: profile.id,
        type: "TRANSLATION_SAMPLE",
        title: "Hukuk Metni - Maden Ruhsati Basvurusu",
        field: "Maden Hukuku",
        sourceText:
          "Maden ruhsati basvurusu, ilgili mevzuat cercevesinde Maden ve Petrol Isleri Genel Mudurlugu'ne yapilir. Basvuru sahibi, arama izni almak icin gerekli teknik ve mali yeterliligi belgelemelidir.",
        targetText:
          "Mining license applications are submitted to the General Directorate of Mining and Petroleum Affairs within the framework of the relevant legislation. The applicant must document the required technical and financial competency to obtain an exploration permit.",
      },
    });

    // Ornek Musaitlik
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await prisma.availabilitySlot.create({
      data: {
        profileId: profile.id,
        date: tomorrow,
        startTime: new Date(tomorrow.setHours(9, 0, 0)),
        endTime: new Date(tomorrow.setHours(18, 0, 0)),
        isAvailable: true,
        city: "Istanbul",
        notes: "Konferans tercumanligi icin musaitim",
      },
    });
  }

  // --- Ornek Ogrenci ---
  await prisma.user.upsert({
    where: { email: "elif.ogrenci@hacettepe.edu.tr" },
    update: {},
    create: {
      email: "elif.ogrenci@hacettepe.edu.tr",
      name: "Elif Demir",
      role: "STUDENT",
      isStudent: true,
      university: "Hacettepe Universitesi",
      eduEmail: "elif.ogrenci@hacettepe.edu.tr",
      eduVerified: true,
      graduationYear: 2027,
      translatorProfile: {
        create: {
          title: "Mutercim-Tercumanlik Ogrencisi",
          bio: "3. sinif Mutercim-Tercumanlik ogrencisi. Edebiyat ve teknik ceviri alanlarinda gelismekteyim.",
          city: "Ankara",
          experienceYears: 0,
          tier: "JUNIOR",
          badge: "VERIFIED_STUDENT",
          languagePairs: [
            { source: "TR", target: "EN", level: "Advanced" },
            { source: "EN", target: "TR", level: "Advanced" },
          ],
          specializations: ["Edebiyat", "Genel"],
          catTools: ["Smartcat"],
          education: [
            {
              school: "Hacettepe Universitesi",
              degree: "Lisans (devam ediyor)",
              field: "Mutercim-Tercumanlik (Ingilizce)",
              year: 2027,
            },
          ],
          profileSlug: "elif-demir",
        },
      },
    },
  });

  // --- Ornek Isveren ---
  await prisma.user.upsert({
    where: { email: "mehmet@uktcevirihizmetleri.com" },
    update: {},
    create: {
      email: "mehmet@uktcevirihizmetleri.com",
      name: "Mehmet Kaya",
      role: "EMPLOYER",
      employerProfile: {
        create: {
          companyName: "Global Konferans Hizmetleri A.S.",
          sector: "Konferans & Etkinlik",
          city: "Ankara",
          website: "https://globalkonferans.com.tr",
        },
      },
    },
  });

  console.log("✅ Ornek kullanicilar olusturuldu");
  console.log("🎉 Seed islemi tamamlandi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
