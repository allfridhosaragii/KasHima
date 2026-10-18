# KasHima Clarity v9 — design/UX acceptance

This is a mobile-first redesign of the existing React/TypeScript **demo**, not a production QRIS backend.

## General contract
- Preserve all 32 routes and all user-facing features. Role workspaces are Member, Treasurer, Kahima/administrator.
- Layout starts at 320px. No global horizontal overflow, letter collisions, clipped currency amounts, overlapping header or bottom navigation.
- Use one meaningful primary action per view. List rows are preferable to decorative card grids. Money, dates, due dates and verification states must be readably labeled.
- Keep the React router, lazy page imports, theme toggle, Glass Studio blur slider 0–28px, profile editing, role demo switching, and logout.
- Use calm neutral surfaces with subtle member lavender, treasurer blue, chair mauve accents. CSS backgrounds are static; only modal/nav layers use moderate backdrop blur. Respect reduced motion and reduced transparency.
- 44px minimum tap targets; input font size 16px on iPhone; modal has Escape and keyboard focus cycling. Dark/light must remain legible.
- Process diagrams are progressive disclosures (details/summary) rather than always occupying primary screen space.

## Per role
1. **Member:** a short welcome, clear total dues, a single Pay action, recent invoices and payments above optional process details.
2. **Treasurer:** transactions awaiting verification and actionable queue precede summaries; staff navigation shows five primary destinations with additional tools under Menu lainnya.
3. **Kahima:** Persetujuan is the role landing page; decisions come first; finance and reports remain reachable, other administrative routes are preserved in expandable menu.

## Source layout
- `src/clarity.css`: shared tokens, typography, responsive component system.
- `src/components/Shell.tsx`: navigation grouped by role.
- `src/components/MoneyFlow.tsx`: optional explanation.
- `src/components/UI.tsx`: semantic modals and shared controls.
- `src/pages/MemberPages.tsx`, `FinancePages.tsx`, `AdminPages.tsx`: role-specific simplifications.
- `tests/clarity-v9.spec.ts`: role/page fitting, guarded payment success, slider, keyboard dialog.

## Production boundary
Every financial figure is demo browser-local state. Payment Success is not real QRIS confirmation. Real money needs proper authentication, immutable ledger, source of bank transaction truth and authorization. Do not input student credentials or pay into demo.

## Remaining acceptance tasks
Run typecheck/build, unit and Playwright in CI, check UI on iPhone Safari physically, capture screenshot at 320/390/430/768/1440, and measure Core Web Vitals on actual devices. No test PASS claim without execution evidence.
