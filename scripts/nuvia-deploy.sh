#! /usr/bin/env bash

echo "whoami=$(whoami)  pwd=$(pwd)"

set -eu
# HOME/PM2_HOME 보장
[ -n "${HOME:-}" ] || export HOME=/home/ubuntu
export PM2_HOME="$HOME/.pm2"

# nvm PATH 로드
if [ -d /home/ubuntu/.nvm ]; then
  export NVM_DIR=/home/ubuntu/.nvm
  [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
  if [ -d "$NVM_DIR/versions/node" ]; then
    V=$(ls -1 "$NVM_DIR/versions/node" | sort -V | tail -1)
    export PATH="$NVM_DIR/versions/node/$V/bin:$PATH"
  fi
fi

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

echo node version: $(node -v)
echo npm version: $(npm -v)
echo pm2 version: $(pm2 -v)

npm run build

# PM2 재시작
if pm2 list | grep -q "nuvia-backend"; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save
