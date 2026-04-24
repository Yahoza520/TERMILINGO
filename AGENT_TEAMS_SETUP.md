# TermiLingo - Claude Agent Teams Setup 🤖

## 📋 Nedir Agent Teams?

TermiLingo'da **3 ajan birlikte çalışacak:**

1. **Translator Agent** - Ceviri işleri yönetir
2. **Customer Agent** - Müşteri sorularını cevaplar  
3. **Admin Agent** - Sistem yönetimi ve raporlar

Bunlar paralel çalışır, sorunu en hızlı çözer.

---

## 🛠️ AŞAMA 1: Claude Agent SDK Kurulum

### 1.1 Gerekli Paketler
```bash
npm install @anthropic-sdk/sdk @anthropic-sdk/agent-kit
npm install typescript ts-node @types/node
```

### 1.2 API Key Ayarı
```bash
# Anthropic API key oluştur: https://console.anthropic.com
echo "ANTHROPIC_API_KEY=sk-ant-..." >> .env.production
```

---

## 🤖 AŞAMA 2: 3 Ajan Oluştur

### Agent 1: Translator Agent (Ceviri Yöneticisi)

**Dosya:** `src/agents/translator-agent.ts`

```typescript
import Anthropic from "@anthropic-sdk/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function translatorAgent(projectId: string) {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: `Sen TermiLingo tercüman yönetim ajanısın.
    
Görevlerin:
- Açık ceviri işlerini tercümanlarla eşleştirmek
- Tercümanların müsaitliğini kontrol etmek
- İş durumunu güncellemek
- Kalite kontrol

Tüm kararları PostgreSQL veritabanında kaydet.`,
    messages: [
      {
        role: "user",
        content: `Proje ID: ${projectId}
        
1. Bu projeye uygun tercümanları bul
2. Müsaitlik takvimini kontrol et
3. En iyi 3 eşleştirme öner
4. Veritabanını güncelle`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

---

### Agent 2: Customer Agent (Müşteri Hizmetleri)

**Dosya:** `src/agents/customer-agent.ts`

```typescript
import Anthropic from "@anthropic-sdk/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function customerAgent(userMessage: string, userId: string) {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: `Sen TermiLingo müşteri hizmetleri ajanısın (Türkçe).
    
Görevlerin:
- Kullanıcı sorularını yanıtlamak
- İş başvurularında yardım etmek
- Ödeme sorularını çözmek
- Tercüman hesabı oluşturmada rehberlik
- Kibar ve profesyonel olmak

Her yanıtta Türkçe kullan.`,
    messages: [
      {
        role: "user",
        content: `Kullanıcı ID: ${userId}
        
Soru: ${userMessage}

Yanıt ver ve gerekirse yardımcı işlemler öner.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

---

### Agent 3: Admin Agent (Sistem Yönetimi)

**Dosya:** `src/agents/admin-agent.ts`

```typescript
import Anthropic from "@anthropic-sdk/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function adminAgent(task: string) {
  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: `Sen TermiLingo sistem yönetim ajanısın.
    
Görevlerin:
- Platformun sağlığını kontrol etmek
- Hata raporlarını analiz etmek
- Kullanıcı verilerini yönetmek
- Ödeme işlemlerini denetlemek
- Günlük/haftalık raporlar oluşturmak`,
    messages: [
      {
        role: "user",
        content: `Yapılacak görev: ${task}
        
Bunu yap ve SQL/API çağrılarını öner.`,
      },
    ],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}
```

---

## 🔗 AŞAMA 3: API Endpoints (Ajanları Çağır)

**Dosya:** `src/app/api/agents/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { translatorAgent } from "@/agents/translator-agent";
import { customerAgent } from "@/agents/customer-agent";
import { adminAgent } from "@/agents/admin-agent";

// /api/agents/translator?projectId=123
export async function POST(request: NextRequest) {
  const { type, projectId, userMessage, userId, task } = await request.json();

  try {
    let result;

    if (type === "translator") {
      result = await translatorAgent(projectId);
    } else if (type === "customer") {
      result = await customerAgent(userMessage, userId);
    } else if (type === "admin") {
      result = await adminAgent(task);
    } else {
      return NextResponse.json(
        { error: "Bilinmeyen ajan tipi" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Ajan hatası:", error);
    return NextResponse.json(
      { error: "Ajan çalıştırılamadı" },
      { status: 500 }
    );
  }
}
```

