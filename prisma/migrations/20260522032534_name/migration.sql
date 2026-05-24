/*
  Warnings:

  - Added the required column `countryId` to the `UniversityPartner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UniversityPartner" ADD COLUMN     "countryId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "UniversityPartner" ADD CONSTRAINT "UniversityPartner_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
