/*
  Warnings:

  - You are about to drop the column `value` on the `assets` table. All the data in the column will be lost.
  - Added the required column `initial_value` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salvage_value` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useful_life` to the `assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assets" DROP COLUMN "value",
ADD COLUMN     "initial_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "salvage_value" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "useful_life" INTEGER NOT NULL;
