// TermiLingo - Proposal API
// POST: Tercüman teklif gönderir → müşteriye e-posta gider

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendProposalEmail } from "@/lib/email";

// POST — Teklif oluştur ve müşteriye e-posta gönder
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Teklif göndermek için giriş yapmalısınız." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { requestId, price, currency, message, estimatedDays } = body;

    // Validasyon
    if (!requestId || !price) {
      return NextResponse.json(
        { error: "Talep ID ve teklif tutarı zorunludur." },
        { status: 400 }
      );
    }

    // Talebi kontrol et
    const request = await prisma.translationRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Talep bulunamadı." },
        { status: 404 }
      );
    }

    if (request.status !== "OPEN" && request.status !== "IN_REVIEW") {
      return NextResponse.json(
        { error: "Bu talep artık teklif kabul etmiyor." },
        { status: 400 }
      );
    }

    // Aynı tercümandan daha önce teklif var mı kontrol et
    const existingProposal = await prisma.proposal.findUnique({
      where: {
        requestId_translatorId: {
          requestId,
          translatorId: session.user.id,
        },
      },
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "Bu talebe zaten teklif verdiniz." },
        { status: 409 }
      );
    }

    // Tercüman bilgilerini al
    const translator = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        translatorProfile: {
          select: { title: true },
        },
      },
    });

    // Teklifi oluştur
    const proposal = await prisma.proposal.create({
      data: {
        requestId,
        translatorId: session.user.id,
        price: parseFloat(price),
        currency: currency || "TRY",
        message: message || null,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null,
        status: "SENT",
      },
    });

    // Müşteriye e-posta gönder
    try {
      await sendProposalEmail({
        clientName: request.clientName,
        clientEmail: request.clientEmail,
        translatorName: translator?.name || "Tercüman",
        translatorTitle:
          translator?.translatorProfile?.title || "Profesyonel Tercüman",
        price: price.toString(),
        currency: currency || "TRY",
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : undefined,
        message,
        requestTitle: request.title,
      });

      console.log(
        `✅ Teklif e-postası gönderildi: ${request.clientEmail}`
      );
    } catch (emailError) {
      console.error("E-posta gönderilemedi:", emailError);
      // E-posta hata verse bile teklif kaydedildi
    }

    // Talep durumunu güncelle (ilk teklif geldiğinde)
    await prisma.translationRequest.update({
      where: { id: requestId },
      data: { status: "IN_REVIEW" },
    });

    // Tercümana bildirim oluştur
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: "PROPOSAL_SENT",
        title: "Teklifiniz Gönderildi",
        message: `"${request.title}" talebi için ${price} ${currency || "TRY"} tutarında teklifiniz müşteriye e-posta ile gönderildi.`,
        requestId,
      },
    });

    return NextResponse.json(
      {
        proposal,
        message: "Teklifiniz başarıyla oluşturuldu ve müşteriye e-posta ile gönderildi.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Proposal error:", error);
    return NextResponse.json(
      { error: "Teklif gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

// GET — Tercümanın kendi tekliflerini listele
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Giriş yapmalısınız." },
        { status: 401 }
      );
    }

    const proposals = await prisma.proposal.findMany({
      where: { translatorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        request: {
          select: {
            title: true,
            type: true,
            sourceLanguage: true,
            targetLanguage: true,
            field: true,
            status: true,
            clientName: true,
          },
        },
      },
    });

    return NextResponse.json({ proposals, count: proposals.length });
  } catch (error) {
    console.error("Proposals GET error:", error);
    return NextResponse.json(
      { error: "Teklifler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
