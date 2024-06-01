-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
