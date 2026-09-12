#!/usr/bin/env bash
# Per-boot reconciliation: make sure PostgreSQL is up before the dev servers start.
set -euo pipefail

echo "==> Starting PostgreSQL cluster"
sudo pg_ctlcluster 16 main start 2>/dev/null || true

echo "==> Waiting for PostgreSQL to accept connections"
for _ in $(seq 1 30); do
  if pg_isready -q -h localhost -p 5432; then
    echo "==> PostgreSQL is ready"
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready in time" >&2
exit 1
