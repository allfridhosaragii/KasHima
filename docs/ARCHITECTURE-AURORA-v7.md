# KasHima Aurora Glass v7

Visual redesign of all **32 existing React Router business routes**. Inspiration: the supplied Kinora screenshots (plum, orchid and cobalt translucent workflow control surfaces). Not a copy of the robot workflow.

## Design principles
- Ambient canvas: layered CSS radial gradients, no raster hero images or WebGL.
- Navigation: one bounded blur layer for sticky header, sidebar and bottom nav; user blur setting is respected.
- Finance data: high-contrast tinted but opaque-enough card surfaces; never blur actual amounts/QR.
- Mobile 320px first: 4 or 5 quick nav actions within a floating safe-area bar. All other routes accessible from drawer.
- Reduced motion/transparency: disables costly effects; no autonomous parallax.
- Member palette plum/rose, treasurer cobalt, chair orchid; same component geometry.
- Login, profile, setting, ledger, audit, all modal/error states inherit shared design variables.
- Semantic workflow is present for each role: bill -> QR -> verify -> ledger; received -> review -> decide -> archive; proposal -> review -> approve -> audit. These are illustrations, not evidence of settled funds.
- Fonts: platform stack rather than remotely downloaded Google Fonts; fast first paint.

## Technical stack
React 19, TypeScript, Vite 7, React Router 7, Lucide icons, lazy-loading routes, CSS custom properties, Vitest, Playwright 320px/390px/desktop, GitHub Actions and GitHub Pages. Original interactions preserved. The GitHub Pages demo persists fake transactions in browser localStorage only.

## Security limitation
QRIS merchant not integrated, website cannot detect genuine payment without authorized external merchant transaction evidence. Never use the demo to collect real money or personal data. Proper production backend needs authenticated role checks, immutable ledger, D1 storage, private R2 and permitted provider integration.

## Acceptance gates
- Unit + browser CI GREEN before public release.
- All member, treasurer and Kahima routes rendered in Playwright on mobile and desktop.
- No overflow at 320/390, functioning role nav/profile/glass slider, payment-success guard intact.
- Lighthouse/Web Vitals and actual iPhone Safari must be measured before claiming hardware-level smoothness.
