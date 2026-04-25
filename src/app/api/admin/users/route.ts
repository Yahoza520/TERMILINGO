import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Admin kontrolü
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") return null;
  return user;
}

// GET — Tüm kullanıcıları listele
export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, role: true, image: true,
      emailVerified: true, createdAt: true, isStudent: true,
      _count: { select: { proposals: true, notifications: true, clientRequests: true } },
    },
  });

  return NextResponse.json(users);
}

// PATCH — Kullanıcı rolünü güncelle
export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

  const { userId, role } = await req.json();
  if (!userId || !role) return NextResponse.json({ error: "userId ve role gerekli" }, { status: 400 });

  const validRoles = ["TRANSLATOR", "EMPLOYER", "STUDENT", "ADMIN"];
  if (!validRoles.includes(role)) return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role, isStudent: role === "STUDENT" },
  });

  return NextResponse.json({ message: "Rol güncellendi", user: { id: updated.id, role: updated.role } });
}
