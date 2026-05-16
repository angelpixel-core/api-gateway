# 06 Auth Boundary Evolution

## Goal
Describe evolution path from `stub` auth mode to `enforced` mode without changing external route contracts.

## Why this matters
- Allows incremental hardening without blocking slice delivery.
- Prevents auth implementation from coupling to one provider.

## Key Design Points
- `stub` mode always allows but annotates context.
- `enforced` mode validates credentials and returns `401/403` when needed.
- Correlation handling remains independent from auth mode.

## Extensibility Boundary
Token validation is abstracted as a capability, not tied to a single identity provider.

## Interview Prompts
- What can change when moving from stub to enforced mode?
- What must remain stable for clients?

## Diagram Source
- `DIAGRAM.mmd`
