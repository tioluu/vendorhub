/*
  Warnings:

  - You are about to drop the column `userId` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_userId_fkey";

-- DropIndex
DROP INDEX "Store_userId_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "userId",
ADD COLUMN     "vendorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Store_vendorId_key" ON "Store"("vendorId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
