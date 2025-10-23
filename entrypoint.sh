#!/bin/sh

# Wait for DB to be ready
until nc -z db 5432; do
  echo "Waiting for Postgres..."
  sleep 1
done

echo -e "Running migrations...\n"
npx drizzle-kit migrate
echo -e "Completed!\n"

echo "Starting app..."
npm run start

exec "$@"