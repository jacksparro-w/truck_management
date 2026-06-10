-- DropIndex
DROP INDEX "User_mobile_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;
