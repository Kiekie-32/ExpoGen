# ExpoGen Project Status & TODO

## Overall Progress Summary
- **Barbara (UI/UX)**: ~90% Complete. High-fidelity mockups and navigation are in place.
- **Derrick (API/Backend)**: ~5% Complete. Route structure is defined, but no backend integration exists.

---

## Day 1 — Foundation (Layout + Routing)
- [x] **Derrick**: Set up API base config (axios/fetch wrapper)
- [x] **Derrick**: Create route structure (implemented in `App.tsx`)
- [x] **Barbara**: Build layout (Sidebar, Topbar, Main content container)

## Day 2 — Dashboard + Project Entry
- [x] **Derrick**: Hook dashboard to fetch/create project
- [x] **Barbara**: Build dashboard UI (Start Export button, progress placeholder, next step card)

## Day 3 — Product Setup (CRITICAL)
- [x] **Derrick**: Connect POST /projects, POST /projects/{id}/product, etc.
- [x] **Barbara**: Build product form UI
- [x] **Barbara**: Add HS suggestion display + selection UI

## Day 4 — Compliance Page
- [x] **Derrick**: Connect GET /projects/{id}/compliance and upload endpoint
- [x] **Barbara**: Build checklist UI (Ghana vs Destination sections, status badges, upload button)

## Day 5 — Readiness Engine UI
- [x] **Derrick**: Connect GET /projects/{id}/readiness
- [x] **Barbara**: Build score display, missing items list, warning section, next step button

## Day 6 — Documents + Contract
- [x] **Derrick**: Connect POST /documents/generate, GET /projects/{id}/documents
- [x] **Barbara**: Build generate button, document list, download UI
- [x] **Derrick**: Connect POST /contract/generate
- [x] **Barbara**: Build contract form, preview section, download button

## Day 7 — Polish + Flow Fixing
- [x] **Derrick**: Fix API errors, add loading states, add error handling
- [x] **Barbara**: Add stepper (progress bar)
- [x] **Barbara**: Next action component & minor UI fixes

## Day 8 — User Management (LATEST)
- [x] **Derrick**: Implement POST /auth/register endpoint (frontend service)
- [x] **Barbara**: Update registration UI to use the new endpoint
- [x] **Derrick**: Add Login/Resume Session functionality to restore user profiles

---

## CRITICAL MISSING WORK (Next Steps)
1. **API Integration**: Set up `axios` wrapper and service layer. (COMPLETED)
2. **Dynamic Data**: Replace hardcoded states with API calls. (COMPLETED)
3. **HS Code Selection**: Implement HS suggestion display + selection UI. (COMPLETED)
4. **Stepper**: Implement a global progress stepper. (COMPLETED)
5. **Git Initialization**: The project repository needs to be initialized. (PENDING)
