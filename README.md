# mojkmet.eu

Local food marketplace: farms sell directly to shoppers, with payment and pickup coordination.

- **Stack:** Next.js (App Router) + TypeScript, Prisma + Neon (PostgreSQL), NextAuth (credentials), Zod
- **Deployment:** Vercel (app) + cPanel box `api.mojkmet.eu` (mock payment provider)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` (gitignored) with at minimum:

   ```
   DATABASE_URL=postgresql://...            # Neon pooler connection string
   NEXTAUTH_SECRET=<openssl rand -base64 32>
   NEXTAUTH_URL=http://localhost:3000
   PAYMENT_PROVIDER=mojkmet-mockpay
   PAYMENT_MOCK_BASE_URL=http://localhost:8787
   PAYMENT_MOCK_SECRET=<shared key from server config.php>
   MOJKMET_EMAIL_SERVER=mail.mojkmet.eu      # SMTP server (transactional email)
   MOJKMET_SMTP_PORT=465
   MOJKMET_EMAIL_USER=info@mojkmet.eu
   MOJKMET_EMAIL_PASS=<SMTP password>
   ```

   Optional (see below for what each enables):

   ```
   UPSTASH_REDIS_REST_URL=<from Upstash Redis dashboard>
   UPSTASH_REDIS_REST_TOKEN=<from Upstash Redis dashboard>
   SENTRY_DSN=<server/edge DSN from Sentry project settings>
   NEXT_PUBLIC_SENTRY_DSN=<client DSN, same project>
   SENTRY_ORG=<sentry org slug>       # only needed to upload source maps on build
   SENTRY_PROJECT=<sentry project slug>
   SENTRY_AUTH_TOKEN=<sentry auth token>
   ```

3. Regenerate the Prisma client (schema changes):

   ```bash
   npx prisma generate
   ```

4. Payments need the local mock provider. In a second terminal:

   ```bash
   node scripts/dev-payment-mock.mjs
   # Mock payment provider on http://localhost:8787
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Payments

The app talks to a payment provider through the interface in `lib/payments/`. Currently the
implementation is a **mock provider** (`lib/payments/mock.ts`) running against the deployed
PHP endpoint on `api.mojkmet.eu`, or the local Node mock in `scripts/dev-payment-mock.mjs`
for development.

Flow: `POST /api/orders` initiates a payment and returns a `paymentUrl` → the checkout page
redirects the customer to the hosted `/pay/<ref>` page → on success the provider calls
`POST /api/webhooks/payments` (signed `X-Payment-Signature: HMAC-SHA256(body, secret)`,
provider in `X-Payment-Provider`) → the order moves to `PAID` (idempotent via `PaymentEvent`,
unique on `(provider, payment_ref)`). The result page is `/payment/result?order=<id>&ref=<ref>`.

Unpaid orders are swept lazily on read paths (`lib/payments/reconcile.ts`): expired
`AWAITING_PAYMENT` orders are cancelled and stock restored.

Swapping mock → real Račun123 later is a config change inside `lib/payments/`, not a rewrite.

## Email

Transactional email goes out via SMTP (`lib/mailer.ts` — nodemailer, env `MOJKMET_EMAIL_*`,
defaults `mail.mojkmet.eu` / 465 / `info@mojkmet.eu`). Templates live in `lib/order-mail.ts`
(order confirmation, payment confirmation to shopper, new-order notice to farmer) and
`lib/pickup-mail.ts` (pickup proposal / resolved), all rendered from the shared
`lib/email-layout.ts`. Sends are **best-effort**: a failed send is logged and never fails the
underlying order/webhook.

## Images

Product/farm images are uploaded through `ImageUploadInput` and validated server-side in
`lib/image-upload.ts`: magic-byte sniffing + structural dimension parsing (JPEG/PNG/WebP/GIF
only), canonicalization (strips trailing bytes after the real end-of-image marker, so polyglot
files are sanitized), a 1.5 MB size cap and a 16000px dimension cap, and a declared-MIME match
check. There is no file storage (S3, disk, CDN) — accepted images are re-encoded as a `data:`
URL and stored directly in the `image` column on `Product`/`Farm` in Postgres. External image
URLs are rejected; clearing the field (`''`) removes the image.

## Rate limiting

`lib/rate-limit.ts` guards `register`, `forgot-password`, `reset-password`, and `contact`.
It uses Upstash Redis (sliding window) when `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` are set, and otherwise falls back to an in-memory, per-instance
limiter (pruned, capped at 5000 buckets) — fine for a single dev server or a single Vercel
instance, but not correct across multiple serverless instances, which is why Upstash should be
configured in production. The client identity is `X-Forwarded-For`, which Vercel's edge sets
itself (overwriting any client-supplied value), falling back to `X-Real-IP`.

## Monitoring

Errors are reported to Sentry via `@sentry/nextjs` (`sentry.client.config.ts`,
`sentry.server.config.ts`, `sentry.edge.config.ts`, wired up in `instrumentation.ts` and
`next.config.ts` via `withSentryConfig`). Sentry only activates when its DSN env vars are set —
without them the app runs the same, just unmonitored. `lib/errors.ts`'s `getErrorMessage`,
the shared helper used by nearly every API route and client error handler, calls
`Sentry.captureException` before formatting the user-facing message, so anywhere in the app
that reports an error also reports it to Sentry. `SENTRY_ORG`/`SENTRY_PROJECT`/
`SENTRY_AUTH_TOKEN` are only needed to upload source maps during `next build`, not at runtime.

## Database

- Schema: `prisma/schema.prisma`
- Migrations are applied with `prisma db execute --file <migration>/migration.sql`
  (then `prisma migrate resolve --applied <folder>`), because the Neon setup has no shadow DB.

## Docs

- `PLAN.md` — phase-by-phase rollout plan and status (the living doc — check here first)
- `VERCEL_ENV_SETUP.md` — required environment variables for deployment
- `AGENTS.md` — conventions and architecture notes for AI coding agents working in this repo
- `AUTH_SETUP.md`, `AUTHENTICATION_SETUP.md`, `DATABASE_CONNECTION_COMPLETE.md`,
  `INTEGRATION_COMPLETE.md`, `LANDING_PAGE_UPDATES.md` — dated session logs from early
  development (Jan–Feb 2026), kept for history; superseded by `PLAN.md`