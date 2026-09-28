-- Pre-Phase 2 test orders cannot be migrated (legacy statuses, no farmId, delivery fields
-- being dropped). Clear them before applying the new NOT NULL columns and enum casts.
DELETE FROM "order_items";
DELETE FROM "orders";

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PickupChangeRequestedBy" AS ENUM ('FARMER', 'CONSUMER');

-- CreateEnum
CREATE TYPE "PickupChangeStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('AWAITING_PAYMENT', 'PAID', 'ACCEPTED', 'READY', 'COLLECTED', 'COMPLETED', 'CANCELLED', 'REFUNDED');
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryCity",
DROP COLUMN "deliveryPostal",
DROP COLUMN "totalAmount",
ADD COLUMN     "farmId" TEXT NOT NULL,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "invoicePdfUrl" TEXT,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentProvider" TEXT,
ADD COLUMN     "paymentRef" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "payoutAmount" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "pickupEndsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pickupStartsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "platformFee" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "reservedUntil" TIMESTAMP(3),
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';

-- CreateTable
CREATE TABLE "pickup_windows" (
    "id" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pickup_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pickup_changes" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "requestedBy" "PickupChangeRequestedBy" NOT NULL,
    "currentStart" TIMESTAMP(3) NOT NULL,
    "currentEnd" TIMESTAMP(3) NOT NULL,
    "proposedStart" TIMESTAMP(3) NOT NULL,
    "proposedEnd" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "PickupChangeStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "pickup_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pickup_windows_farmId_idx" ON "pickup_windows"("farmId");

-- CreateIndex
CREATE INDEX "pickup_changes_orderId_idx" ON "pickup_changes"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "pickup_changes_orderId_status_key" ON "pickup_changes"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "payment_events_provider_externalId_key" ON "payment_events"("provider", "externalId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_farmId_idx" ON "orders"("farmId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_windows" ADD CONSTRAINT "pickup_windows_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_changes" ADD CONSTRAINT "pickup_changes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
