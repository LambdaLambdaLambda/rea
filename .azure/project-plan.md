# Project Plan

**Status**: Planning
**Created**: 2026-11-14
**Mode**: NEW

---

## 1. Project Overview

**Goal**: Build an original educational browser game in which players sort ocean-themed items into the correct categories to support marine life, with local-only gameplay, replayable scoring, keyboard and touch support, and no account or backend dependency. The project is designed so that every module is independently testable.

**App Type**: Static + API

**API Login**: No

**Mode**: NEW

**Deployment Plan**: No deployment plan found

---

## 2. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | JavaScript |
| **Runtime** | Node |
| **Framework** | Vanilla HTML, CSS, and JavaScript |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 3. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| Azure Static Web Apps | Host the static game frontend and serve browser assets | `PUBLIC_BASE_URL` | `/` | Essential |

---

## 4. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | Frontend | ✅ | v26.13.0 |
| npm | Frontend | ✅ | 11.20.0 |
| Azure CLI | Frontend | ❓ | Unknown |
| Azure Static Web Apps CLI | Frontend | ❓ | Unknown |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | Frontend | ✅ | 20.10.13 |
| `ms-azuretools.vscode-azurestaticwebapps` | Frontend | ❓ | Unknown |

The project is intentionally local and self-contained, so runtime checks should confirm the browser game loads directly from static files before any Azure deployment is attempted. Inform the user to verify all `❓` tools are installed before proceeding.

---

## 5. Project Structure

```
/
├─ index.html
├─ styles.css
├─ app.js
├─ assets/
│  ├─ icons/
│  └─ illustrations/
├─ data/
│  └─ ocean-categories.json
├─ tests/
│  └─ game-logic.test.js
├─ package.json
└─ README.md
```

---

## 6. Design System & UI

**Component Library**: Pico.css
**Style Direction**: A light, playful ocean-inspired interface with rounded cards, clear game-state cues, and warm accent colors that keep classification tasks easy to scan.
**Typography**: system-ui

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#1A7D8C` | Primary action states, category badges, and active round indicators |
| `accent` | `#F4C45C` | Highlight states, score emphasis, and reward feedback |
| `surface` | `#F5FBFF` | Page and card backgrounds for the game board |
| `text` | `#123C4F` | Main body text and game instructions |
| `muted` | `#5D7B8A` | Secondary text, subheads, and non-critical labels |
| `border` | `#CFE3EA` | Dividers, controls, and input borders |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Game | `/` | Play the ocean-sorting challenge and track score | `main + card-list + action-bar` |
| Scoreboard | `/scoreboard` | Review round performance and replay the game | `table + actions` |

### Sample Content

```
Game — Ocean item:
| Item | Category | Match | Status |
| Sea otter | Mammal | Correct | Ready |
| Coral | Invertebrate | Correct | Ready |
| Jellyfish | Invertebrate | Correct | Ready |
| Green sea turtle | Reptile | Correct | Ready |

Scoreboard — Player progress: 3/4 correct · Best streak: 2 · Last round: 220 pts
```

---

## 7. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/` | Serve the main game page for the ocean-sorting experience | — | HTML document | 200 |
| 2 | GET | `/scoreboard` | Show local score summary and replay controls | — | HTML document | 200 |

---

## 8. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
