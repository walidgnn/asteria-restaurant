-- AlterTable
ALTER TABLE "dining_tables" ADD COLUMN     "currentPartySize" INTEGER,
ADD COLUMN     "seatedAt" TIMESTAMP(3),
ADD COLUMN     "unavailableReason" TEXT;
