# Project memory

## Product intent & audience

- Browser-based game (specific genre/mechanics not yet confirmed)
- Uses a service worker for offline/caching support
- Has a test suite with its own runner (`harness.js`, `run.js`)

## Brand personality & voice

- Not yet established

## Visual design & UX direction

- Game includes a start animation (planned as part of "phase 1")
- Planned UI components: engine, generator, workshop view (phase 1 scope)
- Machines have multiple levels with distinct drawing

## Decisions, constraints & rationale

- `base.js` relocated to `js/` folder for organized project structure
- `index.html` and service worker cache both reference `js/base.js` — paths are consistent
- `base.js` provides save protection and performance control features
- Development is phased; phase 1 = engine, generator, workshop view, start animation
- Test runner configuration fixed — tests now run correctly from project root
- All 33 tests pass; coverage includes saving, loading old saves, performance controller, drilling, fuel, and machine level drawing
- Visual/touch/sound testing still needed (not covered by test suite)

## Open questions & assumptions

- Game has not been run or tested visually or on mobile after fixes
- Phase 1 work awaits user confirmation before starting
- Exact game genre, mechanics, and visual style still undefined
- Whether `index.html` was already pointing to `js/base.js` before the move or was preconfigured for this structure is unclear