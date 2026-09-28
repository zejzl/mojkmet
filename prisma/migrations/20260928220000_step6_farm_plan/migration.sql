-- Step 6: farm plan + free-first-year trial window
CREATE TYPE "FarmPlan" AS ENUM ('TRIAL', 'STANDARD', 'PREMIUM');
ALTER TABLE "farms" ADD COLUMN "plan" "FarmPlan" NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "farms" ADD COLUMN "trialEndsAt" TIMESTAMP(3);