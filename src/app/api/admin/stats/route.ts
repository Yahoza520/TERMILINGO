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

// GET — Platform istatistikleri
export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

  const [totalUsers, translators, employers, students, openRequests, totalProposals] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TRANSLATOR" } }),
    prisma.user.count({ where: { role: "EMPLOYER" } }),
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.translationRequest.count({ where: { status: "OPEN" } }),
    prisma.proposal.count(),
  ]);

  return NextResponse.json({
    totalUsers, translators, employers, students,
    openRequests, totalProposals,
  });
}
