#!/bin/bash
# TermiLingo - Hostinger VPS Deploy Script
# Kullanım: bash deploy.sh

set -e

echo "🚀 TermiLingo Deploy Başlıyor..."

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Adım 1: Bağımlılıkları kur
echo -e "${GREEN}📦 Bağımlılıklar kuruluyor...${NC}"
npm install --production=false

# Adım 2: Prisma Client oluştur
echo -e "${GREEN}🔧 Prisma Client oluşturuluyor...${NC}"
npx prisma generate

# Adım 3: Veritabanını senkronize et
echo -e "${GREEN}🗄️ Veritabanı senkronize ediliyor...${NC}"
npx prisma db push --accept-data-loss

# Adım 4: Build
echo -e "${GREEN}🔨 Production build alınıyor...${NC}"
npm run build

# Adım 5: PM2 ile başlat/yeniden başlat
echo -e "${GREEN}🚀 PM2 ile başlatılıyor...${NC}"
if pm2 describe termilingo > /dev/null 2>&1; then
    pm2 restart termilingo
    echo -e "${GREEN}✅ TermiLingo yeniden başlatıldı!${NC}"
else
    pm2 start npm --name "termilingo" -- start
    pm2 save
    echo -e "${GREEN}✅ TermiLingo ilk kez başlatıldı!${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deploy tamamlandı!${NC}"
echo -e "  Durum: pm2 status"
echo -e "  Loglar: pm2 logs termilingo"
echo ""
