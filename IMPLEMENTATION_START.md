# 🚀 TermiLingo - Başlangıç (BUGÜN BAŞLA!)

## ⏱️ Zaman Planı
- **AŞAMA 1 (Local):** 1 saat
- **AŞAMA 2 (VPS):** 30 dakika  
- **AŞAMA 3 (Agents):** 45 dakika
- **Total:** ~2.5 saat ✅

---

## ✅ TODO - Sıra Sıra Yap

### BUGÜN (AŞAMA 1): Local Production Build

- [ ] **Terminal'i aç** (Mac: cmd+space → "Terminal")

- [ ] **Proje klasörüne git**
  ```bash
  cd ~/Documents/COWORK/TERMILINGO
  ```

- [ ] **.env.production oluştur**
  ```bash
  cp .env.example .env.production
  
  # Editör ile aç ve doldur:
  nano .env.production
  ```
  
  Doldurulacak (yer tutucu değerleri kendi değerlerinle değiştir):
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/termilingo"
  NEXTAUTH_URL="https://termilingo.siteniz.com"
  NEXTAUTH_SECRET="[terminal'de şunu çalıştır: openssl rand -hex 32]"
  STRIPE_SECRET_KEY="sk_live_..."
  STRIPE_PUBLISHABLE_KEY="pk_live_..."
  ```

- [ ] **Random secret oluştur**
  ```bash
  openssl rand -hex 32
  # Çıkan stringi .env.production'a yapıştır
  ```

- [ ] **Build et**
  ```bash
  npm run build
  ```
  
  Beklenen: "compiled successfully" ✅

- [ ] **Test başlat**
  ```bash
  npm start
  
  # Tarayıcıda aç: http://localhost:3000
  # Açılıyorsa devam et (Ctrl+C ile kapat)
  ```

---

### AŞAMA 2: VPS Hazırlık (Hostinger'da)

- [ ] **Hostinger'da VPS sipariş ver** (5-10 dakika)
  - Hosting seç → VPS → OS: Ubuntu 22.04 LTS
  - Kontrol paneline giriş yap

- [ ] **SSH erişim al**
  - Panelde: VPS Settings → Root Password / SSH Key
  - VPS IP'yi not al (örn: 123.45.67.89)

- [ ] **PostgreSQL Database Oluştur**
  - Hostinger paneli: Databases → Create
  - Name: `termilingo`
  - User: `termilingo_user`
  - Password: Güçlü şifre (20+ char) - NOT ET
  - Host: Hostinger'ın database host'u - NOT ET

- [ ] **Domain DNS Ayarla**
  - Domain registrar'da (GoDaddy, Namecheap vb):
  - A Record: `siteniz.com` → `123.45.67.89` (VPS IP)
  - CNAME: `www` → `siteniz.com`
  
  **DNS yayılması:** 10-30 dakika

---

### AŞAMA 3: VPS Setup (SSH Terminal)

- [ ] **VPS'ye bağlan**
  ```bash
  ssh root@123.45.67.89
  # Şifre sor
  ```

- [ ] **Tüm yazılımları kur** (5 dakika)
  ```bash
  # Node.js
  curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  apt install -y nodejs
  
  # PM2
  npm install -g pm2
  
  # Nginx
  apt install -y nginx
  
  # Diğerleri
  apt install -y git postgresql-client certbot python3-certbot-nginx
  
  # Başlat
  systemctl start nginx
  ```

- [ ] **TermiLingo'yu indir**
  ```bash
  mkdir -p /var/www/termilingo
  cd /var/www/termilingo
  
  # GitHub'tan (varsa):
  git clone https://github.com/sizeniz/termilingo.git .
  
  # Veya lokal'den upload et (başka terminal):
  # scp -r ~/Documents/COWORK/TERMILINGO/* root@123.45.67.89:/var/www/termilingo/
  ```

- [ ] **node_modules kur**
  ```bash
  cd /var/www/termilingo
  npm install --production
  ```

- [ ] **.env.production oluştur** (Hostinger değerleriyle)
  ```bash
  cat > .env.production << 'EOF'
  NODE_ENV=production
  DATABASE_URL="postgresql://termilingo_user:HOSTIN_PASSWORD@HOSTINGER_DB:5432/termilingo"
  NEXTAUTH_URL="https://siteniz.com"
  NEXTAUTH_SECRET="[buraya openssl sonucu]"
  STRIPE_SECRET_KEY="sk_live_..."
  STRIPE_PUBLISHABLE_KEY="pk_live_..."
  EOF
  ```

- [ ] **Build & Migrate**
  ```bash
  npm run build
  npx prisma migrate deploy
  ```

- [ ] **PM2 ile başlat**
  ```bash
  pm2 start npm --name "termilingo" -- start
  pm2 startup
  pm2 save
  ```

- [ ] **Nginx ayarla**
  ```bash
  # Aşağıdaki HOSTINGER_DEPLOYMENT.md'deki Adım 8'i takip et
  ```

- [ ] **SSL sertifikası al**
  ```bash
  certbot certonly --standalone -d siteniz.com -d www.siteniz.com
  ```

- [ ] **Test et**
  ```bash
  # Terminal'de
  pm2 logs termilingo
  
  # Tarayıcıda
  https://siteniz.com
  ```

---

### AŞAMA 4: Claude Agents Kurulum (30 dakika)

- [ ] **API Key al**
  - https://console.anthropic.com → API keys → Create key
  - Kopyala

- [ ] **Local'de Agent dosyaları oluştur**
  
  ```bash
  # src/agents klasörünü oluştur
  mkdir -p src/agents
  ```

  AGENT_TEAMS_SETUP.md dosyasındaki 3 agent kodlarını kopyala:
  - `translator-agent.ts`
  - `customer-agent.ts`
  - `admin-agent.ts`

- [ ] **API route oluştur**
  
  `src/app/api/agents/route.ts` AGENT_TEAMS_SETUP.md'den kopyala

- [ ] **Scheduler ayarla** (Opsiyonel - şimdilik skip)
  - Daha sonra node-cron eklenebilir

- [ ] **Build & Deploy**
  ```bash
  npm run build
  
  # VPS'ye push et (Git varsa)
  git add .
  git commit -m "Add Claude Agents"
  git push
  
  # VPS'de güncelle
  ssh root@123.45.67.89
  cd /var/www/termilingo
  git pull
  npm install
  npm run build
  pm2 restart termilingo
  ```

---

## 📋 Gerekli Bilgileri Topla

Aşağıdakileri hazırla (ilk deployment'tan önce):

```
▸ Hostinger VPS IP: ___________________________
▸ SSH Root Password: ________________________
▸ Domain: ___________________________
▸ PostgreSQL Host: __________________________
▸ PostgreSQL User: __________________________
▸ PostgreSQL Password: __________________________
▸ Anthropic API Key: __________________________
▸ Stripe Secret Key: __________________________
▸ Stripe Public Key: __________________________
```

---

## 🆘 Eğer Sorun Olursa

### Problem: "npm run build" başarısız
```bash
# Önce lokal'de test et
npm install
npm run build
```

### Problem: VPS bağlantısı kesildi
```bash
# Tekrar bağlan
ssh root@[IP]
```

### Problem: Veritabanı bağlantı hatası
```bash
# DATABASE_URL kontrol et
cat .env.production | grep DATABASE

