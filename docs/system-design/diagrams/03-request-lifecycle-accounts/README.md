# 03 Request Lifecycle Accounts

## Goal
Explain end-to-end lifecycle for `POST /api/v1/accounts` including success, validation failure, and upstream unavailability.

## Why this matters
- Defines stable passthrough behavior expected by clients.
- Makes correlation propagation behavior explicit.
- Documents where gateway-local errors are allowed.

## Key Design Points
- Gateway performs boundary checks and correlation resolution first.
- Payload is passed to upstream contract without reshaping.
- Upstream 201/422 responses are returned as passthrough.
- Transport failures map to gateway `503 upstream_unavailable`.

## Extensibility Boundary
Any upstream adapter can back `createAccount` if it preserves contract semantics and correlation propagation.

## Interview Prompts
- Which errors are passthrough and which are gateway-owned?
- Why is request/response reshaping avoided in T4?

## Diagram Source
- `DIAGRAM.mmd`
