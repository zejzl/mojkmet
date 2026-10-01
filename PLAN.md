# mojkmet.eu — Project Plan & Status

> Sveže od kmeta, neposredno k vam.
> Farm-to-consumer marketplace for Slovenia. Last updated: **September 28, 2026**

---

## What This Project Is

**mojkmet.eu** is a marketplace connecting Slovenian farms (kmetije) directly with
consumers — fresh produce without middlemen, fair prices, guaranteed freshness.

- **Live site:** https://mojkmet.eu (deploys automatically from `main` via Vercel)
- **Repo:** https://github.com/zejzl/mojkmet
- **Canonical local copy:** `D:\Coding\Projects\mojkmet-app` (single source of truth)

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Neon) via Prisma 7 + Neon serverless adapter |
| Auth | NextAuth v4 (credentials, JWT sessions, bcrypt-12) |
| Email | Nodemailer via SMTP (`info@mojkmet.eu`, shared transporter in `lib/mailer.ts`) |
| Payments | Mock provider on `api.mojkmet.eu` behind `lib/payments/` provider interface (Račun123 later) |
| Analytics | Plausible |
| Hosting | Vercel (env vars: DATABASE_URL, NEXTAUTH_SECRET/URL, MOJKMET_EMAIL_*, PAYMENT_*) |

### Features Built

- Homepage, farm listings + detail pages, product catalog with search/filtering
- Product detail pages with related products
- Shopping cart (localStorage) + checkout + order system with stock management
- Dual dashboard: consumer (orders, favorites, settings) + farmer (farm profile,
  products CRUD, order status management)
- Auth: register (consumer/farmer), login, forgot/reset password (email tokens)
- Waitlist email capture, SEO (sitemap.xml, robots.txt), footer subpages
  (categories, deals, FAQ, privacy, terms, shipping, returns, contact)

---

## Session Log — August 20–21, 2026

### 1. Repo consolidation
- Discovered 3 divergent local copies (Desktop ×2, Projects ×1); deployed site was
  ahead of all of them (openclaw had pushed footer subpages directly to GitHub on Feb 22)
