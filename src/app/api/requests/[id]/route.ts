// TermiLingo - Request Actions API
// PATCH: Talep durumu güncelle (arşivle, iptal et, tamamla)

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
    const { action } = body;

    const request = await prisma.translationRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json({ error: "Talep bulunamadı." }, { status: 404 });
    }

    // Yetki: sadece talebi oluşturan müşteri
    if (request.clientUserId !== session.user.id) {
      return NextResponse.json({ error: "Bu işlem için yetkiniz yok." }, { status: 403 });
    }

    switch (action) {
      case "archive":
        await prisma.translationRequest.update({
          where: { id },
          data: { isArchived: true },
        });
        return NextResponse.json({ success: true, message: "Talep arşivlendi." });

      case "unarchive":
        await prisma.translationRequest.update({
          where: { id },
          data: { isArchived: false },
        });
        return NextResponse.json({ success: true, message: "Talep arşivden çıkarıldı." });

      case "cancel":
        await prisma.translationRequest.update({
          where: { id },
          data: { status: "CANCELLED" },
        });
        return NextResponse.json({ success: true, message: "Talep iptal edildi." });

      case "complete":
        await prisma.translationRequest.update({
          where: { id },
          data: { status: "COMPLETED" },
        });
        return NextResponse.json({ success: true, message: "Talep tamamlandı." });

      default:
        return NextResponse.json({ error: "Geçersiz işlem." }, { status: 400 });
    }
  } catch (error) {
    console.error("Request action error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
