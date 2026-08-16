---
name: ui-performance
description: Use when the user asks to improve, audit, or debug UI performance — slow pages, high LCP/INP/CLS, large bundles, re-renders, waterfall fetches, or "make the app faster". Also use when working on loading/error states, images, fonts, or table virtualization in this Next.js 16 / React 19 / Tailwind 4 app. Produces a baseline audit, targeted fixes (highest impact first), and verification against Core Web Vitals.
---

# UI Performance Workflow (gcms-app)

Goal: make the admin/employee console fast and stable. Stack: **Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · lucide-react**.

This is the process to follow. The detailed checklist lives in `UI-PERFORMANCE-SKILL.md` at the repo root — read it and apply its rules when implementing fixes.

## 1. Audit first — never fix blind

Before touching code:

1. `npm run lint` and `npm run build` — must pass; note the largest client chunks in the build output.
2. Run the app (`npm run start`) and measure with Lighthouse in Chrome DevTools.
3. Record Core Web Vitals targets: **LCP < 2.5s · INP < 200ms · CLS < 0.1 · Accessibility ≥ 95**.
4. Grep the codebase for anti-patterns (see Section 4 of `UI-PERFORMANCE-SKILL.md`):

```bash
rg -n "outline-none|outline: none" --glob "*.{tsx,css}"
rg -n "console\.log" --glob "*.tsx"
rg -n "transition-all|transition: all" --glob "*.{tsx,css}"
rg -n "<img" --glob "*.tsx"
rg -n "new Date\([^)]*\)\.toLocale" --glob "*.tsx"
rg -n "onClick=\{" --glob "*.tsx"
```

5. Report findings to the user in priority order **before** making changes.

## 2. Known hot spots in this app (check these first)

- **Every route is `"use client"`** (`app/admin/**`, `app/employee/**`) — the whole app ships to the browser. Convert static shell/table markup to Server Components; keep only interactive islands client-side.
- **No `loading.tsx` / `error.tsx` / `not-found.tsx` anywhere** — routes render blank while fetching. Add skeleton `loading.tsx` and graceful `error.tsx` for `app/admin/**` and `app/employee/**`.
- **Date formatting in JSX** — `app/admin/complaints/page.tsx:234`, `app/employee/complaints/[id]/page.tsx:408`, `components/complaint-information-request.tsx:69`, `app/admin/notifications/page.tsx:131`. `new Date(...).toLocaleString()` inside render re-runs every render and risks hydration mismatch. Precompute or wrap in `useMemo`.
- **`console.log` shipped to production** — `app/employee/complaints/[id]/page.tsx:348` and the employee fetch helpers in `lib/api.ts`. Remove.
- **`outline-none` on inputs** — `components/form-field.tsx:17`, `app/login/page.tsx`, `app/verify-otp/page.tsx`, `app/admin/complaints/page.tsx:161`. Replace with `focus-visible` rings (e.g. `focus-visible:ring-2`) or drop `outline-none`.
- **Logo/icon PNGs** in `public/` (`logo.png`, `logo-white.png`, `icon.png`). Convert to WebP/AVIF and render with `next/image` with explicit dimensions.
- **Empty `next.config.ts`** — no image config, compression, or `staleTimes` tuning. See the fixes checklist.

## 3. Fix by impact (highest first)

Apply only after the audit and only one bottleneck at a time, verifying between each:

1. **Waterfalls** → parallelize independent fetches with `Promise.all`; start promises before `await`; split slow sections into `<Suspense>` boundaries. The dashboard fetches several lists (complaints, users, departments, stats) — these must not chain.
2. **Bundle size** → import from concrete paths (no barrel files), `next/dynamic`/`React.lazy` for below-the-fold charts and report tables, named `lucide-react` imports only, no heavy date lib (use `Intl.DateTimeFormat`), keep client components thin.
3. **Re-renders** → move constants/components out of component bodies, lazy `useState`, functional updates, `useDeferredValue`/`startTransition` for search/table filters, `React.memo` only for heavy components with stable non-primitive props.
4. **Tables** → `AutoTable` and complaint tables render every row; add virtualization for >50 rows or `content-visibility: auto` on rows.
5. **Images & fonts** → `next/image` with `width`/`height` (`priority` above the fold, `lazy` below), `next/font` instead of CDN fonts, `preconnect` for external domains.
6. **Server-side** → keep routes as Server Components; pass IDs not whole objects to client components; add `loading.tsx`/`error.tsx`; avoid module-level mutable state.

## 4. Verify after every change

- `npm run lint` — clean.
- `npm run build` — passes; confirm no new large client chunks.
- Re-run Lighthouse: LCP < 2.5s, CLS < 0.1, Accessibility ≥ 95.
- Walk the employer path: **Login → Dashboard → Open a complaint → Change status → Log out** — every step must be labeled, obvious, and instant.

## 5. Conventions to respect

- Bilingual app (ar/en via `lib/locale-context`); use `t(...)` keys — never hardcode UI strings.
- Follow the existing Tailwind tokens (`text-ink`, `bg-paper`, `border-line`, `text-brass`, `text-muted`, `text-brick`).
- Don't add new dependencies unless required; prefer built-in browser/React APIs.
- Read the Next.js docs in `node_modules/next/dist/docs/` before writing Next-specific code — this Next version has breaking changes vs. training data.
