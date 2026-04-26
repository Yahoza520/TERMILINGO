#!/bin/bash
# TermiLingo VPS Deploy Script
# Mac terminalinden çalıştır: bash deploy.sh

VPS="root@187.77.95.109"
LOCAL="/Users/yao_macbookpro/Documents/COWORK/TERMILINGO/"
REMOTE="/var/www/termilingo/"

echo "=== TermiLingo Deploy ==="
echo ""

echo "[1/4] Dosyalar VPS'ye yukleniyor..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='.env' \
  "$LOCAL" "$VPS:$REMOTE"

echo ""
echo "[2/4] Build ve restart..."
ssh "$VPS" << 'ENDSSH'
cd /var/www/termilingo

echo "-- npm install --"
npm install --production=false 2>&1 | tail -3

echo "-- prisma generate --"
npx prisma generate 2>&1 | tail -3

echo "-- prisma db push --"
npx prisma db push --accept-data-loss 2>&1 | tail -5

echo "-- prisma seed --"
npx prisma db seed 2>&1 | tail -5

echo "-- npm run build --"
npm run build 2>&1 | tail -10

echo "-- pm2 restart --"
pm2 delete termilingo 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 1
pm2 start "npx next start -p 3000" --name termilingo
pm2 save

echo ""
echo "-- pm2 status --"
pm2 status

echo ""
echo "-- test --"
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000)
echo "HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
  echo "BASARILI! http://187.77.95.109:3000"
else
  echo "HATA! pm2 logs:"
  pm2 logs termilingo --lines 10 --nostream
fi
ENDSSH

echo ""
echo "=== Deploy tamamlandi ==="
