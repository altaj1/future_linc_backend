/*
  Warnings:

  - You are about to drop the column `reating` on the `ClientSay` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClientSay" DROP COLUMN "reating",
ADD COLUMN     "rating" INTEGER DEFAULT 5;
