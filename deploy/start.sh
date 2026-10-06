#!/bin/sh
set -eu
mkdir -p /app/data
(
  while true; do
    python3 /app/agents/scan_jobs.py --source linkedin,ats --pages 1 --max-age-days 14 --no-db --json || true
    sleep 21600
  done
) &
cd /app/webapp
exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port "${PORT:-3001}"
