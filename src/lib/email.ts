// TermiLingo - E-posta Gönderim Servisi
// Nodemailer ile SMTP üzerinden e-posta gönderimi
// Not: nodemailer kurulu değilse, DEV modda konsola yazar

let nodemailer: any = null;
try {
  nodemailer = require("nodemailer");
} catch {
  // nodemailer kurulu değil — dev mode'da çalışacak
}

// SMTP transporter oluştur
function createTransporter() {
  if (!nodemailer) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Genel e-posta gönderim fonksiyonu
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // SMTP yapılandırılmamışsa veya nodemailer yoksa konsola yaz
  if (!nodemailer || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("📧 [DEV MODE] E-posta gönderimi simüle edildi:");
    console.log(`  Kime: ${to}`);
    console.log(`  Konu: ${subject}`);
    console.log(`  İçerik uzunluğu: ${html.length} karakter`);
    return { success: true, dev: true };
  }

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"TermiLingo" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  return { success: true, messageId: info.messageId };
}

// Müşteriye teklif bildirimi e-postası
export async function sendProposalEmail({
  clientName,
  clientEmail,
  translatorName,
  translatorTitle,
  price,
  currency,
  estimatedDays,
  message,
  requestTitle,
}: {
  clientName: string;
  clientEmail: string;
  translatorName: string;
  translatorTitle: string;
  price: string;
  currency: string;
  estimatedDays?: number;
  message?: string;
  requestTitle: string;
}) {
  const subject = `TermiLingo — "${requestTitle}" talebinize yeni teklif geldi`;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="text-align:center;padding:24px 0;">
              <div style="display:inline-block;width:40px;height:40px;background-color:#18181b;border-radius:10px;line-height:40px;text-align:center;">
                <span style="color:white;font-weight:bold;font-size:18px;">T</span>
              </div>
              <span style="font-size:20px;font-weight:bold;color:#18181b;margin-left:8px;vertical-align:middle;">TermiLingo</span>
            </td>
          </tr>
        </table>

        <!-- Main Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Blue header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;font-weight:600;">Yeni Teklif Aldınız! 🎉</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                "${requestTitle}" talebinize bir tercüman teklif gönderdi.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 24px;">
                Merhaba <strong>${clientName}</strong>,
              </p>

              <!-- Translator Info -->
              <table width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Tercüman</p>
                    <p style="margin:0 0 2px;font-size:17px;font-weight:600;color:#1e293b;">${translatorName}</p>
                    <p style="margin:0;font-size:13px;color:#64748b;">${translatorTitle}</p>
                  </td>
                </tr>
              </table>

              <!-- Price & Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
                    <table width="100%">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#16a34a;">Teklif Tutarı</p>
                          <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#15803d;">${price} ${currency}</p>
                        </td>
                        ${
                          estimatedDays
                            ? `<td style="text-align:right;">
                            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#16a34a;">Tahmini Süre</p>
                            <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#15803d;">${estimatedDays} gün</p>
                          </td>`
                            : ""
                        }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${
                message
                  ? `
              <!-- Message -->
              <table width="100%" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;background:#f8fafc;border-left:3px solid #2563eb;border-radius:0 8px 8px 0;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Tercümandan Mesaj</p>
                    <p style="margin:0;font-size:14px;color:#475569;line-height:1.6;">${message}</p>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <!-- CTA -->
              <table width="100%" style="margin-bottom:16px;">
                <tr>
                  <td style="text-align:center;">
                    <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/musteri/taleplerim"
                      style="display:inline-block;padding:14px 32px;background:#18181b;color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
                      Teklifi İncele →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
                Teklifi kabul veya reddetmek için TermiLingo platformunu ziyaret edin.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" style="margin-top:24px;">
          <tr>
            <td style="text-align:center;padding:16px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                TermiLingo — Türkiye'nin Profesyonel Tercüman Platformu
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">
                Bu e-posta ${clientEmail} adresine gönderilmiştir.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to: clientEmail, subject, html });
}

// Tercümana yeni talep bildirimi e-postası
export async function sendRequestNotificationEmail({
  translatorName,
  translatorEmail,
  requestTitle,
  requestType,
  sourceLanguage,
  targetLanguage,
  field,
  budget,
  currency,
}: {
  translatorName: string;
  translatorEmail: string;
  requestTitle: string;
  requestType: string;
  sourceLanguage: string;
  targetLanguage: string;
  field?: string;
  budget?: string;
  currency: string;
}) {
  const typeLabels: Record<string, string> = {
    WRITTEN: "Yazılı Çeviri",
    SIMULTANEOUS: "Simültane Tercümanlık",
    CONSECUTIVE: "Ardıl Tercümanlık",
    LIAISON: "İrtibat Tercümanlığı",
  };

  const subject = `TermiLingo — Uzmanlık alanınıza uygun yeni çeviri talebi`;

  const html = `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f8f9fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;padding:32px 16px;">
    <tr>
      <td>
        <table width="100%" style="margin-bottom:24px;text-align:center;padding:24px 0;">
          <tr>
            <td>
              <div style="display:inline-block;width:40px;height:40px;background-color:#18181b;border-radius:10px;line-height:40px;text-align:center;">
                <span style="color:white;font-weight:bold;font-size:18px;">T</span>
              </div>
              <span style="font-size:20px;font-weight:bold;color:#18181b;margin-left:8px;vertical-align:middle;">TermiLingo</span>
            </td>
          </tr>
        </table>

        <table width="100%" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:32px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;">Yeni Çeviri Talebi 📋</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
                Uzmanlık alanınıza uygun bir talep oluşturuldu.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="color:#374151;font-size:15px;margin:0 0 24px;">
                Merhaba <strong>${translatorName}</strong>,
              </p>

              <table width="100%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
                <tr><td style="padding:16px;">
                  <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#1e293b;">${requestTitle}</p>
                  <table width="100%" cellpadding="4">
                    <tr>
                      <td style="font-size:13px;color:#94a3b8;width:120px;">Tür:</td>
                      <td style="font-size:13px;color:#475569;font-weight:500;">${typeLabels[requestType] || requestType}</td>
                    </tr>
                    <tr>
                      <td style="font-size:13px;color:#94a3b8;">Dil Çifti:</td>
                      <td style="font-size:13px;color:#475569;font-weight:500;">${sourceLanguage} → ${targetLanguage}</td>
                    </tr>
                    ${field ? `<tr><td style="font-size:13px;color:#94a3b8;">Alan:</td><td style="font-size:13px;color:#475569;font-weight:500;">${field}</td></tr>` : ""}
                    ${budget ? `<tr><td style="font-size:13px;color:#94a3b8;">Bütçe:</td><td style="font-size:13px;color:#475569;font-weight:500;">${budget} ${currency}</td></tr>` : ""}
                  </table>
                </td></tr>
              </table>

              <table width="100%" style="margin-bottom:16px;">
                <tr><td style="text-align:center;">
                  <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/requests"
                    style="display:inline-block;padding:14px 32px;background:#7c3aed;color:white;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
                    Talebi İncele ve Teklif Ver →
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>

        <table width="100%" style="margin-top:24px;">
          <tr><td style="text-align:center;padding:16px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">TermiLingo — Türkiye'nin Profesyonel Tercüman Platformu</p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return sendEmail({ to: translatorEmail, subject, html });
}
