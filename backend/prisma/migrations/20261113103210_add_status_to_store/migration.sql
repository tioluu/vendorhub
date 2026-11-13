/*
  Warnings:

  - You are about to drop the column `published` on the `Store` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "published",
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "StoreStatus" NOT NULL DEFAULT 'DRAFT';
