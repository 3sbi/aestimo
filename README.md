# Aestimo - self-hosted planning poker web app

## Getting Started

To run this app quickly use [Docker](https://www.docker.com/):

```bash
$ cp .env.example .env
$ docker compose up -d
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs) - This porject uses Next.js, learn about their features and API from docs.
- [Planning Poker website](https://planning-poker-agile.web.app/) - This project took huge inspiration from [planning-poker](https://github.com/hellomuthu23/planning-poker). Support them with your star as well!

## env

| Name             | Description                                                                                                                                                    | Default      |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| PORT             |                                                                                                                                                                | 8080         |
| NODE_ENV         | `production` or `development`                                                                                                                                  | `production` |
| SESSION_SECRET\* | Session secret is required by iron-session, [it should be at least 32 characters long](https://github.com/vvo/iron-session?tab=readme-ov-file#session-options) |              |
| DATABASE_URL\*   |                                                                                                                                                                |              |
