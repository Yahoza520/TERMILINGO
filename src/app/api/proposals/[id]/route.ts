// TermiLingo - Proposal Actions API
// PATCH: Teklif durumu güncelle (kabul/red/arşivle/düzenle)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action, price, message, estimatedDays } = body;

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: {
        request: true,
        translator: { select: { id: true, name: true, email: true } },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Teklif bulunamadı." }, { status: 404 });
    }

    // Yetki kontrolü
    const isTranslator = proposal.translatorId === session.user.id;
    const isClient = proposal.request.clientUserId === session.user.id;

    switch (action) {
      case "accept": {
        if (!isClient) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        // Teklifi kabul et
        await prisma.proposal.update({
          where: { id },
          data: { status: "ACCEPTED" },
        });

        // Diğer teklifleri reddet
        await prisma.proposal.updateMany({
          where: {
            requestId: proposal.requestId,
            id: { not: id },
            status: { in: ["PENDING", "SENT"] },
          },
          data: { status: "REJECTED" },
        });

        // Talebi güncelle
        await prisma.translationRequest.update({
          where: { id: proposal.requestId },
          data: { status: "ASSIGNED" },
        });

        // Tercümana bildirim
        await prisma.notification.create({
          data: {
            userId: proposal.translatorId,
            type: "PROPOSAL_ACCEPTED",
            title: "Teklifiniz Kabul Edildi! 🎉",
            message: `"${proposal.request.title}" talebi için teklifiniz kabul edildi. Müşteri: ${proposal.request.clientName}`,
            requestId: proposal.requestId,
          },
        });

        return NextResponse.json({ success: true, message: "Teklif kabul edildi." });
      }

      case "reject": {
        if (!isClient) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        await prisma.proposal.update({
          where: { id },
          data: { status: "REJECTED" },
        });

        // Tercümana bildirim
        await prisma.notification.create({
          data: {
            userId: proposal.translatorId,
            type: "PROPOSAL_REJECTED",
            title: "Teklifiniz Reddedildi",
            message: `"${proposal.request.title}" talebi için teklifiniz reddedildi.`,
            requestId: proposal.requestId,
          },
        });

        return NextResponse.json({ success: true, message: "Teklif reddedildi." });
      }

      case "edit": {
        if (!isTranslator) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        if (proposal.status !== "PENDING" && proposal.status !== "SENT") {
          return NextResponse.json({
            error: "Sadece beklemede veya gönderilmiş teklifler düzenlenebilir.",
          }, { status: 400 });
        }

        const updateData: any = {};
        if (price !== undefined) updateData.price = parseFloat(price);
        if (message !== undefined) updateData.message = message;
        if (estimatedDays !== undefined) updateData.estimatedDays = parseInt(estimatedDays);

        const updated = await prisma.proposal.update({
          where: { id },
          data: updateData,
        });

        return NextResponse.json({ success: true, proposal: updated, message: "Teklif güncellendi." });
      }

      case "withdraw": {
        if (!isTranslator) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        await prisma.proposal.update({
          where: { id },
          data: { status: "WITHDRAWN" },
        });

        return NextResponse.json({ success: true, message: "Teklif geri çekildi." });
      }

      case "archive": {
        if (!isTranslator && !isClient) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        await prisma.proposal.update({
          where: { id },
          data: { isArchived: true },
        });

        return NextResponse.json({ success: true, message: "Teklif arşivlendi." });
      }

      case "unarchive": {
        if (!isTranslator && !isClient) {
          return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
        }

        await prisma.proposal.update({
          where: { id },
          data: { isArchived: false },
        });

        return NextResponse.json({ success: true, message: "Teklif arşivden çıkarıldı." });
      }

      default:
        return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
    }
  } catch (error) {
    console.error("Proposal action error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
