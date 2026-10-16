# KasHima — frontend architecture (React migration)

## Project format

React 19 + TypeScript + Vite 7. HashRouter allows publishing static build at `/KasHima/` on GitHub Pages. Logic is split into reusable UI components, role-aware app shell, account/member/staff/admin page modules, typed domain state, and demo seed data. Lazy-loaded route groups reduce initial download. Color, glassmorphism and animations are CSS custom properties.

### Project tree

- `src/lib/types.ts`: domain contracts for roles, status, obligations, transactions, notices.
- `src/lib/data.ts`: seed records and formatting helpers.
- `src/lib/store.tsx`: demo state, intent creation/verification, role changes and local persistence.
- `src/components/UI.tsx`: reusable accessible presentation components.
- `src/components/Shell.tsx`: responsive shell, role-driven navigation, theme & glass CSS values.
- `src/pages/AccountPages.tsx`: profile, light/dark theme, Glass Studio settings, help, notices.
- `src/pages/MemberPages.tsx`: member dashboard, dues, QR placeholder, pending, guarded receipt, history, leaderboard.
- `src/pages/FinancePages.tsx`: work queue, reviews, directory, arrears, reminders, ledger, reports, disputes.
- `src/pages/AdminPages.tsx`: approvals, periods, membership status, policy proposals, role administration, audit.
- `src/styles.css`: quiet luxury design tokens, mobile navigation, responsive layout and reduced-motion support.

## Role access rules

`member` can see personal and member pages. `treasurer` has member access plus finance workspace. `chair` has finance workspace plus role administration and governance screens. Profile displays current role and **membership status**. Only a `chair` may change other demo accounts' roles or membership status; cannot demote own chair role. Every change records an audit entry in local state. This is a UI-level demonstration; true RBAC must be enforced by a production server.

## Source and payment boundaries

No real QRIS credentials, merchant keys, screenshots, bank data, or user password are requested. Payment intents are samples and the checkout says QRIS is not connected. A staff member can approve **only demo transactions**, which causes demo receipt display and local history. A direct URL cannot mark an unverified payment as successful.

This is **not** a backend migration. Production requires server-side identity, secure session management, SQL migrations, payment adapter authorized by acquirer, real transaction evidence and atomic ledger posting. GitHub Pages cannot provide such a backend.

## Performance

- React page groups loaded lazily to reduce first route script cost.
- No large animation/video dependencies; micro-transitions are CSS-only.
- Avatar upload cropped/compressed in-browser to 512px WebP before local persistence.
- RequestAnimationFrame not used for glass slider; React state updates CSS variables.
- Supports `prefers-reduced-motion` and `prefers-reduced-transparency`.
- Uses CSS blur only on nav/surface layers; payment figures remain opaque.
- Mobile-first layout is tested from 320px onward.

## Changes requested

Removed all original `MODE PRATINJAU` banner and `01 / IDENTITAS` / `Informasi diri` stage label combination. Settings no longer has the `AKUN AKTIF` card. Profile now shows an account status (`Akun aktif`, `Cuti`, `Nonaktif`, `Alumni`) beside role. The `Hak akses` page allows controlled role assignment in demo; separate account switching is only for demonstration, not privilege escalation.
