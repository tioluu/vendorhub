-- DropIndex
DROP INDEX "Cart_storeId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Store" ALTER COLUMN "bannerUrl" SET DEFAULT '';
