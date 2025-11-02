#! /usr/bin/env bash

echo "whoami=$(whoami) pwd=$(pwd)"

set -eu

GIT_USER=${GIT_USER:-}
GIT_TOKEN=${GIT_TOKEN:-}
APP_DIR="/home/nuvia/nuvia-backend"
BRANCH="main"

cd "$APP_DIR"


new_url="https://${GIT_USER}:${GIT_TOKEN}@github.com/team-nuvia/nuvia-share.git"

# Temporarily change the internal field separator (IFS) to handle spaces in paths
IFS=$'\n'

# Read the .gitmodules file line by line
while IFS= read -r line; do
    if [[ $line =~ ^[[:space:]]*url[[:space:]]*= ]]; then
        # Replace the URL line with the new URL
        echo "  url = ${new_url}"
    else
        echo "$line"
    fi
done < .gitmodules > .gitmodules.tmp  # Write output to a temporary file

# Replace the original .gitmodules file with the updated one
mv .gitmodules.tmp .gitmodules

# deploy key 설정되어 있어야 함 (서버 ~/.ssh/config에서 github.com 키 사용)
git fetch --all --prune
git reset --hard "origin/${BRANCH}"
git submodule update --init --recursive
git submodule update --remote --merge

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
  pm2 reload ecosystem.config.js
else
  pm2 start ecosystem.config.js
fi
pm2 save
