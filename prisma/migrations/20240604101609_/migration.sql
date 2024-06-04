/*
  Warnings:

  - A unique constraint covering the columns `[walletAddress]` on the table `Beneficiary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_walletAddress_key" ON "Beneficiary"("walletAddress");
