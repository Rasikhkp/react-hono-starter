#!/usr/bin/env sh
set -e

echo "Running database migrations..."
bun run migrate:latest

echo "Starting API..."
exec bun ./src/index.ts
