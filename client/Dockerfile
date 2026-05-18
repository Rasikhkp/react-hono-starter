FROM oven/bun:1.3 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

ARG VITE_BACKEND_URL=http://localhost:4000
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN bun run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
