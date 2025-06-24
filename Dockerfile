FROM node:24-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


FROM node:24-alpine AS deploy
WORKDIR /app
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/drizzle ./drizzle
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/.env ./
COPY --from=builder /build/entrypoint.sh ./

RUN chmod 755 /app/entrypoint.sh
EXPOSE 8080

ENTRYPOINT ["/app/entrypoint.sh"]