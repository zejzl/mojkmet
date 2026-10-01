<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# mojkmet.eu

Local food marketplace for Slovenia: farms sell directly to shoppers, with payment and pickup
coordination. Next.js 16 (App Router) + TypeScript, Prisma 7 + Neon (Postgres), NextAuth v4
(credentials/JWT), Tailwind 4, Zod. Full narrative context — decisions, session history, what's
done vs. open — lives in `PLAN.md`; read that first for "why," this file is for "how."

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build (also runs typecheck)
- `npx tsc --noEmit` — typecheck only
- `npm run lint` — ESLint
- `npm run seed` — seed the DB (`prisma/seed.ts`)
- `npx prisma generate` — regenerate the Prisma client after a schema change
- Payments need the local mock provider for end-to-end testing: `node scripts/dev-payment-mock.mjs`
  (port 8787) — see README "Getting Started"

## Layout

- `app/api/**/route.ts` — API routes (29 of them). Public-facing (`farms`, `products`,
  `register`, auth) and `dashboard/*` (session-gated, farmer- or consumer-only depending
  on route)
- `app/dashboard/**` — client-rendered dashboard; farmer vs. consumer nav/pages split by
  `session.user.role`
- `lib/` — all business logic: `auth.ts`/`auth-helpers.ts` (NextAuth + session guard),
  `validation.ts` (every Zod schema), `errors.ts` (shared error-message + Sentry hook),
  `payments/` (provider interface + mock impl + expired-hold reconciliation),
  `pickup-slots.ts` (recurring-window → bookable-slot math, timezone-aware),
  `image-upload.ts` (upload validation/sanitization), `rate-limit.ts`, `geo.ts`,
  `*-mail.ts` + `email-layout.ts` (transactional email)
- `prisma/schema.prisma` — source of truth for the data model; migrations applied via
  `prisma db execute` (no shadow DB on this Neon setup — see README "Database")

## Conventions

- **Validate every API route body** with a Zod schema from `lib/validation.ts` via the
  `parseJson()` helper — don't hand-roll `request.json()` parsing.
- **Report errors** through `getErrorMessage(error, fallback)` from `lib/errors.ts` — it
  captures to Sentry and returns a safe user-facing message (full detail only outside
  production). Nearly every route/page's catch block should funnel through it rather than
  building its own error response.
- **Money is handled in integer cents internally** (see `app/api/orders/route.ts`) to avoid
  float rounding errors, then converted to `Decimal(10,2)` for storage.
- **Payments go through the `lib/payments/` provider interface**, not a hardcoded provider —
  `getPaymentProvider()` currently always returns the mock; a real provider (Račun123) swaps
  in there later without touching call sites.
- **Images are validated + canonicalized by `lib/image-upload.ts`** and stored as a `data:`
  URL directly in Postgres — there is no file/blob storage, and external image URLs are
  rejected outright.
- **UI copy and user-facing error strings are Slovenian**; code comments are mixed — Slovenian
  for business-logic rationale, English for technical/framework notes. Follow whichever
  convention the surrounding code already uses in a given file.
- **This repo runs on Windows** (PowerShell) but is a normal Node/Next.js project — no
  Windows-specific code should be needed; git is configured to normalize line endings
  (CRLF locally, LF in the repo) and this is expected/harmless.
- **The server-side auth/CSP gate is `proxy.ts` at the repo root, not `middleware.ts`.**
  Next.js 16 renamed the convention; a `middleware.ts` alongside `proxy.ts` is a **build
  error** ("Both middleware file... and proxy file... are detected"), not a silent override —
  don't add a `middleware.ts` file. `proxy.ts` already gates `/dashboard/*` (redirects to
  `/login` when there's no session JWT) and sets `Content-Security-Policy` on all
  non-API/non-asset routes; `app/dashboard/layout.tsx`'s `useSession()` redirect is a
  client-side fallback on top of that, not the actual gate.

- **The cart lives in `lib/cart-context.tsx`, backed by two stores.** Guests use
  `localStorage`; signed-in users use the server cart (`CartItem` model, `app/api/cart/**`),
  and a guest cart is merged into it once at login. Every server mutation replies with the
  full cart; the context applies replies in request order and ignores error replies. To remove
  several items use `removeItems()`, not repeated `removeFromCart()` calls.
- **Login honors `?redirect=<path>` (and `?callbackUrl=`)**, validated by
  `safeRedirectPath()` in `lib/safe-redirect.ts` so only same-site paths are followed.

## Known gaps (see PLAN.md for the authoritative list)

- None listed here right now; PLAN.md is the source of truth.