# Test et (VPS'de)
psql $DATABASE_URL
```

### Problem: HTTPS çalışmıyor
```bash
# Sertifikayı kontrol et
ls /etc/letsencrypt/live/siteniz.com/

# Yenile
certbot renew
```

---

## 🎉 Başarı Belirtileri

Bittiğinde bunları görmelisin:

✅ `https://siteniz.com` açılıyor
✅ Giriş sayfası yükleniyor
✅ Database bağlı (veri kaydedilebiliyor)
✅ `pm2 status` → "online" gösteriyor
✅ Agents API çalışıyor: `curl https://siteniz.com/api/agents`

---

## 📞 Destek

Başarısız olursa, bu dosyaları gözden geçir:
1. **PRODUCTION_CHECKLIST.md** - Build kontrol listesi
2. **HOSTINGER_DEPLOYMENT.md** - VPS adım adım
3. **AGENT_TEAMS_SETUP.md** - Agents kurulum

---

## 🚀 Sıradaki Adımlar (Canlı Olduktan Sonra)

1. **SSL Sertifikası Otomatik Yenileme**
   ```bash
   systemctl enable certbot.timer
   ```

2. **Backups Ayarla**
   - Hostinger panelinde: Automated Backups

3. **Monitoring**
   ```bash
   pm2 monit
   ```

4. **Traffic Analiz**
   - Nginx logs: `/var/log/nginx/access.log`

---

**💪 Hemen başla! Sorular varsa emoji ile açıkla → 🤔 "Anlamadım"**

