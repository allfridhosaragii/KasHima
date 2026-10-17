# KasHima Quiet Glass v8

Status: frontend React demo, not live financial production.

## Goals
- All 32 React routes share one responsive design system via src/quiet.css imported after Aurora v7.
- Mobile 320px first: readable headings, no overlapping labels or document horizontal scroll, controls 44px touch minimum.
- Keep member payment and history above optional process diagram.
- Treasurer: queue and actionable links before aggregate KPIs and flow.
- Kahima: approval inbox before process guide.
- Reduce decorative gradients/glow and desktop-window traffic lights; maintain the personalized Glass Studio blur preference.
- Preserve light/dark themes, profile editing, all role guards and route behavior.

## Anti-Slop
Design follows purposeful minimal layered glass rather than repeating default cards and glows. Reference: https://github.com/miqdadbadjuber/anti-slop.
Mobile visual tests in tests/quiet-v8.spec.ts should pass for 320, 390, desktop Chromium; physical Safari remains a manual release test.

## Security boundary
QRIS, login and ledger are still browser-demo simulations, not real merchant processing. Direct navigation to a success URL must not create a payment.
