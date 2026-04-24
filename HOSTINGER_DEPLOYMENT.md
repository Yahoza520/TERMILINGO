# TermiLingo - Hostinger VPS Deployment Rehberi 🚀

## 📍 Hızlı Başlangıç (15 dakika)

```bash
# 1. VPS'ye bağlan
ssh root@[VPS_IP_BURAYA]

# 2. Tüm kurulumları yap
bash /tmp/setup.sh

# 3. Uygulamayı başlat
cd /var/www/termilingo
pm2 start npm --name "termilingo" -- start

# 4. Tarayıcı aç: https://siteniz.com ✅
```

---

## 🔧 Adım 1: Hostinger VPS Bilgileriniz

Hostinger'da aldığınız VPS'nin bilgilerini aşağıya yapıştırın:

```
VPS IP: ___________________________
SSH Kullanıcı: ____________________
SSH Şifre/Key: ____________________
Domain: ___________________________
PostgreSQL Host: __________________
PostgreSQL Port: 5432
PostgreSQL User: __________________
PostgreSQL Password: ______________
PostgreSQL DB: termilingo
```

---

## 🖥️ Adım 2: VPS İlk Kurulum

### 2.1 VPS'ye Bağlan
```bash
# SSH ile bağlan (IP yerine gerçek IP yazın)
ssh root@123.45.67.89

# Şifre sor / SSH key kullanırsan -i /path/to/key ekle
```

### 2.2 Sistem Güncelleme
```bash
apt update && apt upgrade -y
```

---

## 📦 Adım 3: Yazılımları Kur

### 3.1 Node.js (20 LTS) - İşlemi çalıştırmak için

```bash
# Node.js repository ekle
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Node.js ve npm kur
apt install -y nodejs

# Kontrol et
node --version  # v20.x.x olmalı
npm --version   # 10.x.x olmalı
```

### 3.2 PM2 - Uygulamayı 24/7 çalıştırmak için

```bash
npm install -g pm2

# PM2'yi başlangıçta otomatik başlat
pm2 startup
pm2 save
```

### 3.3 Nginx - Web sunucusu

```bash
apt install -y nginx

# Başlat
systemctl start nginx
systemctl enable nginx
```

### 3.4 Git - Kodu indirmek için

```bash
apt install -y git
```

### 3.5 PostgreSQL Client - Veritabanına bağlanmak için

```bash
apt install -y postgresql-client
```

### 3.6 Certbot - HTTPS sertifikası

```bash
apt install -y certbot python3-certbot-nginx
```

---

## 📂 Adım 4: TermiLingo Dosyalarını Kopyala

### 4.1 Klasör Oluştur
```bash
mkdir -p /var/www/termilingo
cd /var/www/termilingo
```

### 4.2 Git'ten Al (Eğer GitHub'da varsa)
```bash
# GitHub repository klonla
git clone https://github.com/sizeniz/termilingo.git .

# Veya dosyaları lokal'den FTP/SCP ile upload et:
# Terminal'de: scp -r ./termilingo root@123.45.67.89:/var/www/
```

### 4.3 Bağımlılıkları Kur
```bash
cd /var/www/termilingo
npm install --production

# Kontrol: node_modules klasörü oluştu mu?
ls -la | grep node_modules
```

---

## 🔐 Adım 5: Ortam Değişkenlerini Ayarla

### 5.1 .env.production Dosyası Oluştur

```bash
nano .env.production
```

Aşağıdaki içeriği yapıştır (kendi değerlerinle doldur):

```
# Node ortamı
NODE_ENV=production

# Veritabanı (Hostinger'dan aldığın credentials)
DATABASE_URL="postgresql://username:password@db-host.com:5432/termilingo"

# NextAuth
NEXTAUTH_URL="https://siteniz.com"
NEXTAUTH_SECRET="buraya-çok-uzun-random-string-yaz-32-karakter"

# Stripe (Production keys - sk_live ile başlar)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Opsiyonel: Iyzico (Türkiye ödemesi)
IYZICO_API_KEY=""
IYZICO_SECRET_KEY=""
IYZICO_BASE_URL="https://api.iyzipay.com"
```

**NEXTAUTH_SECRET Oluştur:**
```bash
openssl rand -hex 32
```

Çıkan stringi kopyala ve .env.production'a yapıştır.

---

## 🗄️ Adım 6: Veritabanı Migrate

```bash
# VPS'deki terminal'de:
cd /var/www/termilingo

# Production veritabanını güncelle
npx prisma migrate deploy

# Opsiyonel: Başlangıç verisi ekle
npx prisma db seed
```

