-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true;
