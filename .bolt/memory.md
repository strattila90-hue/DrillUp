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

## Decisions, constraints & rationale

- `base.js` relocated to `js/` folder for organized project structure
- `index.html` and service worker cache both reference `js/base.js` — paths are consistent
- `base.js` provides save protection and performance control features
- Development is phased; phase 1 = engine, generator, workshop view, start animation
- Test runner expects `tests` folder one level up from its current location — needs path adjustment to work from project root

## Open questions & assumptions

- Test suite (`harness.js`, `run.js`) not yet runnable; path configuration likely broken from project root
- Game has not been run or tested after the file move
- Phase 1 work awaits user confirmation before starting
- Exact game genre, mechanics, and visual style still undefined
- Whether `index.html` was already pointing to `js/base.js` before the move or was preconfigured for this structure is unclear