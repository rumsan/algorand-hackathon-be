/*
  Warnings:

  - The `assetId` column on the `Voucher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Voucher_assetId_key";

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "assetId",
ADD COLUMN     "assetId" INTEGER NOT NULL DEFAULT 0;
