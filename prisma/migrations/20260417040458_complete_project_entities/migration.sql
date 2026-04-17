/*
  Warnings:

  - The primary key for the `CommunityPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CommunityPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Produce` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Produce` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RentalSpace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RentalSpace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `SustainabilityCert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SustainabilityCert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VendorProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VendorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `CommunityPost` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `produceId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendorId` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendorId` on the `Produce` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendorId` on the `RentalSpace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `vendorId` on the `SustainabilityCert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `VendorProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_produceId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "Produce" DROP CONSTRAINT "Produce_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "RentalSpace" DROP CONSTRAINT "RentalSpace_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "SustainabilityCert" DROP CONSTRAINT "SustainabilityCert_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_userId_fkey";

-- AlterTable
ALTER TABLE "CommunityPost" DROP CONSTRAINT "CommunityPost_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
DROP COLUMN "produceId",
ADD COLUMN     "produceId" INTEGER NOT NULL,
DROP COLUMN "vendorId",
ADD COLUMN     "vendorId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending',
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Produce" DROP CONSTRAINT "Produce_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendorId",
ADD COLUMN     "vendorId" INTEGER NOT NULL,
ALTER COLUMN "certificationStatus" DROP DEFAULT,
ADD CONSTRAINT "Produce_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RentalSpace" DROP CONSTRAINT "RentalSpace_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendorId",
ADD COLUMN     "vendorId" INTEGER NOT NULL,
ADD CONSTRAINT "RentalSpace_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SustainabilityCert" DROP CONSTRAINT "SustainabilityCert_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "vendorId",
ADD COLUMN     "vendorId" INTEGER NOT NULL,
ALTER COLUMN "certificationDate" DROP DEFAULT,
ADD CONSTRAINT "SustainabilityCert_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VendorProfile" DROP CONSTRAINT "VendorProfile_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "certificationStatus" SET DEFAULT 'pending',
ADD CONSTRAINT "VendorProfile_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProfile_userId_key" ON "VendorProfile"("userId");

-- AddForeignKey
ALTER TABLE "VendorProfile" ADD CONSTRAINT "VendorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
