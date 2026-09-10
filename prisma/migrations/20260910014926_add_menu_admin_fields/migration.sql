-- AlterTable
ALTER TABLE "customization_groups" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxSelections" INTEGER;

-- AlterTable
ALTER TABLE "customization_options" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "dishes" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
