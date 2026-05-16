# 01 System Context

## Goal
Show the full system boundary for `api-gateway`: who calls it, what it depends on, and where ownership changes.

## Why this matters
- Makes service ownership explicit.
- Prevents domain leakage into the gateway.
- Clarifies that financial truth remains downstream.

## Key Design Points
- `api-gateway` owns the public contract `/api/v1/*`.
- Upstream integration is modeled as an abstract contract, not a concrete runtime dependency.
- `banking-admin` is a current adapter implementation, not the only possible one.

## Extensibility Boundary
New upstream implementations can replace current adapters as long as they satisfy the same upstream contract.

## Interview Prompts
- What does the gateway own versus what it delegates?
- How would you swap the upstream service without changing clients?

## Diagram Source
- `DIAGRAM.mmd`
