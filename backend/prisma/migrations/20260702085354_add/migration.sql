-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;
