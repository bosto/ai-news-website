#!/bin/sh
set -e

echo "🚀 Starting AI News Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until npx prisma db push --skip-generate > /dev/null 2>&1; do
  echo "⏳ Database not ready, waiting 5 seconds..."
  sleep 5
done

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Seed database if it's empty
echo "🌱 Checking if database needs seeding..."
if ! npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"users\";" > /dev/null 2>&1; then
  echo "🌱 Seeding database..."
  npm run seed
else
  echo "✅ Database already seeded"
fi

echo "🎉 Backend setup complete!"

# Execute the main command
exec "$@"