- Flattened to single canonical repo at `D:\Coding\Projects\mojkmet-app`, synced to origin
- Archived duplicates into `D:\Coding\Projects\_archive\` (3 zips), deleted originals (~1.2 GB)

### 2. Credential rotation & repo scrubbing
- Scrubbed leaked secrets from 5 docs (NEXTAUTH_SECRET, live + old Neon DB passwords)
  and refactored 4 debug scripts to read `DATABASE_URL` from env
- Rotated NEXTAUTH_SECRET (strong random) across Vercel (all envs) + local
- Rotated Neon DB password via direct SQL over WebSocket (HTTP SQL proxy silently
  ignored ALTER ROLE); updated Vercel + local env files
- ⚠️ Leaked values remain in git history — made harmless by rotation

### 3. Password reset flow (new feature)
- `/forgot-password` + `/reset-password` pages (Slovenian UI)
- APIs: SHA-256 token hashes stored in existing `VerificationToken` table (no migration),
  1h expiry, single-use, generic responses (no user enumeration)
- Extracted shared mailer into `lib/mailer.ts`; waitlist route refactored onto it
- E2E verified with real SMTP delivery to info@ inbox

### 4. Security audit + fixes
Full audit of all API routes, auth flows, deps, headers. Fixed and verified live:

| Severity | Issue | Fix |
|---|---|---|
| CRITICAL | `/api/register` accepted arbitrary `role` (self-service ADMIN) | Whitelist CONSUMER/FARMER |
| HIGH | No server-side email/password validation | Regex + length enforced server-side |
| HIGH | No rate limiting on auth endpoints | Shared limiter in `lib/rate-limit.ts` (register, forgot/reset) |
| HIGH | Missing security headers | X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy |
| HIGH | 21 vulnerable dependencies | next 16.3.1, next-auth 4.24.15, nodemailer 9.0.5 → 0 vulns |
| MED | Negative order quantities corrupt stock/totals | Integers 1–999 enforced |
| LOW | `/api/test` exposed, error detail leaks, bcrypt inconsistency | Removed/genericized/unified |

Commits: `4967651` (scrub), `346ba0d` (reset flow), `8dc7b2b` (security fixes),
`1003b30` (.npmrc legacy-peer-deps for nodemailer 9 peer conflict)

---

## Session Log — September 28, 2026 (Phase 2 kickoff)

### Decision log (settled with product owner)
- **Merchant of record = mojkmet.eu** — single fictional Račun123 account. mojkmet
  issues all invoices, collects all money, and pays farmers out (split, off-platform).
- **Payments built against a mock provider first**, behind a provider interface in
  `lib/payments/`. Swapping in real Račun123 later is a config change, not a rewrite.
- **Prepay at checkout** (no cash/plačilo ob prevzemu in v1).
- **One farm per order.** Multi-farm cart is allowed, but checkout resolves to a
  single farm (others stay in the cart until their own order).
- **Booked pickup slots.** Farmers define recurring pickup windows; customer books a
  slot at checkout. Farmer may propose an override (swap/change), customer confirms.
- **Pickup-only for v1** (delivery later). Farmers pick their windows/location;
  **farmer sets minimum order value** — farmers won't drive 30 km for €2 of eggs.
- Račun123 facts (research): invoicing/FURS-fiscalization, no split/multi-merchant;
  "API po meri" = push API → `invoiceNumber`/`pdfUrl`/`zoi`/`eor`; customer pays on the
  hosted page to the account holder's TRR; refund/credit-note path unverified → assume
  manual fallback.

### Server infra & mock provider (done)
- **`api.mojkmet.eu` created** on the cPanel box (`sh29.neoserv.si` / `152.89.235.65`,
  NS `ns57/ns58.neoserv.si`). Registered as a **subdomain** of `mojkmet.eu` (not addon —
  cPanel rejects addon names that are subdomains of an owned domain; not alias — aliases
  would serve the Vercel-hosted main site). AutoSSL Let's Encrypt cert covers it; A record
  points at the box. Docroot `/home/mojkmet/api.mojkmet.eu`.
- **Mock payment provider deployed** (PHP front controller):
  `GET /v1/health`, `POST /v1/payments/initiate` (X-API-Key, idempotency key), `GET
  /v1/payments/status?ref=`, `GET|POST /pay/<ref>` hosted page (`/settle`, `/cancel`),
  `POST /_wh_echo` debug. Webhook callbacks signed `X-Payment-Signature: HMAC-SHA256(body, secret)`.
  Shared API key in server `config.php` (mode 600); app side goes in `PAYMENT_*` env vars.
- **Status:** deployed, `php -l` clean, and verified working during sync windows
  (health → 200 JSON). ⏳ LiteSpeed multi-node vhost sync on the Neoserv side is
  still converging (requests intermittently answered by the main vhost). If not converged
  within ~1–2 h → ticket Neoserv to rebuild/reload LiteSpeed vhosts. ModSecurity is
  enabled account-wide (incl. `api.mojkmet.eu`) — watch for false-positive 403s on the
  JSON endpoints once live.

---

## Plan — Phase 2: Payments + pickup marketplace (Steps 0–7)

### Step 0 — Plan doc (this file) ✅

### Step 1 — Security fixes (prerequisite, unblocks everything)
- [x] Introduce `zod` + `lib/validation.ts`; validate **every** API route body (currently
      routes do `request.json() as Partial<T>` — no validation library installed)
- [x] Stop leaking `details: error.message` in the 5 raw-SQL routes:
      `api/products`, `api/products/[id]`, `api/farms`, `api/farms/[id]`, `api/stats`
      (those routes are now on Prisma, not raw SQL — see Step 2; `getErrorMessage`
      only returns raw messages outside production)
- [x] Bound `?limit=` in `app/api/dashboard/orders/route.ts` (currently unbounded)
- [x] Fix host-header injection in `app/api/auth/forgot-password/route.ts` (lines 32–35:
      attacker-controlled `Host` lands in the reset URL inside email HTML) +
      HTML-escape every interpolated value in email templates
- [x] Server-side gate for `/dashboard/*` + strict CSP headers — done as **`proxy.ts`**
      (commit `60aa464`), not `middleware.ts`: Next.js 16 renamed the middleware convention
      to `proxy.ts` (a `middleware.ts` + `proxy.ts` pair in the same repo is a build error).
      `proxy.ts` checks the session JWT via `getToken()` and redirects to `/login` before the
      page loads, and sets a `Content-Security-Policy` header on all non-API/non-asset
      routes. `app/dashboard/layout.tsx`'s `useSession()` redirect is now just a client-side
      fallback/UX nicety, not the actual gate. Verified live: unauthenticated `GET /dashboard`
      → `307` to `/login?callbackUrl=%2Fdashboard`; CSP header present on `/`.
- [x] Fix in-memory rate limiter (`lib/rate-limit.ts`): unbound `Map`, never pruned —
      prune + cap (Upstash in Step 7 if abuse appears)
- [x] Fix `parseInt` stock validation in `api/dashboard/products` (NaN coercion) —
      superseded by `z.coerce.number().int()` in `productSchema`/`productUpdateSchema`

### Step 2 — Data model + migrations
- [x] Rewrite `prisma/schema.prisma` per design below; start `prisma/migrations/` history
- [x] Order: `farmId` (1:1), `paymentStatus`, `subtotal`/`platformFee`/`payoutAmount` as
      `Decimal(10,2)`, `paymentProvider`/`paymentRef`/`invoiceNumber`/`invoicePdfUrl`/`paidAt`,
      `pickupStartsAt`/`pickupEndsAt`, `reservedUntil`. Remove `deliveryAddress`/`deliveryCity`/`deliveryPostal`
- [x] New: `PickupWindow` (recurring farmer availability), `PickupChange` (farmer/consumer
      override proposals), `PaymentEvent` (`@@unique([provider, externalId])` — webhook idempotency)
- [x] Order status state machine:
      `AWAITING_PAYMENT → PAID → ACCEPTED → READY → COLLECTED → COMPLETED`, plus `CANCELLED`/`REFUNDED`
- [x] Stock: decrement on order create with `reservedUntil` (≈15 min) + lazy sweep for expired holds
      (`lib/payments/reconcile.ts`)
- [x] Migrate the 5 raw-SQL routes in Step 1 onto Prisma (verified: no `$queryRaw`/`$executeRaw`
      remain anywhere in `app`/`lib`)

### Step 3 — Payments
- [x] `lib/payments/` provider interface + `mock` implementation calling `api.mojkmet.eu`
- [x] `app/api/webhooks/payments/route.ts` — verify HMAC signature, dedupe via `PaymentEvent`
- [x] Checkout: initiate payment → redirect customer to hosted `/pay/<ref>` page → on
      success hit return URL → mark order PAID (parity check with `reservedUntil` expiry)
- [x] Local dev mock: `scripts/dev-payment-mock.mjs` (port 8787, `PAYMENT_MOCK_BASE_URL=http://localhost:8787`) + end-to-end verified
      (initiate/idempotency/409, settle→webhook HMAC, 401/404/409/400 guards, order → PAID, idempotent replay); e2e fixture cleaned up
- [ ] Deploy env vars on Vercel: `PAYMENT_PROVIDER=mojkmet-mockpay`, `PAYMENT_MOCK_BASE_URL=https://api.mojkmet.eu`,
      `PAYMENT_MOCK_SECRET=<shared key>` (blocked on `api.mojkmet.eu` vhost, see Server infra note)
- [ ] Confirm `api.mojkmet.eu` serves mock over HTTPS (LiteSpeed vhost) and run a real init→redirect→settle round trip

### Step 4 — Pickup coordination
- [x] Farmer dashboard: `PickupWindow` CRUD (recurring availability), min-order settings, location
- [x] Checkout: show only open slots for the farm, book start/end
- [x] `PickupChange` flow: farmer proposes new slot → consumer confirms → notify both
- [x] Public farm page shows windows + min order
- [x] Smoke-tested against dev server + Neon (24 checks): window CRUD, slots, min order, valid/outside-window orders, propose/accepted-reject/cancel changes, webhook → PAID

### Step 5 — Email templates
- [x] Order confirmation (consumer, on order create / awaiting payment, with pay link)
- [x] Payment confirmation (consumer, incl. pickup slot + farm contact)
- [x] New order notification (farmer, incl. buyer, items, slot)
- [x] Pickup booking/changes emails (proposal + resolved; Step 4, now on shared layout)
- [x] Shared branded email layout (`lib/email-layout.ts`); all sends best-effort
- [x] Smoke-tested against dev server + Neon + mail.mojkmet.eu (SMTP reached; test.local recipients 550 by design)

### Step 6 — Farmer onboarding + distance
- [x] Self-serve farm creation (existing upsert + onboarding nudge wired); **free first year**: `Farm.plan` (`TRIAL`/`STANDARD`/`PREMIUM`) + `trialEndsAt` (1 year on self-serve create), shown in farmer dashboard; pricing copy aligned ("prvi let brezplačno")
- [x] `Farm.latitude/longitude` exposed in shopper APIs (`/api/farms`, `/api/farms/[id]`, `/api/products…`); `lib/geo.ts` Haversine; `DistanceBadge` (browser geolocation, shared registry) on farms list, farm page, featured farms, product cards; `Permissions-Policy: geolocation=(self)`
- [x] Fixes: empty lat/long `''` no longer coerced to `0` (`optionalCoord`); FeaturedFarms `verified`→`is_verified` bug; dead CTA on `/farms` → link to `/for-farmers`
- [x] Smoke-tested (12 checks): onboarding null → create (TRIAL + 1yr, null coords) → update coords → shopper APIs expose coords → products carry farm coords → Haversine sanity (LJ→MB 103,6 km)

### Step 7 — Hardening
- [x] **Image upload**: there was *no* upload path before — `Product.image`/`Farm.image` were unvalidated URL strings (seed-only). Added real upload backed by Postgres (data URL) with strict validation in `lib/image-upload.ts`: allowlist (JPEG/PNG/WebP/GIF), **magic-byte sniffing + structural dimension parse** (rejects fake/polyglot/SVG/HTML/JS disguised as images), **canonicalization** (trailing garbage after IEND/EOI/trailer stripped — polyglots sanitized), 1.5 MB size cap, dimension cap (≤16000px, blocks decompression bombs), declared-MIME must match content, **external/image URLs rejected** (farmers can't hotlink trackers/payloads), empty = clears image. Wired into product create/update + farm PUT; `ImageUploadInput` client component (client pre-check + preview); images now rendered on product cards, product detail, farm detail, farms list, FeaturedFarms, farmer product table.
- [x] **Upstash Redis rate limiter**: `lib/rate-limit.ts` rewritten async, sliding-window via
      Upstash when `UPSTASH_REDIS_REST_URL`/`_TOKEN` set, else pruned in-memory fallback;
      client identity from `X-Forwarded-For` (trusted — set by Vercel's edge, not the client;
      `NextRequest.ip` no longer exists in Next.js 15+); all 4 call sites
      (`register`, `forgot-password`, `reset-password`, `contact`) updated to `await`
- [x] **Sentry monitoring**: `@sentry/nextjs` + client/server/edge configs + `instrumentation.ts`
      + `withSentryConfig` in `next.config.ts`; `lib/errors.ts`'s `getErrorMessage` (used by
      nearly every API route and client error handler) calls `Sentry.captureException`
- [x] **GitHub Action CI**: `.github/workflows/ci.yml` — lint, `tsc --noEmit`, build on push/PR
- [x] AES cleanup verified (no AES references left in any `.ts`/`.tsx` source), seed script
      bcrypt parity (cost 12, matches register/reset/change-password), README/docs refresh
      (README: Upstash/Sentry env vars + Images/Rate limiting/Monitoring sections;
      `VERCEL_ENV_SETUP.md`: optional Upstash/Sentry vars)
- [x] Smoke-tested (20 validator + 11 API): valid PNG/JPEG/GIF/WebP stored canonical; SVG/HTML/garbage/mismatched-mime/external-URL/`javascript:` rejected; PNG+`<script>` polyglot stored *with script bytes stripped*; 20000px & 0px dimensions rejected; >1.5 MB rejected; image clear via `''` works.
- [x] Upstash/Sentry/CI hardening verified: fixed 3 API-drift errors surfaced by `tsc --noEmit`
      that predated this round — `NextRequest.ip` removed in Next.js 15+ (rate-limit IP now
      from `X-Forwarded-For`/`X-Real-IP` only), `withSentryConfig` moved to
      `@sentry/nextjs/config` in SDK 11.x, `hideSourceMaps`/`disableLogger` build options
      removed (source-map deletion is now default behavior). Lint, `tsc --noEmit`, and
      `next build` all clean. Dev-server smoke test: `/api/contact` (limit 3/15min) allowed
      3 requests then returned 429 on the 4th, confirming the in-memory rate-limit fallback
      still works post-fix.

---

## Session Log — October 1–2, 2026 (UI polish, SEO, server-side catalog)

All merged to `main` (commits `6197178`, `e4f6f04`, `c4066fd`, `ba484db`, `7046428`, `2c70dcb`,
`d4cc33d`), CI green on each. Visual design was deliberately **kept as-is** (green/Inter): a full
redesign was tried and rejected, so the work below is polish, correctness and SEO only.

- **Accessibility/polish** (Header, Hero, Footer, Newsletter, FeaturedFarms, Categories,
  HowItWorks, TrustBadges): visible keyboard focus, `prefers-reduced-motion`, labelled
  inputs/buttons, live-region status/alert messages, darker small green/amber text for contrast.
  Mobile menu now closes after tapping a link; Inter loads `latin-ext` (č/š/ž were falling back
  to a system font); header greeting shows the first name only; Slovenian plural for the cart
  label (`lib/plural-sl.ts`).
- **SEO**: `lib/site.ts` (`pageMetadata()`, site URL), title template + Open Graph/Twitter,
  per-page titles/descriptions, `generateMetadata` for farm/product pages, dynamic sitemap (all
  farms + products, hourly), `robots.ts`, `X-Robots-Tag: noindex` for private pages, JSON-LD
  (Organization/WebSite, LocalBusiness, Product), generated share image. See README "SEO".
- **Shop-page bugs fixed**: single-farm checkout never loaded pickup slots (effect keyed on a
  farm id only the multi-farm radio set); order submit cleared the *whole* cart instead of just
  the ordered farm's items (`removeItems()`); product-detail "V košarico" had no handler; login
  ignored `?redirect=` (now `safeRedirectPath()`); product cards didn't link to the detail page.
- **Cart sync (`lib/cart-context.tsx`)**: error replies no longer blank the cart, replies are
  applied in request order, and signing out resets to the guest cart.
- **Server-side catalog**: `/farms`, `/farms/[id]`, `/products`, `/products/[id]` load on the
  server through `lib/catalog.ts` (shared with the `/api/farms` and `/api/products` routes);
  unknown ids are real 404s (`app/not-found.tsx`); images are served by
  `/api/{farms,products}/[id]/image` (never embedded in HTML/JSON). Dev-only CSP `unsafe-eval`
  added in `proxy.ts` to remove the dev overlay's "1 Issue" badge (production unchanged).
- **CI**: `actions/checkout` and `actions/setup-node` v4 → v7, runner pinned to
  `ubuntu-24.04` (clears the Node 20 and Ubuntu 26 migration warnings).
- **`/deals` hidden**: it showed -10…-30% offers and discounted bundles with March 2026 dates,
  but the app has no discount/coupon logic (cart/checkout always charge list price; bundle
  buttons just link to `/products`). Unlinked from the Footer and left `noindex`; the page
  file stays with a comment. Re-link only once discounts are real.
- **Browser verification** (Claude in Chrome, against the local dev server): guest cart →
  checkout → login redirect → pickup slots → pay button enable, product-page add to cart,
  filters/search without page reload, 404 page, plural label. **Caveat: the local
  `DATABASE_URL` is the production endpoint** (see Operational notes), so this touched
  production data: it logged in as the two seeded accounts (`prisma/seed.ts`), created and then
  deleted one Monday pickup window for Kmetija Vidmar (visible publicly for a few minutes), and
  merged then emptied those two accounts' server carts (the consumer's cart was emptied without
  first checking whether it already held anything). No orders were created and nothing else was
  written. Not verified in a browser: placing an order from one of two farms (`removeItems`),
  the image route with a real uploaded image, and failed/out-of-order cart replies.

## Next Steps (Prioritized) — beyond Phase 2

- [ ] Payments go-live: **on hold** — needs a registered company before Račun123 (or any
      real merchant-of-record processor) can be set up; swap mock → Račun123 "API po meri"
      (invoice, zoi/eor, pdfUrl, hosted payment page); confirm refund/credit-note path with vendor
- [x] **Server-side cart sync for logged-in users.** New `CartItem` model (`prisma/schema.prisma`,
      migration `20260928230000_cart_items`) — stores only `userId`/`productId`/`quantity`,
      name/price/stock always hydrated fresh from `Product` (`lib/cart.ts`) so it can't go
      stale the way the old localStorage cart could. API: `app/api/cart/route.ts` (GET/POST/DELETE),
      `app/api/cart/[productId]/route.ts` (PATCH/DELETE), all session-gated, stock-clamped.
      `lib/cart-context.tsx`'s public `useCart()` interface is unchanged — guests keep the
      original localStorage behavior; on login, any guest cart is merged into the server cart
      once, then the server is the source of truth. No consumer page needed to change.
      Verified live via API: add/increment/update/remove/clear, over-stock clamping (999 → 200),
      401 when unauthenticated.
- [x] **Reviews/ratings UI.** `Review` gained `@@unique([userId, farmId])` + `updatedAt`
      (migration `20260928231000_review_unique_updated_at`, existing duplicates collapsed).
      `app/api/farms/[id]/reviews/route.ts`: public GET, POST gated to verified purchase
      (`Order.status` in `COLLECTED`/`COMPLETED` for that user+farm) and blocks `FARMER` role,
      upserts so a resubmit edits rather than duplicates. New `components/StarRating.tsx`
      (read-only + interactive). UI: read-only review list on the farm detail page (now `app/farms/[id]/FarmDetail.tsx`, fed by a server `page.tsx`);
      submit/edit form on `app/dashboard/orders/page.tsx` for COLLECTED/COMPLETED orders
      (same inline-expand pattern as the existing pickup-change proposal UI). Existing
      rating aggregation (`prisma.review.groupBy`/`aggregate` in the farms/products routes)
      needed no changes. Verified live via API: 403 without a verified purchase, 403 for
      `FARMER` role, successful submit, resubmit edits in place (same review id, no duplicate),
      farm's aggregate rating/count reflects it.
- [ ] Migrate NextAuth v4 → Auth.js v5 (v4 maintenance mode)
- [ ] Admin tooling (farm verification, moderation) — ADMIN role exists but unused
- [ ] Profile email change requires re-verification
- [x] **Tests.** Vitest, two tiers (see README "Tests"): 63 unit tests (75 as of 2026-10-02; 94 incl. integration) (`test/unit/`) for
      pure `lib/` logic (validation, geo, pickup-slots, image-upload, rate-limit, plus later safe-redirect, plural-sl, image-response); 19
      integration tests (`test/integration/`) calling route handlers directly against a
      dedicated test database (`neon-pink-book`/`ep-little-dust-ag4wbjxz` — a separate Neon
      project from production, migrated fresh) — register, credentials `authorize()`
      (extracted to `lib/auth.ts`'s `authorizeCredentials` for testability — NextAuth wraps
      whatever's passed to `CredentialsProvider`, so the original inline version wasn't
      reachable from a test), orders (stock/farm-grouping/min-order/pickup-time/payment-
      failure-rollback), cart, reviews. `test/integration/setup.ts` refuses to run without
      `TEST_DATABASE_URL` and refuses if it ever equals `DATABASE_URL`. `test:unit`/`test`/
      `test:db:migrate` in `package.json`.
      **2026-09-28: `TEST_DATABASE_URL` GitHub secret added, and CI went fully green for the
      first time ever** (`gh run watch`) — the workflow had actually been broken since it was
      first added: (1) `if: ${{ secrets.TEST_DATABASE_URL != '' }}` on a step is invalid —
      `secrets` isn't a valid context in a step-level `if:`, so GitHub silently rejects the
      *entire workflow file* (0 jobs, "workflow file issue", no useful log) rather than
      failing that one step; fixed via a job-level `env:` var computed from the secret,
      checked in the step's `if:` instead. (2) The `Build` step's `DATABASE_URL` secret was
      **never actually set** on this repo (only `NEON_API_KEY` existed before today) —
      `lib/prisma.ts` throws at module load if unset, so `next build` failed on every push.
      Fixed by reusing `TEST_DATABASE_URL` for the build step too (`next build` never runs a
      real query, it only needs the var present) rather than adding a third secret.
- [ ] Delete retired `ep-divine-butterfly` Neon project entirely (creds already removed)
- [ ] **Bug: farmer-cancelling an order doesn't restore stock.** `PATCH /api/orders/[id]/route.ts`
      lets a farmer/admin set any status including `CANCELLED`, but unlike the other two
      cancellation paths (`app/api/orders/route.ts`'s payment-init-failure rollback,
      `lib/payments/reconcile.ts`'s expired-reservation sweep), this one never increments
      stock back — a farmer cancelling a paid order permanently loses that stock.
- [ ] No consumer-initiated order cancellation. `PATCH /api/orders/[id]/route.ts` is
      farmer/admin only — a shopper who ordered by mistake or changed their mind has no
      self-service way to cancel before pickup.
- [ ] `User.emailVerified` is defined in the schema but completely unused anywhere in the
      app — no verification email is ever sent on registration, credentials login doesn't
      check it. Not urgent (email ownership isn't security-critical the way password reset
      is), but currently decorative.
- [ ] No pagination on `/api/products` or `/api/farms` — both fetch everything unbounded.
      Fine at today's scale (~10 farms), will degrade once real farmers sign up. **More
      pressing since 2026-10-02:** `/farms` and `/products` now render the full list on the
      server on every request (`lib/catalog.ts`), so an unbounded list also means unbounded
      HTML and DB work per page view.
- [ ] No rate limiting on `/api/orders` — unlike auth/contact routes, a logged-in user could
      spam order creation, each one putting a 15-minute stock hold on real inventory. Low
      likelihood of abuse at current userbase size, but it's the one write-heavy route with
      zero rate limiting.
- [ ] Image storage is a `data:` URL blob directly in Postgres (see Step 7) — deliberate
      tradeoff for now, but a scaling concern once farmers upload more/larger images; a real
      blob store (Vercel Blob, R2) is the eventual fix. (Delivery is no longer the problem:
      since 2026-10-02 pages and JSON never embed the `data:` URL; they use
      `/api/{farms,products}/<id>/image?v=…`, cached immutably. Storage in Postgres and the
      per-request DB read behind that route are what remain.)
- [ ] No account deletion / data export flow — EU user data, worth having on the GDPR radar
      even at tiny scale.
- [ ] **Local dev uses the production database.** `.env`/`.env.local` `DATABASE_URL` is the
      `ep-royal-recipe-ag8s29y6` endpoint that these notes identify as production (one Neon
      project, one branch). Create a Neon branch for development and point local `.env` at it.
      (Note PLAN.md also calls `ep-little-dust-ag4wbjxz` the test DB in one place and
      production's display name in another; the naming drift described below is why to verify.)
- [ ] **Seed/demo data and accounts are in that database.** The seeded farms (10), products
      (39) and two accounts from `prisma/seed.ts` (a consumer and a farmer) exist there, and
      those accounts use the seed script's shared, known password. Before launch: remove the
      demo data or replace it with real farms, and delete or re-password the seed accounts.
      Until then the new sitemap publishes every demo farm/product URL to search engines.
- [ ] Copy still describes home delivery in places (`/how-it-works`, `/shipping`: delivery,
      shipping costs, "24-48 hours") while v1 is pickup-only with prepayment.
- [ ] Real discounts/coupons (schema + cart/checkout) so `/deals` can come back; today it is
      hidden and its content is placeholder.
- [ ] Browser/e2e coverage: there is none. Things only verified by hand so far are listed in the
      2026-10-02 session log (multi-farm `removeItems`, real image route, failed cart replies).
- [ ] Minor: farm/product `layout.tsx` JSON-LD re-queries data the page already loaded
      (`lib/seo-data.ts` vs `lib/catalog.ts`); fine at this scale, could share one cached fetch.

---

### Env vars (new for Phase 2)
- `PAYMENT_PROVIDER=mock`
- `PAYMENT_MOCK_BASE_URL=https://api.mojkmet.eu`
- `PAYMENT_MOCK_SECRET=<shared API key from server config.php>`
- Webhook URL exposed to provider: `https://mojkmet.eu/api/webhooks/payments`

### Operational notes
- **Always `git pull` before starting work** — external tools (openclaw etc.) can push
  to GitHub directly, causing drift
- Vercel build uses `.npmrc` `legacy-peer-deps=true` (nodemailer 9 vs next-auth peer range)
- Local dev: `npm run dev`; production parity check: `npm run build`. **`npm run dev` currently
  runs against the production database** (see Next Steps) — treat every write as production.
- **Neon DB naming has drifted from reality before — always verify `DATABASE_URL` directly,
  don't trust cached names.** The production Neon project's *display name* has stayed
  `ep-little-dust-ag4wbjxz` since creation, but its actual compute endpoint hostname was
  regenerated to `ep-royal-recipe-ag8s29y6` at some point without any doc being updated —
  Vercel's own "Storage" tab integration panel still shows the stale `ep-little-dust` binding
  too. There is exactly one Neon project (`shiny-grass-90842747`), one branch
  (`br-autumn-paper-agu3k7bu`), one endpoint, one role (`neondb_owner`). If this is ever in
  doubt again: reveal `DATABASE_URL` directly in Vercel (Settings → Environment Variables),
  don't infer from the Storage tab or from old docs.
- **2026-09-28: `neondb_owner` password rotated** (previous rotation was 2026-08-20) after the
  value was pasted in a chat session for debugging. Rotated via Neon's API
  (`POST /projects/{id}/branches/{id}/roles/neondb_owner/reset_password`), `DATABASE_URL`
  updated in Vercel (all environments, marked Sensitive) via `vercel env update`, local
  `.env`/`.env.local` updated, production redeployed (`vercel --prod`). Verified live
  post-deploy: `/api/farms` on www.mojkmet.eu returns normal data.