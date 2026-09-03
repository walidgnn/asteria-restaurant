-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservationReminders" BOOLEAN NOT NULL DEFAULT true;
