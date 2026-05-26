FROM oven/bun:1.3

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY tsconfig.json openapi.json docker-entrypoint.sh ./
COPY src ./src
RUN chmod +x docker-entrypoint.sh \
  && chown -R bun:bun /app

USER bun

ENTRYPOINT ["./docker-entrypoint.sh"]

EXPOSE 4000
