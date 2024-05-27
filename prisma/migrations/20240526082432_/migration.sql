-- CreateTable
CREATE TABLE "Voucher" (
    "uuid" TEXT NOT NULL,
    "voucherName" TEXT NOT NULL,
    "voucherSymbol" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherSymbol_key" ON "Voucher"("voucherSymbol");
