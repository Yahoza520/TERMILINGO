// TermiLingo - Translators API
// GET: Tüm tercümanları listele (filtreleme desteği)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const specialization = searchParams.get("specialization");
    const type = searchParams.get("type");

    const whereClause: any = {
      isPublic: true,
      user: {
        role: { in: ["TRANSLATOR", "STUDENT", "ENTERPRISE"] },
      },
    };

    if (city && city !== "Tümü") {
      whereClause.city = city;
    }

    if (specialization) {
      whereClause.specializations = {
        array_contains: [specialization],
      };
    }

    // Tercüman türüne göre filtrele
    if (type === "written") {
      whereClause.wordRate = { not: null };
    } else if (type === "interpreter") {
      whereClause.interpreterTypes = { not: [] };
    } else if (type === "student") {
      whereClause.tier = "JUNIOR";
    }

    const profiles = await prisma.translatorProfile.findMany({
      where: whereClause,
      take: 50,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        glossaries: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        portfolioAssets: {
          where: { type: "TRANSLATION_SAMPLE" },
          take: 1,
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    // Format response
    const formatted = profiles.map((profile) => ({
      id: profile.id,
      name: profile.user.name || "Anonymous",
      title: profile.title || "Tercüman",
      city: profile.city,
      country: profile.country,
      badge: profile.badge,
      tier: profile.tier,
      experienceYears: profile.experienceYears,
      rating: 4.5, // TODO: Average from reviews table
      reviewCount: profile._count.reviews,
      languagePairs: profile.languagePairs || [],
      specializations: profile.specializations || [],
      catTools: profile.catTools || [],
      interpreterTypes: profile.interpreterTypes,
      hasInfoport: profile.hasInfoport,
      education: profile.education || [],
      certifications: profile.certifications || [],
      hourlyRate: profile.hourlyRate?.toString(),
      dailyRate: profile.dailyRate?.toString(),
      wordRate: profile.wordRate?.toString(),
      currency: profile.currency,
      profileSlug: profile.profileSlug,
      isVerified: profile.isVerified,
    }));

    return NextResponse.json({ translators: formatted, count: formatted.length });
  } catch (error) {
    console.error("Translators GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
