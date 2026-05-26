FROM oven/bun:alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Build-time public config only (passed from compose build.args; no defaults here)
ARG VITE_BACKEND_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}

RUN bun run build

# Production stage
FROM caddy:alpine

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
