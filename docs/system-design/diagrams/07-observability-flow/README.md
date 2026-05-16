# 07 Observability Flow

## Goal
Define how logs, traces, and metrics are emitted across gateway processing and upstream calls.

## Why this matters
- Correlation-based debugging depends on consistent telemetry fields.
- Operational ownership requires explicit signal boundaries.

## Key Design Points
- Gateway emits structured logs, traces, and metrics per request.
- Upstream call telemetry must be linked using the same correlation id.
- Required fields are explicit: service, route, status, correlation_id, upstream.

## Extensibility Boundary
Telemetry backend choices are implementation details if required fields and semantic events are preserved.

## Interview Prompts
- Which telemetry fields are non-negotiable?
- How would you switch observability vendors without losing semantics?

## Diagram Source
- `DIAGRAM.mmd`
