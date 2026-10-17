> Aurora Glass v7. Desain baru untuk 32 route berdasarkan referensi workflow glass plum, cobalt, dan orchid. Baca [arsitektur Aurora](docs/ARCHITECTURE-AURORA-v7.md). Seluruh transaksi masih demo dan bukan kas produksi.

# KasHima — Quiet Luxury Financial Workspace

KasHima is a mobile-first **React + TypeScript** prototype for managing monthly student-association contributions. The project is built with Vite and split into independently maintained app modules rather than a single HTML/JS/CSS demo.

## Development

```sh
npm install
npm run dev
npm run build
npm test
```

`vite.config.ts` configures the GitHub Pages public base `/KasHima/`; the app uses `HashRouter`. The `dist/` output is deployed by GitHub Actions on pushes to `main`.

## Screens and UX

32 application route patterns are implemented across members, treasurers and Kahima, including account setup/recovery explanation, protected receipts, status-aware profile, Glass Studio, role administration and audit. The nav adapts by role; status and role changes are recorded as audit entries in the demo. Main design direction is quiet luxury: restrained ivory/forest palette, editorial typographic hierarchy, minimal decoration, CSS micro-interactions, mobile-first navigation, accessibility and Anti-Slop principles.

### Account statuses & roles

Role: `member`, `treasurer`, `chair`. Membership status: `active`, `leave`, `inactive`, `alumni`. A Kahima can adjust other accounts' roles in **Hak akses** and membership status in **Keanggotaan**. No user can change their own role. All role transitions are recorded in the demo audit log.

### Payment safety

This website is still an **interactive frontend demonstration**. User data, payments, profiles and preferences are stored in localStorage in each browser, not centrally. Login is a role simulator, not server authentication. No real QRIS, merchant APIs or payment confirmations are connected. An authorized treasury demo account must approve a demonstration payment before the receipt route can display a success state. Do not enter real student credentials or send real money through this site.

## Next production milestone

To make KasHima a real secure financial application, add Hono/Cloudflare Workers (or audited alternative), D1 persistent database, audited role-based access and authentication, secure file storage, and a verified authorized merchant transaction source. An image of a QR does not contain the settlement status.

Read [architecture](docs/ARCHITECTURE.md) for routes, component structure and migration scope.
