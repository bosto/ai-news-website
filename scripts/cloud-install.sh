#!/usr/bin/env bash
# Idempotent Cloud Agent setup for the AI News Website (frontend + backend + PostgreSQL).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "==> Installing frontend dependencies"
npm ci

echo "==> Installing backend dependencies and generating Prisma client"
(cd backend && npm ci && npx prisma generate)

echo "==> Writing env files (if missing)"
if [ ! -f .env.local ]; then
  cat > .env.local <<'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
EOF
fi
if [ ! -f backend/.env ]; then
  cat > backend/.env <<'EOF'
DATABASE_URL="postgresql://ai_news_user:ai_news_password@localhost:5432/ai_news_db"
PORT=3001
NODE_ENV=development
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NEWS_API_KEY=
FRONTEND_URL=http://localhost:3000
EOF
fi

echo "==> Ensuring PostgreSQL is installed"
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-contrib
fi

echo "==> Starting PostgreSQL cluster"
sudo pg_ctlcluster 16 main start 2>/dev/null || true

echo "==> Waiting for PostgreSQL to accept connections"
for _ in $(seq 1 30); do
  if pg_isready -q -h localhost -p 5432; then break; fi
  sleep 1
done

echo "==> Ensuring database role and database exist"
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='ai_news_user'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE ROLE ai_news_user LOGIN PASSWORD 'ai_news_password';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='ai_news_db'" | grep -q 1 || \
  sudo -u postgres createdb -O ai_news_user ai_news_db

echo "==> Applying Prisma schema and seeding data"
export DATABASE_URL="postgresql://ai_news_user:ai_news_password@localhost:5432/ai_news_db"
(cd backend && npx prisma db push --skip-generate --accept-data-loss && npm run seed)

echo "==> Cloud Agent install complete"
