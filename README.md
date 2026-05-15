# API Gateway

NestJS gateway service for external `/api/v1/*` contracts in FinOps Core.

## Scope (T4)

- Expose gateway routes:
  - `POST /api/v1/accounts`
  - `POST /api/v1/ledger/entries`
  - `GET /api/v1/balances`
- Proxy to Banking Admin upstream:
  - `POST /banking_admin/api/v1/accounts`
  - `POST /banking_admin/api/v1/ledger_entries`
  - `GET /banking_admin/api/v1/balances`
- Preserve upstream status and response body.
- Propagate `X-Correlation-ID` end-to-end.
- Provide auth boundary stub (`AUTH_BOUNDARY_MODE=stub`).

## Environment Variables

- `API_GATEWAY_PORT` (default: `3001`)
- `BANKING_ADMIN_BASE_URL` (default: `http://127.0.0.1:3000`)
- `CORRELATION_HEADER_NAME` (default: `x-correlation-id`)
- `AUTH_BOUNDARY_MODE` (default: `stub`)

## Local Development

```bash
npm install
npm run start:dev
```

## Naming Convention

Canonical naming for this service and modules is tracked in:

- `docs/implementation/vertical-slices/00-01/naming-conventions.md`
