-- CreateTable
CREATE TABLE "PlantTracking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "plantName" TEXT NOT NULL,
    "growthStage" TEXT NOT NULL DEFAULT 'SEEDLING',
    "healthStatus" TEXT NOT NULL DEFAULT 'HEALTHY',
    "notes" TEXT,
    "harvestDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantTracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlantTracking" ADD CONSTRAINT "PlantTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
