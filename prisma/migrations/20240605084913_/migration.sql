-- CreateEnum
CREATE TYPE "GENDER" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "Beneficiary" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "GENDER" NOT NULL,
    "walletAddress" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Project" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "voucherId" INTEGER,
    "adminAddress" TEXT[],
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "vendorId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "collectedAsa" INTEGER DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "uuid" TEXT NOT NULL,
    "voucherName" TEXT NOT NULL,
    "voucherSymbol" TEXT NOT NULL,
    "assetId" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Msig" (
    "uuid" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Msig_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_BeneficiaryProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_uuid_key" ON "Beneficiary"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_email_key" ON "Beneficiary"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_uuid_key" ON "Project"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_voucherId_key" ON "Project"("voucherId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_vendorId_key" ON "Project"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_uuid_key" ON "Vendor"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_email_key" ON "Vendor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_projectId_key" ON "Vendor"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_uuid_key" ON "Voucher"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_voucherSymbol_key" ON "Voucher"("voucherSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_assetId_key" ON "Voucher"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Msig_uuid_key" ON "Msig"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Msig_projectId_key" ON "Msig"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryProjects_AB_unique" ON "_BeneficiaryProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryProjects_B_index" ON "_BeneficiaryProjects"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "Voucher"("assetId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
