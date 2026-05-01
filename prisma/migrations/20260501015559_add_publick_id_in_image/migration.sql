/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "image" TEXT,
ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "UniversityPartner" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imagePublicId" TEXT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Product";