---

## 🔨 Adım 7: Build & Start

```bash
# Build et (production optimization)
npm run build

# PM2 ile başlat
pm2 start npm --name "termilingo" -- start

# Çalıştığını kontrol et
pm2 status
pm2 logs termilingo
```

**Beklenen:** "Server running on :3000" görmelisin ✅

---

## 🌐 Adım 8: Nginx Ayarı (Reverse Proxy)

### 8.1 Nginx Config Dosyası Oluştur

```bash
nano /etc/nginx/sites-available/termilingo
```

Yapıştır (domain'ini değiştir):

```nginx
upstream termilingo {
    server localhost:3000;
}

# HTTP → HTTPS yönlendir
server {
    listen 80;
    server_name siteniz.com www.siteniz.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name siteniz.com www.siteniz.com;

    # SSL Sertifikaları (Certbot tarafından oluşturulacak)
    ssl_certificate /etc/letsencrypt/live/siteniz.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siteniz.com/privkey.pem;

    # SSL Ayarları
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Gzip (hızlandırma)
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    location / {
        proxy_pass http://termilingo;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8.2 Aktif Et

```bash
# Sembolik link oluştur
ln -s /etc/nginx/sites-available/termilingo /etc/nginx/sites-enabled/

# Kontrol et (hata varsa gösterir)
nginx -t

# Yeniden başlat
systemctl restart nginx
```

---

## 🔒 Adım 9: SSL Sertifikası (HTTPS)

```bash
# Let's Encrypt sertifikası al (otomatik)
certbot certonly --standalone -d siteniz.com -d www.siteniz.com

# Otomatik yenileme ayarla
systemctl enable certbot.timer
systemctl start certbot.timer
```

**Test:**
```bash
certbot renew --dry-run
```

---

## ✅ Adım 10: Test Et

### 10.1 Uygulama Çalışıyor mu?
```bash
# Terminal'de
pm2 logs termilingo

# Tarayıcıda aç
https://siteniz.com
```

### 10.2 Veritabanı Bağlantısı
```bash
psql -h db-host.com -U username -d termilingo
# Şifre sorarsa gir
\dt  # Tabloları listele
\q  # Çık
```

### 10.3 API Test
```bash
# Terminal'de
curl -X GET https://siteniz.com/api/health

# Başarılıysa 200 kodu döner
```

---

## 🆘 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **502 Bad Gateway** | `pm2 status` - PM2 çalışıyor mu? |
| **"Cannot find module"** | `npm install` çalıştır |
| **Database connection error** | DATABASE_URL doğru mu kontrol et |
| **HTTPS çalışmıyor** | `certbot renew` - sertifika var mı? |
| **PM2 uygulamayı çökerken restart etmiyor** | `pm2 autorestart` |
| **Port 3000 zaten kullanımda** | `lsof -i :3000` ve PID'yi kill et |

---

## 📊 Monitoring (Canlı Olduktan Sonra)

```bash
# Uygulamayı gerçek zamanda izle
pm2 monit

# Log görmek
pm2 logs termilingo

# Reboot'tan sonra başlasın mı?
pm2 startup
pm2 save

# Uygulamayı durumaz hale yap
pm2 resurvival
```

---

## 🔄 Güncellemeleri Deploy Etme (Sonradan)

Kod güncellendiğinde:

```bash
cd /var/www/termilingo

# Yeni kodu al
git pull

# Bağımlılıkları güncelle
npm install

# Build et
npm run build

# Database migration
npx prisma migrate deploy

# PM2 yeniden başlat
pm2 restart termilingo
```

---

## 🛡️ Güvenlik Checklist

- [ ] .env.production dosyası .gitignore'da mı?
- [ ] SSH key kullanıyor musun (şifre değil)?
- [ ] Firewall sadece 80, 443, 22 portlarını açıyor mu?
- [ ] Root yerine regular user var mı?
- [ ] SSL sertifikası geçerli mi?
- [ ] Database şifresi güçlü mu (20+ karakter)?

---

## 📞 Hostinger Desteği

Sorun yaşarsan:

1. **VPS Kontrol Paneli:** https://hpanel.hostinger.com
2. **Live Chat:** Sol alttaki yeşil chat butonu
3. **Ticket:** Support → New Ticket

**Sorula:**
- VPS IP'nin
- SSH bağlantı detayları
- Hata mesajları (screenshot at)

---

**🎉 Tamamlandı! TermiLingo production'da canlı!**

Son durumu kontrol et:
```bash
curl -I https://siteniz.com
# HTTP/1.1 200 OK görmelisin
```

