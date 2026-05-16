# 02 Container Modules

## Goal
Describe internal module composition of the gateway and how requests flow across cross-cutting concerns and proxy modules.

## Why this matters
- Keeps boundaries inside the service clean.
- Avoids controller-level duplication for auth/correlation concerns.
- Makes testing layers more predictable.

## Key Design Points
- `AppModule` composes auth boundary and domain proxy modules.
- Auth and correlation are centralized in `AuthBoundaryModule`.
- Controllers route through client adapters and shared response helpers.

## Extensibility Boundary
Add new domain proxy modules by composition in `AppModule` instead of modifying existing route modules.

## Interview Prompts
- Why are auth/correlation concerns centralized and not controller-specific?
- Where should a new domain route module be plugged in?

## Diagram Source
- `DIAGRAM.mmd`
