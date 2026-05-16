# API Gateway System Design

Tags: `api-gateway`, `system-design`, `t4`, `extensibility`, `integration-boundary`, `observability`

## Purpose

Define the internal architecture of `apps/api-gateway` in depth while keeping integration and extension boundaries technology-agnostic.

## Scope

- Public API surface `/api/v1/*`.
- Request orchestration to upstream domain services.
- Auth boundary and correlation propagation.
- Passthrough status/body behavior.
- Observability and resilience boundaries.

## Responsibilities

- Expose stable client-facing routes.
- Enforce gateway-level cross-cutting concerns (auth boundary, correlation, observability).
- Route requests to upstream contracts without reshaping payloads by default.

## Non-Responsibilities

- Owning ledger/account truth.
- Domain-level financial invariants.
- Persistence ownership.

## Internal Architecture Index

Each diagram has its own folder with:
- `README.md` for system-design interview explanation
- `DIAGRAM.mmd` for the canonical Mermaid source

1. `diagrams/01-system-context/`
2. `diagrams/02-container-modules/`
3. `diagrams/03-request-lifecycle-accounts/`
4. `diagrams/04-request-lifecycle-ledger/`
5. `diagrams/05-request-lifecycle-balances/`
6. `diagrams/06-auth-boundary-evolution/`
7. `diagrams/07-observability-flow/`
8. `diagrams/08-extensibility-integration-ports/`
9. `diagrams/09-failure-resilience-map/`

## Extensibility and Integration Principles

- Integrations are modeled as abstract upstream contracts/ports.
- New upstreams should be added via module boundaries, not controller rewrites.
- Keep protocol-specific details encapsulated in adapter/client services.
- Preserve backward compatibility for `/api/v1/*` unless version bump is explicit.

## Test Mapping

- Unit: cross-cutting utilities and clients.
- Integration: controller/module mapping behavior.
- E2E: API contract passthrough behavior.
- Smoke: operational wiring with live upstream.

## References

- `apps/api-gateway/README.md`
- `docs/implementation/vertical-slices/00-01/plan.md`
- `docs/implementation/vertical-slices/00-01/design/README.md`
- `docs/05-service-boundary.md`
- `docs/07-api-contracts.md`
- `docs/10-security-model.md`
- `docs/12-observability-strategy.md`
