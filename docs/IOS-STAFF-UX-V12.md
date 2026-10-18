# KasHima iOS Minimal Luxury v12 — UX Engineering Decisions

Snapshot: 2026-10-18. Status: design implementation in a **frontend demo**, not production finance or authorized QRIS verification.

## Primary evidence: Apple HIG

1. [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles/) — simplicity serves focus, not deletion of features; recognizable hierarchy and concise actions.
2. [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) — use negative space, grouping, progressive disclosure, adaptive margins, text scaling.
3. [Lists and tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables) — row-based text information is scannable and avoids huge dashboard card repetition.
4. [Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars) — tabs navigate between destinations; do not use them as action buttons; fewer visible choices.
5. [Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) — avoid sidebar in iPhone portrait; compact role-specific navigation is preferable.
6. [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) — blur/vibrancy/material thickness should serve hierarchy and contrast rather than decorating each surface.
7. [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) — iOS 44×44 pt minimum targets and adequately spaced controls.
8. [Branding](https://developer.apple.com/design/human-interface-guidelines/branding) — limit accent color to meaningful actions/status, not every surface.
9. [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) — motion is restrained, avoid peripheral/large distracting animation.
10. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — minimum 4.5:1 normal text, 3:1 large text and interactive boundaries; actual combinations require computed verification.

## Design direction

**Quiet iOS financial workspace.** Use near-white off-gray background, white content surfaces, hairline dividers, a single role accent (blue Treasurer, orchid Chair), native system font stack for small text, left-aligned titles, and flat grouped rows. Visual focus is on tasks and money, not atmosphere or background gradients.

Light and dark mode remain supported. Glass Studio still changes blur of actual navigation surfaces, and reduced-transparency preference disables blur. Card shadows are removed from normal content.

## By-role hierarchy

### Treasurer (10 pages)

| Route | Primary job above fold | Secondary / disclosure |
|---|---|---|
| /pengurus/keuangan | Pending verification CTA and recent pending items | Other operations under *Menu kerja lainnya* |
| /pengurus/verifikasi | Filter then payment list with amount + status | Detailed evidence on child route |
| /pengurus/verifikasi/:id | Amount, member, period, source and decision | Demo confirmation safeguards |
| /pengurus/anggota | Search member, status and due | Member detail route |
| /pengurus/anggota/:id | Open obligations, amount due, contact | Account metadata |
| /pengurus/tunggakan | Filter severity and amount due | Detail route |
| /pengurus/reminder | Each member + copy / WhatsApp actions | Important truth: click is not sent confirmation |
| /pengurus/buku-kas | Month grid and selected date, real accounting categories in demo | Monthly list / export, no unverified cash in totals |
| /pengurus/laporan | Period filter and summary values | Official ledger explanation under disclosure |
| /pengurus/sengketa | Open disputes and resolution actions | History/read-only |

### Chair / administration (6 pages)

| Route | Primary job | Secondary / disclosure |
|---|---|---|
| /pengurus/persetujuan | Pending proposal and two decisions | Four-step process explanation collapsed |
| /pengurus/periode | Current period and organizers | Practical handover checklist revealed when requested |
| /pengurus/keanggotaan | Find/add member and update status | Membership detail handled per member |
| /pengurus/kebijakan | Proposed dues/fine and scenario | Important pending policy mismatch remains prominent |
| /pengurus/akses | Role editor with explicit confirmation | Security/demo limitations revealed via disclosure |
| /pengurus/audit | Event chronological list | Audit storage limitations revealed when requested |

**Important role reality:** current source defines `member`, `treasurer`, and `chair`. Administration screens are within Chair's role. There is no independent backend-enforced Admin role yet; do not claim it exists.

## Navigation and disclosure

- Mobile bottom tabs: four context destinations including Profile, and no sidebar drawer.
- Additional role work destinations grouped into Keuangan, Kepengurusan, Akun dan bantuan under one compact disclosure.
- Desktop retains its sidebar, but no giant decorative cards or repeated gradients.
- Secondary instructions become `<details>` with meaningful headings, not hidden/inaccessible.

## Target CSS and component rules

- Font: -apple-system, BlinkMacSystemFont, Segoe UI, system-ui; no extra font request to preserve performance.
- Body 15 px; form controls 16 px; operational headings 28–36 px max; button targets >=44 px.
- Backdrop blur restricted to navigation and controllable Glass Studio; all accounting rows solid.
- Use CSS-only transitions (opacity/background, short <=150ms), no animation framework.
- Use clamp and wrapping with responsive grids; avoid 2-column inputs at 320 where they clip.
- No cross-page data semantics changed by styling.
- No concealed 'payment verified' inference; only true verified records count.

## Engineering / QA

- All 10 treasurer + 6 chair routes accessible from their role, including detail routes using test fixture IDs.
- Viewports 320, 360, 390, 430, 768, 1024 and 1440 px on light/dark; check global horizontal overflow <=2px, header collision, input clipping, bottom tab targets.
- Test key actions: transaction review, WhatsApp copy action, role changes, glass range, calendar, refund/error flows where available.
- Target real-world Safari iPhone and Android Chrome measurements are **NOT yet verified** by headless Chromium CI.
- Financial flows remain demo localStorage. No cross-device sync, genuine authentication, merchant source, real-time verified QRIS, or audited cash ledger until backend is implemented.
