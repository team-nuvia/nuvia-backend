#!/usr/bin/env bash
set -euo pipefail
# 디버그가 필요할 때만 주석 해제
#set -x

# 비대화 환경 PATH 보정
export PATH=/usr/local/bin:/usr/bin:/bin:/snap/bin:$PATH

# 실패 지점 로그 남기기
exec > >(tee -a /var/log/nuvia-deploy.log) 2>&1
echo "=== NUVIA DEPLOY START $(date -Is) ==="
echo "whoami=$(whoami)  pwd=$(pwd)"
aws --version || true
aws sts get-caller-identity || true

APP_DIR="/home/ubuntu/nuvia-backend"
BRANCH="main"

cd "$APP_DIR"
# deploy key 설정되어 있어야 함 (서버 ~/.ssh/config에서 github.com 키 사용)
git fetch --all --prune
git reset --hard "origin/${BRANCH}"

# node_modules 폴더가 존재하지 않으면 의존성 설치
if ls -al | grep node_modules > /dev/null; then
  echo "node_modules 폴더가 존재합니다."
else
  echo "node_modules 폴더가 존재하지 않습니다."
  npm install --omit=dev
fi

# # 필요시 의존성/빌드
# if command -v pnpm >/dev/null 2>&1; then
#   corepack enable || true
#   pnpm i --frozen-lockfile || true
# else
#   npm ci --omit=dev || true
# fi
npm run build || true

# PM2 재시작
if pm2 list | grep -q "nuvia-backend"; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save
