-- CreateTable
CREATE TABLE "Beneficiary" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "walletAddress" TEXT,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Project" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "adminAddress" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_BeneficiaryProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Beneficiary_email_key" ON "Beneficiary"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_tokenSymbol_key" ON "Project"("tokenSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "_BeneficiaryProjects_AB_unique" ON "_BeneficiaryProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_BeneficiaryProjects_B_index" ON "_BeneficiaryProjects"("B");

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Beneficiary"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BeneficiaryProjects" ADD CONSTRAINT "_BeneficiaryProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
