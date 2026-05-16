# 04 Request Lifecycle Ledger

## Goal
Detail lifecycle for `POST /api/v1/ledger/entries`, including idempotency conflict and validation error behavior.

## Why this matters
- Ledger paths are financially sensitive.
- Clients rely on stable error/status semantics.
- Correlation continuity is required for incident analysis.

## Key Design Points
- Request is checked and correlated before proxying.
- Upstream success and business errors (`409`, `422`) are passed through.
- Gateway does not redefine domain error envelopes.

## Extensibility Boundary
Future ledger backends are acceptable if they keep equivalent contract semantics and error classes.

## Interview Prompts
- Why should the gateway passthrough `409 duplicate_reference`?
- Where should idempotency semantics be owned?

## Diagram Source
- `DIAGRAM.mmd`
