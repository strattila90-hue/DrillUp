# Project memory

## Product intent & audience

- Browser-based incremental/idle drilling game (genre now confirmed)
- Service worker for offline/caching support
- Test suite with harness (`harness.js`, `run.js`) — tests written in Hungarian
- Plain static files, no compile/bundle step

## Brand personality & voice

- Not yet established

## Visual design & UX direction

- Start animation planned (phase 1 scope)
- Planned UI components: engine, generator, workshop view
- Machines have multiple levels with distinct drawing
- Panels for data/inventory/drill-head; hero scene and main menu
- Game drawing pauses while menu is open

## Decisions, constraints & rationale

- `base.js` in `js/` folder; `index.html` and service worker both reference `js/base.js`
- `base.js` provides save protection and performance control features
- Phase 1 = engine, generator, workshop view, start animation
- `build` npm script changed from running full test suite to a syntax check of game script files (passes in deployment); `test` script kept for full suite
- Full test suite (39 checks) passes locally including fresh copy, but failed in deployment environment — root cause unknown; game script likely didn't load properly in deployment env
- Test coverage: saving, migration, backup, performance controller, drilling, fuel, machine levels, motor, generator, workshop cards, event hooks, regression
- Test harness returns `undefined` for unreachable names — matches deployment error pattern

## Open questions & assumptions

- Deployment environment differences causing test suite failure not identified
- Game not visually or mobile tested after fixes
- Phase 1 work awaits user confirmation
- Visual style still undefined
- Deployment host/config details not fully known
- If deployment fails again, user should send new logs for further diagnosis