import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email ve dogrulama kodu gereklidir." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanici bulunamadi." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email zaten dogrulanmis.", alreadyVerified: true },
        { status: 200 }
      );
    }

    // Kod kontrolu
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Dogrulama kodu hatali." },
        { status: 400 }
      );
    }

    // Sure kontrolu
    if (user.verificationExpiry && new Date() > user.verificationExpiry) {
      return NextResponse.json(
        { error: "Dogrulama kodunun suresi dolmus. Yeni kod gonderin." },
        { status: 400 }
      );
    }

    // Dogrula
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationExpiry: null,
      },
    });

    return NextResponse.json({
      message: "Email basariyla dogrulandi!",
      verified: true,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Dogrulama sirasinda bir hata olustu." },
      { status: 500 }
    );
  }
}
