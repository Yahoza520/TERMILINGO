import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") return null;
  return user;
}

// GET — Tüm talepleri listele
export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

  const requests = await prisma.translationRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      _count: { select: { proposals: true } },
    },
  });

  return NextResponse.json(requests);
}