---

## 🧠 AŞAMA 4: Ajanları Çağırma Örnekleri

### Örnek 1: Yeni Proje Olduğunda (Translator Agent)

```typescript
// Veritabanında new project oluştuğunda:
await fetch("/api/agents", {
  method: "POST",
  body: JSON.stringify({
    type: "translator",
    projectId: "proj_123",
  }),
});
```

### Örnek 2: Müşteri Chatbot (Customer Agent)

```typescript
// Chat sayfasında:
const response = await fetch("/api/agents", {
  method: "POST",
  body: JSON.stringify({
    type: "customer",
    userMessage: "Türkçe'den İngilizceye ceviri fiyatı nedir?",
    userId: "user_123",
  }),
});

const { result } = await response.json();
console.log(result); // Ajan'ın cevabı
```

### Örnek 3: Günlük Rapor (Admin Agent)

```typescript
// Her gün 01:00'de çalışan cron job:
await fetch("/api/agents", {
  method: "POST",
  body: JSON.stringify({
    type: "admin",
    task: "Son 24 saatin raporu: toplam işler, gelir, yeni kullanıcılar",
  }),
});
```

---

## ⚙️ AŞAMA 5: Ajanları Scheduler (Otomatik Çalıştır)

**Dosya:** `src/lib/scheduler.ts`

```typescript
import cron from "node-cron";

// Her saat başında Translator Agent çalışsın
cron.schedule("0 * * * *", async () => {
  console.log("Translator Agent başladı...");
  // Açık projeleri kontrol et ve eşleştir
  // await translatorAgent(...)
});

// Her gün 01:00'de Admin Agent çalışsın
cron.schedule("0 1 * * *", async () => {
  console.log("Admin Agent rapor hazırlanıyor...");
  // await adminAgent("günlük rapor")
});

export default cron;
```

`package.json`'a ekle:
```json
{
  "dependencies": {
    "node-cron": "^3.0.2"
  }
}
```

---

## 🔄 AŞAMA 6: Agent Teams Workflow

```
Yeni Proje Oluşturuldu
        ↓
   Translator Agent
   (Tercüman eşleştir)
        ↓
  Eşleşme Bulundu mı?
   ↙          ↘
EVET          HAYIR
 ↓             ↓
TERCÜMANİ  CUSTOMER AGENT
BILGILENDIR (Tercüman Ara)
 ↓             ↓
İŞ BAŞLADI  BEKLET
        ↓
   Tamamlandı?
   ↙        ↘
EVET        HAYIR
 ↓           ↓
RİVİYU     ADMIN ALERT
BAŞLA      (Sorun Bildir)
 ↓           ↓
ADMIN AGENT ÇÖZMEK
(Ödeme, Rapor)
```

---

## 🚀 AŞAMA 7: Deployment'a Hazırla

```bash
# TypeScript compile et
npm run build

# Agent endpoints test et
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"type":"customer","userMessage":"Merhaba","userId":"user_1"}'
```

---

## 📊 Monitoring Ajanları

**Dosya:** `src/app/admin/agents/page.tsx`

```typescript
// Admin Dashboard'da ajanları izle
export default async function AgentsMonitor() {
  return (
    <div>
      <h1>Ajan Durumları</h1>
      
      <div className="grid gap-4">
        <div className="border p-4">
          <h2>📋 Translator Agent</h2>
          <p>Son çalıştırma: 2 saat önce</p>
          <p>Eşleştirilen işler: 12</p>
        </div>
        
        <div className="border p-4">
          <h2>💬 Customer Agent</h2>
          <p>Bugünün soruları: 24</p>
          <p>Ortalama cevap süresi: 2 dakika</p>
        </div>
        
        <div className="border p-4">
          <h2>⚙️ Admin Agent</h2>
          <p>Son rapor: Bugün 09:00</p>
          <p>Sistem durumu: ✅ Normal</p>
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Kontrol Listesi

- [ ] @anthropic-sdk/sdk kurulu
- [ ] 3 ajan dosyası oluşturuldu
- [ ] `/api/agents` endpoint çalışıyor
- [ ] Scheduler kurulu ve test edildi
- [ ] Admin dashboard ajanları gösteriyor
- [ ] Production'a deploy edildi

---

**Sorular? TermiLingo Dashboard'daki "Ajanlar" sekmesini açabilirsin. 🎉**
