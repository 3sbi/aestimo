# Aestimo

Aestimo is a planning poker web app

![screenshot](./static/room.webp)

## Getting Started

To run this app quickly use [Docker](https://www.docker.com/):

```bash
cp .env.example .env
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000).

### Development

```bash
npm install
cp .env.example .env
sed -i 's/^POSTGRES_HOST=.*/POSTGRES_HOST=localhost/' .env
docker run --name aestimo-dev-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v aestimo_pgdata:/var/lib/postgresql/data -d postgres:17
npm run db:migrate
npm run dev
```
