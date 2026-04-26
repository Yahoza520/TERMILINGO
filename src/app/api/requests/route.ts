// TermiLingo - Translation Request API
// POST: Müşteri yeni çeviri talebi oluşturur
// GET: Talepleri listele

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendRequestNotificationEmail } from "@/lib/email";

// POST — Yeni çeviri talebi oluştur ve ilgili tercümanlara bildirim gönder
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    // Sadece EMPLOYER veya ADMIN talep oluşturabilir (veya giriş yapmamış misafir)
    if (userRole === "TRANSLATOR" || userRole === "STUDENT") {
      return NextResponse.json(
        { error: "Tercümanlar veya öğrenciler çeviri talebi oluşturamaz." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      clientName, clientEmail, clientPhone, title, description, type,
      sourceLanguage, targetLanguage, field, city, venue, eventDate,
      budget, currency, deadline, wordCount,
    } = body;

    if (!clientName || !clientEmail || !title || !type || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    const request = await prisma.translationRequest.create({
      data: {
        clientUserId: session?.user?.id || null,
        clientName,
        clientEmail,
        clientPhone: clientPhone || null,
        title,
        description: description || null,
        type,
        sourceLanguage,
        targetLanguage,
        field: field || null,
        city: city || null,
        venue: venue || null,
        eventDate: eventDate ? new Date(eventDate) : null,
        budget: budget ? parseFloat(budget) : null,
        currency: currency || "TRY",
        deadline: deadline ? new Date(deadline) : null,
        wordCount: wordCount ? parseInt(wordCount) : null,
      },
    });

    // İlgili tercümanları bul
    const matchingProfiles = await prisma.translatorProfile.findMany({
      where: { isPublic: true, user: { role: { in: ["TRANSLATOR", "STUDENT"] } } },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    const notifications = [];
    for (const profile of matchingProfiles) {
      const notification = await prisma.notification.create({
        data: {
          userId: profile.user.id,
          type: "NEW_REQUEST",
          title: "Yeni Çeviri Talebi",
          message: `"${title}" başlıklı ${sourceLanguage} → ${targetLanguage} çeviri talebi oluşturuldu.${field ? ` Alan: ${field}` : ""}`,
          requestId: request.id,
          metadata: { requestTitle: title, type, sourceLanguage, targetLanguage, field, budget: budget?.toString(), currency: currency || "TRY" },
        },
      });
      notifications.push(notification);

      try {
        await sendRequestNotificationEmail({
          translatorName: profile.user.name || "Tercüman",
          translatorEmail: profile.user.email,
          requestTitle: title, requestType: type,
          sourceLanguage, targetLanguage, field,
          budget: budget?.toString(), currency: currency || "TRY",
        });
      } catch (emailError) {
        console.error(`E-posta gönderilemedi (${profile.user.email}):`, emailError);
      }
    }

    return NextResponse.json(
      { request, notifiedTranslators: notifications.length, message: `Talebiniz oluşturuldu ve ${notifications.length} tercümana bildirim gönderildi.` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Translation request error:", error);
    return NextResponse.json({ error: "Talep oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}

// GET — Talepleri listele
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");
    const type = searchParams.get("type");
    const myRequests = searchParams.get("myRequests") === "true";
    const archived = searchParams.get("archived") === "true";
    const includeProposals = searchParams.get("includeProposals") === "true";

    const whereClause: any = {};

    // Müşterinin kendi talepleri
    if (myRequests && session?.user?.id) {
      whereClause.clientUserId = session.user.id;
      whereClause.isArchived = archived;
    } else {
      // Genel talepler (tercümanlar için)
      whereClause.isArchived = false;
      if (statusFilter) whereClause.status = statusFilter;
    }

    if (type) whereClause.type = type;

    const requests = await prisma.translationRequest.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        _count: { select: { proposals: true } },
        proposals: includeProposals || myRequests
          ? {
              where: { isArchived: false },
              include: {
                translator: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    translatorProfile: { select: { title: true } },
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            }
          : session?.user?.id
          ? {
              where: { translatorId: session.user.id },
              select: { id: true, status: true },
            }
          : false,
      },
    });

    return NextResponse.json({ requests, count: requests.length });
  } catch (error) {
    console.error("Translation requests GET error:", error);
    return NextResponse.json({ error: "Talepler yüklenirken bir hata oluştu." }, { status: 500 });
  }
}
