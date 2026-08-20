# mojkmet.eu — Project Plan & Status

> Sveže od kmeta, neposredno k vam.
> Farm-to-consumer marketplace for Slovenia. Last updated: **August 21, 2026**

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
| Analytics | Plausible |
| Hosting | Vercel (env vars: DATABASE_URL, NEXTAUTH_SECRET/URL, MOJKMET_EMAIL_*) |

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

## Next Steps (Prioritized)

### P0 — Before real users
- [ ] Strict CSP with nonces (middleware-based; current headers are a first pass)
- [ ] Rate limiting that survives serverless scale-out (Upstash Redis) if abuse appears
- [ ] Error monitoring (Sentry free tier) — would have caught the Feb login scare immediately
- [ ] CI: GitHub Action running lint + build on every push

### P1 — Complete the purchase loop
- [ ] Payments — **direction undecided**: Stripe feels too early; evaluate alternatives
      when ready (e.g., Stripe Checkout lightweight, PayPal, direct bank transfer /
      povzetek plačila as MVP). No integration until product-market fit is clearer.
- [ ] Order confirmation emails to buyer (mailer infrastructure already in place)
- [ ] Server-side cart sync for logged-in users (cart currently localStorage-only)

### P2 — Marketplace growth
- [ ] Reviews/ratings UI (DB table exists and feeds farm ratings already)
- [ ] Farmer onboarding polish (self-serve farm creation flow)
- [ ] Admin tooling (farm verification, moderation) — ADMIN role exists but unused

### P3 — Technical debt
- [ ] Migrate NextAuth v4 → Auth.js v5 (v4 is maintenance mode; also addresses
      remaining critical advisories affecting OAuth-style flows)
- [ ] Profile email change requires re-verification
- [ ] Tests: smoke tests for auth/order APIs minimum
- [ ] Delete retired `ep-divine-butterfly` Neon project entirely (creds already removed)

### Operational notes
- **Always `git pull` before starting work** — external tools (openclaw etc.) can push
  to GitHub directly, causing drift
- Vercel build uses `.npmrc` `legacy-peer-deps=true` (nodemailer 9 vs next-auth peer range)
- Local dev: `npm run dev`; production parity check: `npm run build`
