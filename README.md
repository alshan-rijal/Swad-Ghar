# Swad Ghar

Restaurant management web app for a single restaurant in Damak, Jhapa, Nepal.
React + Vite + TypeScript. The data layer is currently a mock in `localStorage`.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # type-check + build to dist/
npm run preview    # serve the build locally
```

## Demo logins

Password is the username plus `123`.

| Role | Username | Password |
|---|---|---|
| Owner (admin) | `suresh` | `suresh123` |
| Chef | `bikash` | `bikash123` |
| Waiter | `ramesh` | `ramesh123` |

Reset the demo data from the browser console: `localStorage.clear()` then reload.

See `phases.md` for the plan and progress. Everything user-facing lives in `src/`; all data
access goes through `src/api/index.ts`.
