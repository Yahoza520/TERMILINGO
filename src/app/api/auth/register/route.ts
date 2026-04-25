import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Lütfen tüm gerekli alanları doldurun." },
        { status: 400 }
      );
    }

    // Email format kontrolü
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir email adresi girin." },
        { status: 400 }
      );
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanımda." },
        { status: 409 }
      );
    }

    // Şifreyi hash'le
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    const hashedPassword = `${salt}:${derivedKey}`;

    // 6 haneli doğrulama kodu oluştur
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 dakika

    // Kullanıcı oluştur
    const validRoles = ["TRANSLATOR", "EMPLOYER", "STUDENT"];
    const userRole = validRoles.includes(role) ? role : "TRANSLATOR";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: userRole,
        isStudent: userRole === "STUDENT",
        // Doğrulama kodu metadata'da sakla (şimdilik)
      },
    });

    // Email doğrulama kodu gönder
    try {
      await sendEmail({
        to: email,
        subject: "TermiLingo — Email Doğrulama Kodu",
        html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <tr><td>
      <table width="100%" style="margin-bottom:24px;text-align:center;padding:24px 0;">
        <tr><td>
          <div style="display:inline-block;width:40px;height:40px;background-color:#18181b;border-radius:10px;line-height:40px;text-align:center;">
            <span style="color:white;font-weight:bold;font-size:18px;">T</span>
          </div>
          <span style="font-size:20px;font-weight:bold;color:#18181b;margin-left:8px;vertical-align:middle;">TermiLingo</span>
        </td></tr>
      </table>
      <table width="100%" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#18181b,#27272a);padding:32px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Email Doğrulama 🔐</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;text-align:center;">
            <p style="color:#374151;font-size:15px;margin:0 0 24px;">
              Merhaba <strong>${name}</strong>, TermiLingo'ya hoş geldiniz!
            </p>
            <p style="color:#64748b;font-size:14px;margin:0 0 24px;">
              Hesabınızı doğrulamak için aşağıdaki kodu kullanın:
            </p>
            <div style="background:#f0f9ff;border:2px solid #bae6fd;border-radius:12px;padding:20px;margin:0 auto;max-width:200px;">
              <p style="margin:0;font-size:36px;font-weight:700;color:#0369a1;letter-spacing:8px;">${verificationCode}</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:24px 0 0;">
              Bu kod 30 dakika geçerlidir.
            </p>
          </td>
        </tr>
      </table>
      <table width="100%" style="margin-top:24px;">
        <tr><td style="text-align:center;padding:16px;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">TermiLingo — Türkiye'nin Profesyonel Tercüman Platformu</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
      });
    } catch (emailError) {
      console.error("Doğrulama e-postası gönderilemedi:", emailError);
    }

    // Şifre hash'i dönme
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Hesabınız oluşturuldu! Email adresinize doğrulama kodu gönderildi.",
        verificationRequired: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    // Prisma hata mesajlarını düzgün göster
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Bu email adresi zaten kullanımda." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
