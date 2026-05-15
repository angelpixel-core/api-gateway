#!/usr/bin/env bash
set -euo pipefail

: "${API_GATEWAY_PORT:=3001}"
: "${BANKING_ADMIN_BASE_URL:=http://127.0.0.1:3000}"
: "${AUTH_BOUNDARY_MODE:=stub}"

npm run build >/dev/null
API_GATEWAY_PORT="$API_GATEWAY_PORT" BANKING_ADMIN_BASE_URL="$BANKING_ADMIN_BASE_URL" AUTH_BOUNDARY_MODE="$AUTH_BOUNDARY_MODE" npm run start >/tmp/api-gateway-smoke.log 2>&1 &
GW_PID=$!

cleanup() {
  kill "$GW_PID" >/dev/null 2>&1 || true
  wait "$GW_PID" 2>/dev/null || true
}
trap cleanup EXIT

sleep 3

health_status=$(curl --max-time 10 -s -o /tmp/api-gw-health.out -w "%{http_code}" "http://127.0.0.1:${API_GATEWAY_PORT}/health")
accounts_status=$(curl --max-time 10 -s -o /tmp/api-gw-accounts.out -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -H "X-Correlation-ID: t4-smoke-accounts" \
  -d '{"account":{"id":"99999999-aaaa-bbbb-cccc-000000000001","account_type":"user","base_currency":"USD","status":"active"}}' \
  "http://127.0.0.1:${API_GATEWAY_PORT}/api/v1/accounts")
balances_status=$(curl --max-time 10 -s -o /tmp/api-gw-balances.out -w "%{http_code}" \
  -H "X-Correlation-ID: t4-smoke-balances" \
  "http://127.0.0.1:${API_GATEWAY_PORT}/api/v1/balances?account_id=99999999-aaaa-bbbb-cccc-000000000001&asset_code=USD")

if [[ "$health_status" != "200" || "$accounts_status" != "201" || "$balances_status" != "200" ]]; then
  echo "smoke failed: health=${health_status} accounts=${accounts_status} balances=${balances_status}"
  exit 1
fi

echo "smoke passed: health=${health_status} accounts=${accounts_status} balances=${balances_status}"
