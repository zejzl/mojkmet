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

## Database

- Schema: `prisma/schema.prisma`
- Migrations are applied with `prisma db execute --file <migration>/migration.sql`
  (then `prisma migrate resolve --applied <folder>`), because the Neon setup has no shadow DB.

## Docs

- `PLAN.md` — phase-by-phase rollout plan and status
- `VERCEL_ENV_SETUP.md` — required environment variables for deployment