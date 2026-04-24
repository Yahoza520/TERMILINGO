// TermiLingo - Profile API
// GET: Kullanıcı profilini getir
// POST: Yeni profil oluştur/güncelle

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/profile - Mevcut profili getir
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        translatorProfile: {
          include: {
            glossaries: { orderBy: { createdAt: "desc" } },
            portfolioAssets: { orderBy: { createdAt: "desc" } },
            availability: { orderBy: { date: "asc" } },
          },
        },
      },
    });

    if (!user?.translatorProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user.translatorProfile });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/profile - Profil oluştur/güncelle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Mevcut profil var mı kontrol et
    const existingProfile = await prisma.translatorProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      // Güncelle
      const updated = await prisma.translatorProfile.update({
        where: { userId: user.id },
        data: {
          title: body.title,
          bio: body.bio,
          city: body.city,
          experienceYears: body.experienceYears,
          profileSlug: body.profileSlug,
          languagePairs: body.languagePairs,
          specializations: body.specializations,
          catTools: body.catTools,
          certifications: body.certifications,
          education: body.education,
          interpreterTypes: body.interpreterTypes,
          hasInfoport: body.hasInfoport,
          equipmentNotes: body.equipmentNotes,
          hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
          dailyRate: body.dailyRate ? parseFloat(body.dailyRate) : null,
          wordRate: body.wordRate ? parseFloat(body.wordRate) : null,
          currency: body.currency,
          updatedAt: new Date(),
        },
        include: {
          glossaries: true,
          portfolioAssets: true,
          availability: true,
        },
      });

      // Glossaries (terminoloji) oluştur/güncelle
      if (body.glossaryTerms?.length > 0 && body.glossaryTitle) {
        // Eski glossaries'i sil
        await prisma.glossary.deleteMany({
          where: { profileId: updated.id },
        });

        await prisma.glossary.create({
          data: {
            profileId: updated.id,
            title: body.glossaryTitle,
            field: body.glossaryField,
            sourceLanguage: "TR",
            targetLanguage: "EN",
            terms: {
              create: body.glossaryTerms.map((term: { sourceTerm: string; targetTerm: string }) => ({
                sourceTerm: term.sourceTerm,
                targetTerm: term.targetTerm,
              })),
            },
          },
        });
      }

      // Portfolio asset (çeviri örneği) oluştur
      if (body.sourceText && body.targetText) {
        await prisma.portfolioAsset.create({
          data: {
            profileId: updated.id,
            type: "TRANSLATION_SAMPLE",
            title: body.sampleTitle || "Çeviri Örneği",
            field: body.sampleField,
            sourceText: body.sourceText,
            targetText: body.targetText,
          },
        });
      }

      return NextResponse.json({ profile: updated, created: false });
    }

    // Yeni profil oluştur
    const created = await prisma.translatorProfile.create({
      data: {
        userId: user.id,
        title: body.title,
        bio: body.bio,
        city: body.city,
        experienceYears: body.experienceYears || 0,
        profileSlug: body.profileSlug,
        languagePairs: body.languagePairs,
        specializations: body.specializations,
        catTools: body.catTools,
        certifications: body.certifications,
        education: body.education,
        interpreterTypes: body.interpreterTypes,
        hasInfoport: body.hasInfoport || false,
        equipmentNotes: body.equipmentNotes,
        hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
        dailyRate: body.dailyRate ? parseFloat(body.dailyRate) : null,
        wordRate: body.wordRate ? parseFloat(body.wordRate) : null,
        currency: body.currency || "TRY",
      },
      include: {
        glossaries: true,
        portfolioAssets: true,
        availability: true,
      },
    });

    // Glossaries oluştur
    if (body.glossaryTerms?.length > 0 && body.glossaryTitle) {
      await prisma.glossary.create({
        data: {
          profileId: created.id,
          title: body.glossaryTitle,
          field: body.glossaryField,
          sourceLanguage: "TR",
          targetLanguage: "EN",
          terms: {
            create: body.glossaryTerms.map((term: { sourceTerm: string; targetTerm: string }) => ({
              sourceTerm: term.sourceTerm,
              targetTerm: term.targetTerm,
            })),
          },
        },
      });
    }

    // Portfolio asset oluştur
    if (body.sourceText && body.targetText) {
      await prisma.portfolioAsset.create({
        data: {
          profileId: created.id,
          type: "TRANSLATION_SAMPLE",
          title: body.sampleTitle || "Çeviri Örneği",
          field: body.sampleField,
          sourceText: body.sourceText,
          targetText: body.targetText,
        },
      });
    }

    return NextResponse.json({ profile: created, created: true });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
