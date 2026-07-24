/*
  Warnings:

  - A unique constraint covering the columns `[storeId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Product_name_key";

-- DropIndex
DROP INDEX "Product_storeId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Product_storeId_name_key" ON "Product"("storeId", "name");
