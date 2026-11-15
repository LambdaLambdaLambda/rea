# Integration Hand-off

## Frontend
- Project folder: `ocean-sort/`
- Run command: `python3 -m http.server 4173`
- Local port: `4173`
- Health check: `http://localhost:4173/`
- Primary route: `/` and `/#results`
- API seam: none (static browser-only app)
- Mock data: none; all logic is local and self-contained

## Backend
- No backend service required.
- No database.
- No migrations.
- No seed data.

## Services and scope
- Essential: game logic, score tracking, feedback messaging, local best-score persistence
- Enhancement: browser localStorage fallback warning when persistence is blocked
- Runtime: browser-only static app using vanilla HTML, CSS, and JavaScript

## Validation
- Test command: `npm test`
- Build check: `npm run build`
- Manual verification: open the browser preview, sort items, and confirm the score and results screen work without a network connection.
