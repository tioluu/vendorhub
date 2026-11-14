/*
  Warnings:

  - You are about to drop the column `published` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "published",
ADD COLUMN     "tatus" "ProductStatus" NOT NULL DEFAULT 'DRAFT';
