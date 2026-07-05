#!/bin/sh
set -e

DB_HOST=$(grep -E '^POSTGRES_HOST=' .env 2>/dev/null | cut -d= -f2)
DB_PORT=$(grep -E '^POSTGRES_PORT=' .env 2>/dev/null | cut -d= -f2)
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for Postgres at $DB_HOST:$DB_PORT..."
  sleep 1
done

echo -e "Running migrations...\n"
npm run db:migrate
echo -e "Completed!\n"

echo "Starting app..."

node build

exec "$@"