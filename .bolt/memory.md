# Project memory

## Product intent & audience

- Browser-based incremental/idle drilling game (genre confirmed)
- Service worker for offline/caching support
- Test suite with harness (`harness.js`, `run.js`) — tests written in Hungarian
- Plain static files, no compile/bundle step
- Deployed via GitHub (static hosting)

## Brand personality & voice

- Not yet established

## Visual design & UX direction

- Start animation planned (phase 1 scope)
- Planned UI components: engine, generator, workshop view
- Machines have multiple levels with distinct drawing
- Panels for data/inventory/drill-head; hero scene and main menu
- Game drawing pauses while menu is open

## Decisions, constraints & rationale

- `js/base.js` authoritative; root-level `base.js` was stale — replaced with newer version containing `Save.addMig`
- All game modules live in `js/` folder: `base.js`, `power.js`, `blueprint.js`, `lamps.js`, `tunnels.js`
- Tests live in `tests/` folder; test command updated to point there
- `power.js` and `blueprint.js` were in root but index.html and service worker expected them in `js/` — moved
- Service worker cache version bumped to v18 to force browser refresh
- Phase 1 = engine, generator, workshop view, start animation
- `build` npm script = syntax check of game scripts; `test` = full suite (53 checks)
- Root-level `lamps.js` and `tunnels.js` currently unused anywhere — kept for now
- GitHub deployment failure root cause: wrong file locations + stale base.js, now fixed

## Open questions & assumptions

- Whether `lamps.js` and `tunnels.js` will be needed later or should be removed
- Deployment host/config details not fully known
- Game not visually or mobile tested after fixes
- Phase 1 work awaits user confirmation
- Visual style still undefined
- If deployment still fails, user should send new logs for diagnosis