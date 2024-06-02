/*
  Warnings:

  - You are about to drop the column `tokenName` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `tokenSymbol` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voucherId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assetId]` on the table `Voucher` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Project_tokenSymbol_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tokenName",
DROP COLUMN "tokenSymbol",
ADD COLUMN     "voucherId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Project_voucherId_key" ON "Project"("voucherId");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_assetId_key" ON "Voucher"("assetId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("assetId") ON DELETE SET NULL ON UPDATE CASCADE;
