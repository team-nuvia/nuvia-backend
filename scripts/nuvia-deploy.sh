#!/usr/bin/env bash
set -euo pipefail
APP_DIR="/home/ubuntu/nuvia-backend"
BRANCH="main"

cd "$APP_DIR"
# deploy key 설정되어 있어야 함 (서버 ~/.ssh/config에서 github.com 키 사용)
git fetch --all --prune
git reset --hard "origin/${BRANCH}"

# 필요시 의존성/빌드
if command -v pnpm >/dev/null 2>&1; then
  corepack enable || true
  pnpm i --frozen-lockfile || true
else
  npm ci --omit=dev || true
fi
npm run build || true

# PM2 재시작
if pm2 list | grep -q "nuvia-backend"; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save
