#!/bin/bash
# ================================================
# TermiLingo - Hostinger VPS Deploy (Port 3001)
# VPS: 187.77.95.109 — Spotted zaten port 80/3000'de
# TermiLingo: port 3001
# ================================================
#
# KULLANIM:
#   bash vps_deploy.sh
#
# SSH şifreniz birkaç kez istenecek.
# ================================================

set -e

VPS_IP="187.77.95.109"
VPS_USER="root"
APP_DIR="/var/www/termilingo"
LOCAL_DIR="/Users/yao_macbookpro/Documents/COWORK/TERMILINGO"
PORT=3001

echo ""
echo "🚀 TermiLingo — Hostinger VPS Deploy"
echo "  VPS: $VPS_IP"
echo "  Port: $PORT (Spotted port 3000 kullanıyor)"
echo "======================================"
echo ""

# Adım 1: Dosyaları VPS'ye yükle
echo "📦 [1/3] Dosyalar VPS'ye yükleniyor..."
rsync -avz --progress \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.env.local' \
  "$LOCAL_DIR/" "$VPS_USER@$VPS_IP:$APP_DIR/"

echo ""
echo "✅ Dosyalar yüklendi!"
echo ""

# Adım 2: PostgreSQL + .env + Build
echo "🔨 [2/3] VPS'de kurulum, build ve başlatma..."
ssh "$VPS_USER@$VPS_IP" << 'REMOTE_SETUP'
set -e

# PostgreSQL kontrol / kur
if ! command -v psql &> /dev/null; then
    echo "📍 PostgreSQL kuruluyor..."
    apt update -y > /dev/null 2>&1
    apt install -y postgresql postgresql-client > /dev/null 2>&1
    systemctl enable postgresql
    systemctl start postgresql
fi

# Veritabanı oluştur
echo "📍 Veritabanı kontrol ediliyor..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='termilingo_user'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER termilingo_user WITH PASSWORD 'TermiLingo2026Secure!';"

sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='termilingo'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE termilingo OWNER termilingo_user;"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE termilingo TO termilingo_user;" 2>/dev/null || true
echo "✅ PostgreSQL hazır!"

# App dizinine git
cd /var/www/termilingo

# .env dosyası oluştur
SECRET=$(openssl rand -hex 32)
cat > .env << EOF
NODE_ENV=production
DATABASE_URL="postgresql://termilingo_user:TermiLingo2026Secure!@localhost:5432/termilingo?schema=public"
NEXTAUTH_URL="http://187.77.95.109:3001"
NEXTAUTH_SECRET="$SECRET"
SMTP_HOST=""
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER=""
SMTP_PASS=""
EOF
echo "✅ .env oluşturuldu"

# Bağımlılıkları kur
echo "📍 npm install..."
npm install 2>&1 | tail -5

# Prisma
echo "📍 Prisma generate & db push..."
npx prisma generate
npx prisma db push --accept-data-loss

# Build
echo "📍 Production build alınıyor (bu biraz sürebilir)..."
npm run build

# PM2 — port 3001'de başlat
echo "📍 PM2 ile port 3001'de başlatılıyor..."
pm2 delete termilingo 2>/dev/null || true
PORT=3001 pm2 start npm --name "termilingo" -- start -- -p 3001
pm2 save

echo ""
echo "✅ TermiLingo port 3001'de çalışıyor!"
REMOTE_SETUP

echo ""

# Adım 3: Nginx — TermiLingo'yu subdomain/path'e ekle
echo "🌐 [3/3] Nginx güncelleniyor..."
ssh "$VPS_USER@$VPS_IP" << 'REMOTE_NGINX'

# TermiLingo için Nginx config (srv1409470.hstgr.cloud subdomain'i ile)
cat > /etc/nginx/sites-available/termilingo << 'NGINX_CONF'
# TermiLingo — port 3001
server {
    listen 80;
    server_name termilingo.srv1409470.hstgr.cloud;

    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:3001;
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
NGINX_CONF

ln -sf /etc/nginx/sites-available/termilingo /etc/nginx/sites-enabled/

# Nginx test ve restart
nginx -t && systemctl reload nginx

echo ""
echo "======================================"
echo "🎉 DEPLOY TAMAMLANDI!"
echo "======================================"
echo ""
echo "  TermiLingo: http://187.77.95.109:3001"
echo "  Spotted:    http://187.77.95.109"
echo ""
echo "  PM2 Durum:  pm2 status"
echo "  Loglar:     pm2 logs termilingo"
echo "======================================"
REMOTE_NGINX

echo ""
echo "🎉 Deploy tamamlandı! Tarayıcıda açın:"
echo "   http://187.77.95.109:3001"
echo ""
