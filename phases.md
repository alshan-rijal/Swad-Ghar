# Swad Ghar — phases.md

> Single source of truth for this project. A new session should be able to read ONLY this file and continue.

## Resume here

- **Phase 1 is complete and tested** (build + browser checks pass). Waiting for owner approval.
- The app runs from the repo root: `npm install`, then `npm run dev` (http://localhost:5173).
- Phase 2 is next: build the real **waiter screen** and **chef screen** on the existing mock API.
- Nothing is blocked; no open questions for the owner.

---

## 1. Project summary

1. **What:** a restaurant management web app — take orders, run the kitchen, track bills per table, show the owner sales.
2. **For:** one average restaurant in Damak, Jhapa, Nepal (~20–30 orders/hour at peak).
3. **Stack:** React + Vite + TypeScript + React Router, plain CSS (no UI library). Mock API in `localStorage` for now.
4. **Hosting:** frontend on Cloudflare Pages. Backend (later) on Cloudflare Workers + Hono, MongoDB Atlas M0, JWT.
5. **Roles:** waiter, chef, admin (owner). Only the owner marks a bill paid and sees sales.

---

## 2. Current status

- **Current phase:** Phase 1 — complete, awaiting approval.
- **Done:** project setup, design tokens, shared UI pieces, routing + role protection, login screen, mock API + seed data, three placeholder role pages, README.
- **In progress:** nothing.
- **Exact next step:** mark Phase 1 approved, then start Phase 2 by building the waiter screen (`src/pages/Waiter.tsx`) against `src/api/index.ts`.

---

## 3. Phase table

| # | Phase | Goal | Status |
|---|---|---|---|
| 1 | Setup, design system, routing, mock data | Foundation + login | **done** |
| 2 | Waiter + chef screens | Order taking and kitchen board on mock data | not started |
| 3 | Owner dashboard, billing, reports, deploy | Full frontend on Cloudflare Pages | not started |
| 4 | Backend (Workers + Hono + Atlas) | Real API, auth, roles, CRUD, reports | not started |
| 5 | Connect frontend to API, live, harden | Polling, security, tests, deploy, backups | not started |

### Phase 1 — Setup, design system, routing, mock data

- [x] Vite + React + TypeScript project, only needed deps
- [x] Poppins font + CSS token file
- [x] Shared pieces: Logo, Button, Input, Card, AppHeader
- [x] Routing with role protection (`/login`, `/waiter`, `/chef`, `/admin`)
- [x] Login screen matching the design
- [x] Mock API module + seed data + shared types
- [x] Placeholder waiter / chef / admin pages
- [x] `npm run dev` and `npm run build` work
- [x] README

### Phase 2 — Waiter + chef screens (next)

- [ ] Waiter: table chips, category tabs, items with +/−, running total, Send to kitchen, View bill (read-only)
- [ ] Waiter header shows the waiter's own name and selected table
- [ ] Waiter: mark served
- [ ] Chef: three columns New / Preparing / Ready, order cards with table, time since order, items, notes
- [ ] Chef: Start preparing / Mark ready
- [ ] Empty, loading and error states for both screens
- [ ] Poll the mock API so two tabs see the same data (polling shape mirrors Phase 5)
- [ ] Touch targets ≥ 44px, visible focus, contrast

### Phase 3 — Owner dashboard, billing, reports, deploy

- [ ] Sidebar (Dashboard, Orders, Menu, Tables, Staff)
- [ ] Stat cards: today's orders, today's sales, month orders, month sales
- [ ] Daily sales bar chart
- [ ] Open table bills with **Mark paid** + payment method (cash, eSewa, Khalti, bank QR)
- [ ] Recent orders list with payment method
- [ ] Menu, Tables, Staff management
- [ ] Responsive + accessibility pass; deploy to Cloudflare Pages

### Phase 4 — Backend

- [ ] Workers + Hono, MongoDB Atlas driver, models, JWT, role middleware
- [ ] Menu, tables, orders, bills, reports endpoints
- [ ] Nepal time zone for all report ranges

### Phase 5 — Connect and harden

- [ ] Replace `src/api/index.ts` internals with real `fetch` calls
- [ ] Poll every 3–5s (Durable Objects later)
- [ ] Security review, tests, deploy, backups

---

## 4. Completed work log

### Phase 1 — files

| Path | What it does / exports |
|---|---|
| `package.json` | scripts `dev`, `build` (`tsc --noEmit && vite build`), `preview`. Deps: react, react-dom, react-router-dom. Dev: vite, @vitejs/plugin-react, typescript, @types/react, @types/react-dom. |
| `vite.config.ts` | Vite config with the React plugin only. |
| `tsconfig.json` | Strict TS, `moduleResolution: bundler`, `verbatimModuleSyntax`, `noUnusedLocals/Parameters`. Includes `src` and `vite.config.ts`. |
| `index.html` | Vite entry, Poppins from Google Fonts, `/logo.svg` favicon, `<title>Swad Ghar</title>`. |
| `.gitignore` | node_modules, dist, *.local, .DS_Store. |
| `public/logo.svg` | Demo logo: white circle with a red plate ring. **Swap this file to rebrand.** |
| `src/config.ts` | `APP_NAME` = 'Swad Ghar', `APP_TAGLINE` = 'Damak, Jhapa'. Change the demo name here only. |
| `src/types.ts` | Domain types (`Role`, `TableStatus`, `OrderStatus`, `PaymentMethod`, `User`, `MenuItem`, `Table`, `OrderItem`, `Order`, `Bill`, `DailySales`, `Summary`) + `HOME_PATH` (role → route). |
| `src/lib/time.ts` | `nepalDateKey`, `startOfNepalDay`, `startOfNepalMonth`, `monthToDateKeys`, `formatRs`. All Nepal-time logic lives here. Dev-only `console.assert` self-check on the day boundary. |
| `src/api/store.ts` | Mock DB in `localStorage`. Exports `DbUser`, `Db`, `DB_KEY` (`sg.db`), `SESSION_KEY` (`sg.session`), `loadDb()`, `saveDb()`, and the seed builder (private). |
| `src/api/index.ts` | The API contract (see §5). Exports `login`, `logout`, `getSession`, `getMenu`, `getTables`, `getOrders`, `createOrder`, `updateOrderStatus`, `getBill`, `payBill`, `getSummary`. |
| `src/auth.tsx` | `AuthProvider`, `useAuth()` → `{ user, login, logout }`, `RequireRole({ role, children })` which redirects to `/login` or the user's own home. |
| `src/components/Logo.tsx` | `Logo({ size })` renders `/logo.svg`. |
| `src/components/ui.tsx` | `Button` (+ `block`), `Input({ label, ... })`, `Card`. |
| `src/components/AppHeader.tsx` | `AppHeader({ subtitle?, right? })` — red bar with logo, signed-in name, extra actions, Log out. |
| `src/styles/global.css` | CSS variables (design tokens), reset, base typography, `.btn`, `.card`, `.field`, `.app-header`, `.page`, `.title`, `.muted`. |
| `src/pages/Login.tsx` + `Login.css` | Login screen; redirects logged-in users to their home. Shows the demo logins. |
| `src/pages/Waiter.tsx` | Placeholder (Phase 2). |
| `src/pages/Chef.tsx` | Placeholder (Phase 2). |
| `src/pages/Admin.tsx` | Placeholder (Phase 3). |
| `src/App.tsx` | `AuthProvider` + `BrowserRouter` + routes below. |
| `src/main.tsx` | React root; imports `styles/global.css`. |
| `README.md` | How to run and build. |

### Routes

| Route | Page | Guard |
|---|---|---|
| `/login` | `Login` | public; pushes a signed-in user to their home |
| `/waiter` | `Waiter` | `RequireRole role="waiter"` |
| `/chef` | `Chef` | `RequireRole role="chef"` |
| `/admin` | `Admin` | `RequireRole role="admin"` |
| `*` | redirect → `/login` | — |

### State

- **Auth session:** React context in `src/auth.tsx`, persisted to `localStorage['sg.session']` by the API. Survives refresh; cleared on logout.
- **Mock data:** `localStorage['sg.db']` written by `src/api/store.ts`; every API call reloads it, so browser tabs see each other's writes.

---

## 5. Mock API reference (the contract the real backend must match)

All functions are `async`, take plain values, and throw `Error` with a human message on failure. They read the signed-in user themselves (the real API will read it from the JWT), so **no `createdBy` / `paidBy` parameters**.

| Function | Signature | Returns / behaviour |
|---|---|---|
| `login` | `(username: string, password: string)` | `User`; stores session. Throws `Wrong username or password`. |
| `logout` | `()` | `void`; clears session. |
| `getSession` | `()` | `User \| null` (sync, from localStorage). |
| `getMenu` | `()` | `MenuItem[]` |
| `getTables` | `()` | `Table[]` |
| `getOrders` | `()` | `Order[]`, newest first |
| `createOrder` | `(tableId: string, items: OrderItem[])` | `Order`; status `placed`; waiter/admin only; marks the table occupied and appends to its open bill. |
| `updateOrderStatus` | `(orderId: string, status: OrderStatus)` | `Order`; `preparing`/`ready` require chef/admin, `served` requires waiter/admin. |
| `getBill` | `(tableId: string)` | `Bill` — the open (unpaid) bill with all items, or an empty bill. Read-only. |
| `payBill` | `(tableId: string, paymentMethod: PaymentMethod)` | `Bill`; **admin only**; sets `paidAt`/`paidBy`, frees the table. Throws `Nothing to pay for this table`. |
| `getSummary` | `()` | `Summary`; **admin only**. |

### Data shapes

- `User { id, name, username, role: 'waiter'|'chef'|'admin', active }`
- `MenuItem { id, name, category, price, available }` — `price` is whole rupees
- `Table { id, number, status: 'free'|'occupied' }`
- `OrderItem { name, price, qty, note? }`
- `Order { id, tableId, tableNumber, items: OrderItem[], status: 'placed'|'preparing'|'ready'|'served', createdBy, createdAt }`
- `Bill { id, tableId, tableNumber, orderIds: string[], items: OrderItem[], total, paymentMethod?, paidAt?, paidBy? }` — a bill with no `paidAt` is open; `items` is merged by name
- `Summary { todayOrders, todaySales, monthOrders, monthSales, dailySales: {date,total}[], openBills: Bill[], recentBills: Bill[] }`
- `PaymentMethod = 'cash' | 'esewa' | 'khalti' | 'bank_qr'`

### Mock storage

- `sg.db` — the whole database: `{ users: (User & {password})[], menu, tables, orders, bills }`. Seeded on first load when missing.
- `sg.session` — the signed-in `User`.
- Reset the demo: in the browser console run `localStorage.clear()` and reload.

---

## 6. Seed data

**Users** (password = username + `123`):

| Name | Username | Password | Role |
|---|---|---|---|
| Suresh Shrestha | `suresh` | `suresh123` | admin |
| Bikash Limbu | `bikash` | `bikash123` | chef |
| Ramesh Rai | `ramesh` | `ramesh123` | waiter |

**Menu (3 categories, 10 items):** Momo — Steam 220, Fry 250, Chilli 280, Kothey 260. Noodles — Veg Chowmein 180, Chicken Chowmein 220, Thukpa 200. Drinks — Milk Tea 50, Coffee 80, Coke 100.

**Tables:** 8, numbered 1–8, all free.

**History:** seeded paid bills for every day of the current month up to today (2–4 per day, random payment method), plus 2 bills earlier today. Tables 3 and 6 are seeded as occupied with one open order each, so the waiter and dashboard have live data. The generator is seeded (`rng(20260101)`), so the numbers are identical on every machine.

---

## 7. Decisions made

1. **App lives at the repository root** (not in `client/`). The backend will go in its own top-level folder in Phase 4. Fewer nested paths for now.
2. **Nepal time via a fixed +05:45 offset** instead of `Intl` time zones. Nepal has no daylight saving, so this is exact and simple. All day/month boundaries in `src/lib/time.ts`.
3. **API reads the session internally** rather than taking `createdBy`/`paidBy` args, so swapping in a JWT-based backend changes nothing at the call sites.
4. **A "bill" is the set of unpaid orders for a table.** `createOrder` extends the table's open bill; `payBill` closes it and frees the table. There is no separate "open bill" creation step.
5. **`getSummary.dailySales` includes a zero entry for each day** from the 1st to today, so the chart can draw the whole month without filling gaps itself.
6. **Demo password = username + `123`** for easy demos. Stored in plain text in the mock only (the real backend will hash it).
7. **A single `global.css`** holds tokens and the shared classes; each page may add one CSS file (only `Login.css` so far).
8. **Mock latency of 100ms** on every call so loading states get exercised.
9. **TypeScript 7, Vite 8, React 19, React Router 7** (latest at setup). Vite's default port 5173.
10. Menu items all have `available: true`; availability filtering is not used yet.
11. Placeholder role pages use the shared `AppHeader` + `Card` so they already read correctly on phone and desktop.

---

## 8. Conventions

- **Layout:** `src/config.ts`, `src/types.ts`, `src/lib/`, `src/api/`, `src/auth.tsx`, `src/components/`, `src/pages/`, `src/styles/`.
- **Naming:** components and pages `PascalCase.tsx`, one exported component each; everything else `camelCase.ts`; CSS class names `block__element--modifier`.
- **Styling:** CSS variables from `global.css` only — never hard-code a hex. Reuse `.btn`, `.card`, `.field` before adding new classes.
- **Types:** domain types live in `src/types.ts`. Import them with `import type` (verbatim module syntax is on).
- **New page:** create `src/pages/Name.tsx`, add a `<Route>` in `src/App.tsx` wrapped in `RequireRole` with the right role.
- **New shared component:** add it to `src/components/ui.tsx` if it is small; give it its own file if it grows.
- **All data access goes through `src/api/index.ts`.** Never read `localStorage` from a page.
- **No dead code:** `noUnusedLocals`/`noUnusedParameters` are on and the build must stay warning-free.

---

## 9. How to run, build, deploy

```bash
npm install       # once
npm run dev       # http://localhost:5173
npm run build     # tsc --noEmit && vite build  ->  dist/
npm run preview   # serve the built app locally
```

**Deploy (Phase 3):** Cloudflare Pages, build command `npm run build`, output directory `dist`. Because routing is client-side, add `public/_redirects` containing `/* /index.html 200` before the first deploy.

---

## 10. Known issues, shortcuts and later work

- `src/api/index.ts` has `shortcut: fake latency` (100ms `later()`); delete when the real API is wired in.
- Cloudflare Pages needs the `_redirects` fallback (above) or deep links 404. Not added yet.
- The daily sales chart can look sparse early in the month (it only covers the 1st → today). Decide in Phase 3 whether to chart the last 14 days instead.
- No menu / tables / staff CRUD yet (Phase 3). No live updates yet (Phase 5).
- Mock data is per-browser (`localStorage`); it is not shared between devices. That is expected until Phase 4.
- The old 1 MB logo PNGs in the project root are unused; the web app uses `public/logo.svg`.

---

## 11. Backend contract notes (Phase 4)

- **Endpoints (roles in brackets):** `POST /api/auth/login` [all]; `GET /api/menu` [all]; `POST|PUT|DELETE /api/menu` [admin]; `GET /api/tables` [all]; `POST /api/orders` [waiter, admin]; `PATCH /api/orders/:id/items` [waiter, admin]; `PATCH /api/orders/:id/status` [chef: preparing/ready; waiter: served]; `GET /api/tables/:id/bill` [waiter read, admin]; `POST /api/bills/:tableId/pay` [**admin only**]; `GET /api/reports/summary` [admin]; `GET|POST /api/users` [admin].
- **Response shapes must match §5** exactly, so only `src/api/index.ts` changes in Phase 5.
- **Report ranges use `Asia/Kathmandu` (UTC+5:45):** today = 00:00 Nepal → now; month = 1st 00:00 Nepal → now. Order counts come from `orders.createdAt`, sales from `bills.paidAt`.
- One order is created per "Send to kitchen"; a table's bill is the sum of its unpaid orders. `total = Σ price × qty`, whole rupees, no VAT or service charge.
