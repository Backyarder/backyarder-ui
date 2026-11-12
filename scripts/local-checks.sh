#!/usr/bin/env bash
# Runs the checks CircleCI used to run: a production build and the Cypress
# suite against the dev server. Stops on the first failure.
#
#   bash scripts/local-checks.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== build"
CI=true npm run build

echo "== cypress"
npm start > /tmp/backyarder-ui-devserver.log 2>&1 &
DEV_PID=$!
trap 'kill $DEV_PID 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do curl -s -o /dev/null http://localhost:3000 && break; sleep 2; done
npx cypress run --browser electron
