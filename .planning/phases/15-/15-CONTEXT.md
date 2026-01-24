# Phase 15: Dependency Upgrades & Polish - Context

**Gathered:** 2026-01-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade all major dependencies to their latest versions within the specified major version constraints. Verify functionality through smoke testing. If tests pass, ship the upgrades.

**Dependencies to upgrade:**
- Tiptap monorepo → v3.x (latest minor)
- React → 19.x (latest minor)
- @types/uuid → v11.x (latest minor)
- @vitejs/plugin-react → v5.x (latest minor)
- @types/html2canvas → v1.x (latest minor)

**Success criteria:** All existing features work, no console errors/warnings in dev or production builds.

</domain>

<decisions>
## Implementation Decisions

### Upgrade strategy
- **Latest versions only** — Upgrade to the latest minor/patch version within each major version constraint
- **Big bang approach** — Upgrade all dependencies in one phase (not incremental staged upgrades)
- **No version pinning to specific minors** — Use `^` semver ranges to get compatible updates

### Testing approach
- **Smoke test only** — Manual testing of existing features (annotations, visualizer, export, undo/redo)
- **If it works, ship it** — No exhaustive regression testing unless smoke tests reveal issues
- **Check console for errors/warnings** — Zero tolerance for console output in dev or production builds

### Research requirement
- **Check GitHub repos** — For each dependency, research the GitHub repository to identify the exact latest version within the specified major
- **Use npmjs.com as secondary source** — Verify latest versions against npm registry
- **Document exact versions** — Planner should specify precise version numbers (e.g., `^3.5.2` not just `^3.0.0`)

### Breaking change handling
- **Fix breaking changes** — Update code to match new API patterns (e.g., Tiptap v3 extension changes)
- **Suppress deprecation warnings** — If a warning is non-critical and the recommended fix is complex, suppress it with comment explaining why
- **Prefer working over perfect** — Goal is upgrade success, not codebase modernization beyond what's necessary

### Claude's Discretion
- Exact order of dependency upgrades (start with most critical or least risky)
- Whether to run smoke tests after each upgrade or all at once at the end
- How to handle patch-level conflicts between dependencies

</decisions>

<specifics>
## Specific Ideas

- "I only gave you the major version — you need to research the latest minor/patch versions for each"
- Smoke test focus: Core workflows that users actually do (create annotation, export PNG, save/load JSON)
- Console errors/warnings in both development and production builds must be zero

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 15-dependency-upgrades-polish*
*Context gathered: 2026-01-23*
