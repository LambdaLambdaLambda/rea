# Project Plan

**Status**: In Progress
**Created**: 2026-11-15
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build an original, offline educational browser game where players sort ocean wildlife and human-made litter into the right categories, receive clear marine-life guidance, and replay rounds with a score loop. The standalone game uses keyboard and touch input, has no account, telemetry, backend, or external runtime assets, and keeps only a personal best score in local browser storage. The project is designed so that every module is independently testable.

**App Type**: Static browser app (frontend only)

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | JavaScript |
| **Framework** | Vanilla HTML, CSS, and JavaScript |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | `npm test` |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| — | No Azure service is required to run the local, offline browser game. | — | — | — |
| Browser localStorage (client-side; not an Azure service) | Save the optional personal-best score on this device; gameplay remains available if storage is blocked. | None | Browser localStorage | Enhancement |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Modern browser (Safari or Chrome) | Frontend | ✅ | Safari 27.0.1; Chrome present, version not queried |
| Node.js (for automated tests) | Frontend | ✅ | v26.13.0 |
| npm (test command/tooling) | Frontend | ✅ | 11.20.0 |
| Vitest (project test runner; installed as a dev dependency) | Frontend | ❓ | Unknown |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Browser developer tools (Safari Web Inspector / Chrome DevTools) | Frontend | ✅ | Safari 27.0.1; Chrome DevTools present, version not queried |

No Azure emulator, container runtime, or Azure-specific debug extension is required for this frontend-only plan. Double-check that Vitest is installed with the project test dependencies before proceeding.

---

## 5. Design System & UI

**Component Library**: Pico.css + native form controls (self-hosted locally; no CDN)
**Style Direction**: A bright, welcoming ocean field-kit with calm teal surfaces, buoyant coral-and-sand accents, and rounded, tactile sorting cards. Keep wildlife and litter categories visually distinct while prioritizing readable instructions, visible focus, and clear correct/try-again feedback.
**Typography**: system-ui, -apple-system, "Segoe UI", sans-serif

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#126B72` | Ocean-teal play actions, active game navigation, and the wildlife category |
| `accent` | `#F2B84B` | Sunlit progress markers, score highlights, and the litter-category accent |
| `surface` | `#F3FAF8` | Pale sea-glass page background behind the sorting board and results |
| `text` | `#18383B` | High-contrast instructions, species names, and score values |
| `muted` | `#557477` | Supporting marine-life tips, round metadata, and secondary labels |
| `border` | `#D1E4E1` | Soft outlines around item cards, category targets, and score rows |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Game | `/` | Sort six ocean items into Marine life or Ocean litter, see supportive feedback, and track round progress. | `header + nav + hero + main + card-list + grid + action-bar` |
| Round Results | `/#results` | Review round scores, local best score, replay the challenge, and see first-play or storage-unavailable states. | `header + nav + main + tabs + table + actions` |

### Sample Content

Game — Ocean item:
| Item | Correct category | Marine-life guidance | Round state |
|------|------------------|----------------------|-------------|
| Sea otter | Marine life | Observe quietly; never feed wild otters. | Correct |
| Coral | Marine life | Look closely, but do not touch or stand on coral. | Correct |
| Plastic bottle | Ocean litter | Remove it only when it is safe to do so. | Correct |
| Lost fishing line | Ocean litter | Keep clear and report it to a trained responder. | Correct |
| Green sea turtle | Marine life | Give nesting turtles and hatchlings plenty of space. | To sort |
| Jellyfish | Marine life | Observe from a safe distance and avoid contact. | To sort |

Round Results — Completed round:
| Round | Correct | Score | Takeaway |
|-------|---------|-------|----------|
| Current round | 4 of 6 | 240 pts | Every careful choice helps protect ocean life. |
| Previous round | 5 of 6 | 300 pts | Keep wildlife at a respectful distance. |
| Best round | 6 of 6 | 360 pts | Perfect tide: all six items sorted correctly. |

First-play state — no earlier rounds: Start a round to create your first result.
Personal best — 360 pts · saved only in this browser.

---

## 6. Project Structure

```text
ocean-sort/
├── index.html
├── styles.css
├── src/
│   ├── app.js                 # Browser UI, keyboard/touch controls, and local navigation
│   ├── game-logic.js          # Pure sorting, feedback, and scoring rules
│   ├── ocean-items.js         # Bundled original item descriptions and category data
│   └── local-score.js         # Best-score persistence with storage-unavailable fallback
├── tests/
│   └── game-logic.test.js
├── package.json               # Test script; no runtime server or external asset dependency
└── README.md
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/` | Load the self-contained game shell and start a round. | — | Static HTML with local CSS and JavaScript | 200 |
| 2 | HASH | `/#results` | Switch to the client-side round-results view without a network request. | — | Local round scores and saved personal-best state | Client-side |

---

## 8. Next Steps

1. Review this plan and approve it explicitly before any implementation begins.
2. After approval, run **azure-project-scaffold** to create the standalone browser game described here.
3. No backend, database migration, or live-data integration is planned; verify the static game and local score behavior directly in a browser.
4. Run **azure-debug-plan** → **azure-debug-generate** only if local debugging artifacts are wanted.
5. Azure deployment is not part of this offline-first plan; revisit hosting only if that requirement changes.
