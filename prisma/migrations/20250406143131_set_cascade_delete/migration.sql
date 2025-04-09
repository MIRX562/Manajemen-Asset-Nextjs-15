/*
  Warnings:

  - You are about to drop the column `lifecycle_stage` on the `assets` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TargetType" ADD VALUE 'ASSET_TYPE';
ALTER TYPE "TargetType" ADD VALUE 'LOCATION';
ALTER TYPE "TargetType" ADD VALUE 'CHECKOUT';
ALTER TYPE "TargetType" ADD VALUE 'EMPLOYEE';
ALTER TYPE "TargetType" ADD VALUE 'USER';

-- DropForeignKey
ALTER TABLE "asset_lifecycles" DROP CONSTRAINT "asset_lifecycles_asset_id_fkey";

-- AlterTable
ALTER TABLE "assets" DROP COLUMN "lifecycle_stage";

-- AddForeignKey
ALTER TABLE "asset_lifecycles" ADD CONSTRAINT "asset_lifecycles_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
