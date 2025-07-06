FROM node:24-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build


FROM node:24-alpine AS deploy
WORKDIR /app
COPY --from=builder /build/package*.json ./
RUN npm ci --production
COPY --from=builder /build/. ./

RUN chmod 755 /app/entrypoint.sh
EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]