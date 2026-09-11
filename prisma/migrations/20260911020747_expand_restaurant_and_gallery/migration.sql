-- AlterTable
ALTER TABLE "gallery_images" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "section" TEXT NOT NULL DEFAULT 'gallery',
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "country" TEXT,
ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "heroTagline" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "isOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locationNotes" TEXT,
ADD COLUMN     "orderingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pickupEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "pinterestUrl" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "reservationsEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "storyText" TEXT,
ADD COLUMN     "storyTitle" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "website" TEXT;
