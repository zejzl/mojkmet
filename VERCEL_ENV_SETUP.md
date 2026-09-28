# ⚠️ Vercel Environment Variables - REQUIRED

**For mojkmet.eu to work fully, you need these 6 environment variables**, plus optional
monitoring/rate-limiting variables described at the bottom.

## 1. Go to Vercel Dashboard
https://vercel.com/dashboard

## 2. Select mojkmet project

## 3. Go to Settings → Environment Variables

## 4. Add Required Environment Variables

### A. DATABASE_URL (Database Connection)

**Name:** `DATABASE_URL`

**Value:**
```
postgresql://neondb_owner:YOUR_NEON_PASSWORD@ep-royal-recipe-ag8s29y6-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**⚠️ SECURITY:** Replace `YOUR_NEON_PASSWORD` with your actual Neon database password from the Neon dashboard.

**Database Endpoint:** `ep-royal-recipe-ag8s29y6` — confirmed 2026-09-28 directly from Vercel's
`DATABASE_URL` env var, matched against live mojkmet.eu data. This doc previously named
`ep-little-dust-ag4wbjxz`, which is **not** the live database, though it's the same underlying
Neon project/role (same `neondb_owner` password on both) — the compute endpoint hostname was
regenerated at some point without this doc being updated. Vercel's own **Storage** tab still
shows a stale/orphaned binding labeled `ep-little-dust-ag4wbjxz` — that display name does not
reflect the actual `DATABASE_URL` env var and should not be trusted; always check the env var
value directly (Settings → Environment Variables → reveal `DATABASE_URL`) if this is ever in
doubt again.

**Environments:** All (Production, Preview, Development)

**Purpose:** Connects to Neon PostgreSQL database for farms, products, users

---

### B. NEXTAUTH_SECRET (Authentication)

**Name:** `NEXTAUTH_SECRET`

**Value:**
```
<generate with: openssl rand -base64 32>
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Secures NextAuth sessions and JWT tokens

**⚠️ Security Note:** Use a random string and never commit it! Generate with:
```bash
openssl rand -base64 32
```

---

### C. NEXTAUTH_URL (Authentication URLs)

**Name:** `NEXTAUTH_URL`

**Value for Production:**
```
https://mojkmet.eu
```

**Value for Preview/Development:**
```
https://mojkmet.eu
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Tells NextAuth what the site URL is for callbacks and redirects

---

### D. PAYMENT_PROVIDER (Payment provider name)

**Name:** `PAYMENT_PROVIDER`

**Value:**
```
mojkmet-mockpay
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Named provider the app speaks to. Must match the value the provider puts in the
`X-Payment-Provider` header / `provider` field of outgoing webhooks (both the local dev mock
and the deployed `api.mojkmet.eu` mock send `mojkmet-mockpay`).

---

### E. PAYMENT_MOCK_BASE_URL (Mock provider endpoint)

**Name:** `PAYMENT_MOCK_BASE_URL`

**Value for Production:**
```
https://api.mojkmet.eu
```

**Value for Preview/Development:**
```
https://api.mojkmet.eu
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Base URL for the mock payment provider. For local development use
`http://localhost:8787` with `scripts/dev-payment-mock.mjs` running (see README).

---

### F. PAYMENT_MOCK_SECRET (Shared webhook signing key)

**Name:** `PAYMENT_MOCK_SECRET`

**Value:**
```
<shared API key from /home/mojkmet/api.mojkmet.eu/config.php on the cPanel server>
```

**Environments:** All (Production, Preview, Development)

**Purpose:** Authenticates `POST /v1/payments/*` calls (X-API-Key header) and signs webhook
callbacks (`X-Payment-Signature: HMAC-SHA256(body, secret)`). The same value must exist on
both the server's `config.php` and here — a mismatch makes the webhook route return 401.

**⚠️ Security Note:** Never put this in a committed file. `.env.local` is gitignored.

---

## 5. Redeploy

After adding all 6 environment variables, go to **Deployments** and click **"Redeploy"** on the latest deployment.

---

## ✅ Verification Checklist

After deployment with all env vars:

- [ ] **Database:** Visit https://mojkmet.eu/api/farms → Should show farms list
- [ ] **Register:** Visit https://mojkmet.eu/register → Create test account → Should redirect to homepage
- [ ] **Login:** Visit https://mojkmet.eu/login → Login with test account → Should work
- [ ] **Homepage:** Visit https://mojkmet.eu → Should show "Kmetija Vidmar" in farms section
- [ ] **Payments:** Run a checkout → should redirect to the hosted `/pay/<ref>` page on
      `api.mojkmet.eu` → settle → order shows as PAID (blocked until the LiteSpeed vhost serves
      `api.mojkmet.eu` — see PLAN.md "Server infra & mock provider")

---

## 🚨 Without These Variables:

**Missing DATABASE_URL:**
- ❌ Homepage shows "Napaka pri nalaganju kmetij"
- ❌ /api/farms returns "Database not configured"

**Missing NEXTAUTH_SECRET:**
- ❌ Login/register pages crash
- ❌ NextAuth can't create sessions

**Missing NEXTAUTH_URL:**
- ❌ Login redirects fail
- ❌ OAuth callbacks break (if added later)

**Missing PAYMENT_PROVIDER / PAYMENT_MOCK_BASE_URL:**
- ❌ Order checkout fails to initiate payment (`order_not_found` / provider error path)

**Missing / mismatched PAYMENT_MOCK_SECRET:**
- ❌ Webhook route rejects callbacks with 401 `invalid_signature` → orders stay `AWAITING_PAYMENT`

---

## Optional: Rate limiting (Upstash Redis)

**Name:** `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`

**Purpose:** Without these, `lib/rate-limit.ts` falls back to an in-memory limiter that is
**per serverless instance** — on Vercel that means the limit isn't actually shared across
instances. Set both (from the Upstash Redis dashboard, REST API section) so rate limiting on
`register`/`forgot-password`/`reset-password`/`contact` works correctly at scale.

**Environments:** All (Production, Preview, Development)

## Optional: Error monitoring (Sentry)

**Name:** `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`

**Purpose:** Enables error reporting (`@sentry/nextjs`) for server/edge and client code
respectively. Without them the app runs identically, just unmonitored — see README "Monitoring".

**Name:** `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`

**Purpose:** Build-time only — lets `next build` upload source maps to Sentry so stack traces
resolve to real source. Not needed for runtime error capture to work.

**Environments:** All (Production, Preview, Development)

---

**Status:** ⏳ First 3 variables (DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL) are on Vercel.
The 3 `PAYMENT_*` variables still need to be added before the payment go-live (Step 3 PHASE-2 rollout).
The Upstash and Sentry variables are optional but recommended before Phase 2 goes fully live.
