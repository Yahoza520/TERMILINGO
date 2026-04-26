import { PrismaClient, UserRole, TranslatorTier, ProfileBadge, InterpreterType } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

async function main() {
  console.log("Seeding matrix translator examples...");

  // Example 1: Yazili Cevirmen (PRO)
  const user1 = await prisma.user.upsert({
    where: { email: "ahmet.yazili@example.com" },
    update: {},
    create: {
      email: "ahmet.yazili@example.com",
      name: "Ahmet Yilmaz",
      passwordHash: hashPassword("123456"),
      role: UserRole.TRANSLATOR,
      emailVerified: new Date(),
      translatorProfile: {
        create: {
          title: "Uzman Yazili Cevirmen",
          bio: "Hukuk ve teknik metinlerde 10 yillik deneyim.",
          city: "Istanbul",
          experienceYears: 10,
          tier: TranslatorTier.PRO,
          badge: ProfileBadge.CERTIFIED_PRO,
          isVerified: true,
          languagePairs: [
            { source: "Turkce", target: "Ingilizce", level: "Anadil" },
            { source: "Ingilizce", target: "Turkce", level: "Ileri" }
          ],
          specializations: ["Hukuk", "Teknik", "Maden Hukuku"],
          catTools: ["SDL Trados", "MemoQ"],
          wordRate: 0.35,
          interpreterTypes: [],
          profileSlug: "ahmet-yilmaz-yazili",
        }
      }
    }
  });

  // Example 2: Sozlu Cevirmen (ENTERPRISE)
  const user2 = await prisma.user.upsert({
    where: { email: "mehmet.sozlu@example.com" },
    update: {},
    create: {
      email: "mehmet.sozlu@example.com",
      name: "Mehmet Can Ozturk",
      passwordHash: hashPassword("123456"),
      role: UserRole.TRANSLATOR,
      emailVerified: new Date(),
      translatorProfile: {
        create: {
          title: "Simultane Konferans Tercumani",
          bio: "Diplomatik ve resmi konferanslarda 20 yillik deneyim.",
          city: "Ankara",
          experienceYears: 20,
          tier: TranslatorTier.ENTERPRISE,
          badge: ProfileBadge.ENTERPRISE,
          isVerified: true,
          languagePairs: [
            { source: "Turkce", target: "Ingilizce", level: "Anadil" },
            { source: "Turkce", target: "Arapca", level: "Ileri" }
          ],
          specializations: ["Diplomatik/Resmi", "Enerji"],
          interpreterTypes: [InterpreterType.SIMULTANEOUS, InterpreterType.CONSECUTIVE],
          hourlyRate: 3000,
          dailyRate: 20000,
          hasInfoport: true,
          profileSlug: "mehmet-can-ozturk-sozlu",
        }
      }
    }
  });

  // Example 3: Ogrenci / Junior
  const user3 = await prisma.user.upsert({
    where: { email: "elif.ogrenci@example.com" },
    update: {},
    create: {
      email: "elif.ogrenci@example.com",
      name: "Elif Demir",
      passwordHash: hashPassword("123456"),
      role: UserRole.STUDENT,
      isStudent: true,
      emailVerified: new Date(),
      translatorProfile: {
        create: {
          title: "Mutercim-Tercumanlik Ogrencisi",
          bio: "Hacettepe Universitesi 3. sinif ogrencisi.",
          city: "Ankara",
          experienceYears: 0,
          tier: TranslatorTier.JUNIOR,
          badge: ProfileBadge.VERIFIED_STUDENT,
          isVerified: true,
          languagePairs: [
            { source: "Turkce", target: "Ingilizce", level: "Ileri" }
          ],
          specializations: ["Edebiyat", "Genel"],
          catTools: ["Smartcat"],
          wordRate: 0.1,
          profileSlug: "elif-demir-ogrenci",
        }
      }
    }
  });

  // Example 4: Tip / Ilac Sektoru (PRO)
  const user4 = await prisma.user.upsert({
    where: { email: "zeynep.tip@example.com" },
    update: {},
    create: {
      email: "zeynep.tip@example.com",
      name: "Zeynep Arslan",
      passwordHash: hashPassword("123456"),
      role: UserRole.TRANSLATOR,
      emailVerified: new Date(),
      translatorProfile: {
        create: {
          title: "Tip & Ilac Sektoru Cevirmeni",
          bio: "Klinik arastirmalar ve ilac prospektusleri uzmani.",
          city: "Izmir",
          experienceYears: 8,
          tier: TranslatorTier.PRO,
          badge: ProfileBadge.CERTIFIED_PRO,
          isVerified: true,
          languagePairs: [
            { source: "Turkce", target: "Ingilizce", level: "Ileri" },
            { source: "Turkce", target: "Fransizca", level: "Ileri" }
          ],
          specializations: ["Tip/Saglik", "Eczacilik"],
          catTools: ["Memsource", "SDL Trados"],
          wordRate: 0.3,
          profileSlug: "zeynep-arslan-tip",
        }
      }
    }
  });

  console.log("Matrix seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
