# 09 Failure Resilience Map

## Goal
Map gateway-level failure handling rules and response ownership by failure class.

## Why this matters
- Ensures consistent client behavior during failures.
- Keeps retry and recovery semantics observable and deterministic.

## Key Design Points
- Network/timeout failures map to gateway-owned `503 upstream_unavailable`.
- Upstream `4xx` and `5xx` are passed through when payload shape is valid.
- Malformed upstream payloads are treated as gateway protocol errors.
- All failure classes emit correlated telemetry.

## Extensibility Boundary
Resilience policy can evolve (timeouts/retries/circuit breakers) if externally visible error semantics remain explicit.

## Interview Prompts
- Which failures are gateway-owned and why?
- Where should retry policy be implemented?

## Diagram Source
- `DIAGRAM.mmd`
