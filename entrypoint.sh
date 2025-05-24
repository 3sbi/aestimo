#!/bin/sh

# Wait for DB to be ready
until nc -z db 5432; do
  echo "Waiting for Postgres..."
  sleep 1
done


echo "Running migrations..."
npx drizzle-kit migrate


echo "Starting app..."
npm run start

exec "$@"