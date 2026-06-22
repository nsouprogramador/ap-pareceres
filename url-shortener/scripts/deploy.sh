#!/usr/bin/env bash
#
# scripts/deploy.sh
# Script de deploy/produção: instala deps, aplica migrations e builda.
# Uso:  bash scripts/deploy.sh
#
set -euo pipefail

echo "▶ Verificando variáveis de ambiente..."
: "${DATABASE_URL:?DATABASE_URL não definida}"
: "${AUTH_SECRET:?AUTH_SECRET não definida}"

echo "▶ Instalando dependências..."
npm ci

echo "▶ Gerando Prisma Client..."
npx prisma generate

echo "▶ Aplicando migrations no banco..."
npx prisma migrate deploy

echo "▶ Buildando a aplicação..."
npm run build

echo "✅ Deploy preparado. Inicie com: npm start"
