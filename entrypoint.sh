#!/bin/sh
set -e

# Wait for DB to be ready
until nc -z localhost 5432; do
  echo "Waiting for Postgres..."
  sleep 1
done

echo -e "Running migrations...\n"
npm run db:migrate
echo -e "Completed!\n"

echo "Starting app..."

node build

exec "$@"