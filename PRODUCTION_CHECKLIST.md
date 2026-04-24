# TermiLingo - Production Hazırlık Listesi ✅

## AŞAMA 1: Yerel Testler & Güvenlik (YAPETİLECEK)

### 1.1 Ortam Değişkenleri
```bash
# Adım 1: .env.production dosyası oluştur
cp .env.example .env.production
```

**Doldurulması Gereken Değişkenler:**

| Değişken | Değer | Nerede Bulunur |
|----------|-------|-----------------|
| `DATABASE_URL` | PostgreSQL production DB | Hostinger paneli |
| `NEXTAUTH_URL` | `https://siteniz.com` | Kendi domain'iniz |
| `NEXTAUTH_SECRET` | Güçlü random string (32+ char) | Terminal: `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | Stripe dashboard | https://dashboard.stripe.com |
| `STRIPE_PUBLISHABLE_KEY` | Stripe dashboard | https://dashboard.stripe.com |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks | Stripe dashboard |

⚠️ **Asla GitHub'a push etme!** .env.production'ı .gitignore'a ekle.

---

### 1.2 Build Test
```bash
# Projeyi build et (local'de sorun varsa bulur)
npm run build

# Production ayarlarıyla başlat
npm start
```

**Beklenen Sonuç:** http://localhost:3000 açılır, hata yok ✅

---

### 1.3 Database Migration
```bash
# Production veritabanını hazırla
npx prisma migrate deploy

# Opsiyonel: test verisi ekle
npx prisma db seed
```

---

### 1.4 Güvenlik Kontrolleri
- [ ] NEXTAUTH_SECRET random ve benzersiz mi?
- [ ] DATABASE_URL sadece local test'te mi (production'da değişecek)?
- [ ] Stripe API keys test modu (sk_test_...) mi yoksa live (sk_live_...)?
- [ ] .env dosyası .gitignore'da mı?
- [ ] Tüm gizli veriler dışarıda mı?

---

## AŞAMA 2: Hostinger VPS Hazırlığı

### 2.1 VPS İçin Gerekli Bilgiler
- VPS IP Adresi: `___________`
- SSH Kullanıcı: `root` veya `___________`
- SSH Portu: `22` (varsayılan)
- Domain: `siteniz.com`

### 2.2 Sunucu Başlangıç Paketi
```bash
# VPS'ye bağlan
ssh root@[VPS_IP]

# Güncellemeler
apt update && apt upgrade -y

# Node.js kur (v20 LTS)
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs npm

# PM2 kur (uygulamayı 24/7 çalıştırmak için)
npm install -g pm2

# PostgreSQL client kur (veritabanı bağlantısı için)
apt install -y postgresql-client

# Nginx kur (ters proxy)
apt install -y nginx
```

### 2.3 Domain & SSL (HTTPS)
```bash
# Certbot (Let's Encrypt için)
apt install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot certonly --standalone -d siteniz.com -d www.siteniz.com
```

---

## AŞAMA 3: Uygulamayı VPS'ye Deploy Etme

### 3.1 Klasör Oluştur
```bash
mkdir -p /var/www/termilingo
cd /var/www/termilingo
```

### 3.2 Git'ten Pull Et (veya Upload)
```bash
# Eğer GitHub'da varsa:
git clone https://github.com/sizeniz/termilingo.git .

# Veya dosyaları local'den upload et:
# (SCP/SFTP ile)
```

### 3.3 Bağımlılıkları Kur
```bash
cd /var/www/termilingo
npm install --production
```

### 3.4 .env.production Oluştur (Hostinger'da)
```bash
cat > .env.production << 'EOF'
DATABASE_URL="postgresql://user:password@hostinger-db-host:5432/termilingo"
NEXTAUTH_URL="https://siteniz.com"
NEXTAUTH_SECRET="[openssl rand -hex 32 çıktısı]"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NODE_ENV="production"
EOF
```

### 3.5 Build & Migrate
```bash
npm run build
npx prisma migrate deploy
```

### 3.6 PM2 ile Başlat
```bash
# Uygulamayı başlat
pm2 start npm --name "termilingo" -- start

# Başlangıçta otomatik başlasın
pm2 startup
pm2 save
```

### 3.7 Nginx Ayarı
```bash
# Nginx config oluştur
cat > /etc/nginx/sites-available/termilingo << 'EOF'
server {
    listen 443 ssl http2;
    server_name siteniz.com www.siteniz.com;

    ssl_certificate /etc/letsencrypt/live/siteniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siteniz.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name siteniz.com www.siteniz.com;
    return 301 https://$server_name$request_uri;
}
EOF

# Aktif et
ln -s /etc/nginx/sites-available/termilingo /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## ✅ Son Kontrol Listesi

- [ ] .env.production dosyası oluşturuldu
- [ ] `npm run build` başarılı
- [ ] `npm start` local'de çalışıyor
- [ ] VPS node_modules kurulu
- [ ] Database migration yapıldı
- [ ] PM2 uygulamayı çalıştırıyor
- [ ] Nginx reverse proxy yapılandırıldı
- [ ] SSL sertifikası aktif
- [ ] https://siteniz.com açılıyor ve çalışıyor

---

## 🚨 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| `npm run build` hata | Yerel'de test et: `npm install` → `npm run build` |
| Veritabanı bağlantısı hatası | DATABASE_URL doğru mu kontrol et |
| PM2 uygulamayı başlatmıyor | `pm2 logs termilingo` ile log görmek |
| Nginx 502 Bad Gateway | PM2'nin çalıştığını kontrol et: `pm2 status` |
| HTTPS çalışmıyor | Sertifika path doğru mu: `/etc/letsencrypt/live/` |

---

## 📊 Monitoring (Canlı Olduktan Sonra)

```bash
# Uygulamayı izle
pm2 monit

# Log dosyalarını görmek
pm2 logs termilingo

# Otomatik yeniden başlatma (çökmesi durumunda)
pm2 autorestart
```

---

**Hazır? 🚀 Sıradaki adım: AŞAMA 2 (Agent Teams Setup)**
