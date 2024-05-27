/*
  Warnings:

  - A unique constraint covering the columns `[assetId]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "assetId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_assetId_key" ON "Voucher"("assetId");
