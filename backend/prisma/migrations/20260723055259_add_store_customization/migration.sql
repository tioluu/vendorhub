-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "backgroundColor" TEXT DEFAULT '#FFFFFF',
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "fontFamily" TEXT DEFAULT 'Inter',
ADD COLUMN     "foregroundColor" TEXT DEFAULT '#000000';
