/*
  Warnings:

  - You are about to drop the column `image` on the `Faq` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicId` on the `Faq` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "image",
DROP COLUMN "imagePublicId";

-- CreateTable
CREATE TABLE "FaqSection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT,
    "image" TEXT,
    "imagePublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FaqSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSay" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "reating" INTEGER DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'active',
    "userId" UUID,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientSay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientSay" ADD CONSTRAINT "ClientSay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
