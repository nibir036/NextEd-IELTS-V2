# AI IELTS Pro (Next.js)

Converted 1:1 from the original Vite + Express app. Same UI, same
localStorage-backed auth/db, same client-side state router (no react-router,
no next/router) — just running on Next.js's dev server and App Router
instead of Vite + Express.

## What changed structurally
- `server.ts` (Express) → two Next.js Route Handlers:
  `src/app/api/writing/evaluate/route.ts` and
  `src/app/api/speaking/evaluate/route.ts` (identical logic/schemas).
- `src/main.tsx` + `index.html` → `src/app/layout.tsx` + `src/app/page.tsx`
  (page.tsx mounts the untouched `App.tsx` with SSR disabled, since the app
  is a pure client-side SPA).
- `src/index.css` → `src/app/globals.css` (untouched Tailwind v4 content).
- Everything under `src/components`, `src/views`, `src/lib`, `src/data`,
  `src/types.ts` is copied over unmodified.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` (needed for
   the Writing/Speaking AI evaluation features; the rest of the app works
   without it).
3. `npm run dev` — open http://localhost:3000
# NextEd-IELTS-V2
