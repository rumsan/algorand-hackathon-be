/*
  Warnings:

  - You are about to drop the column `uuid` on the `Beneficiary` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[walletAddress]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Beneficiary` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "uuid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_id_key" ON "Beneficiary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_walletAddress_key" ON "Beneficiary"("walletAddress");
