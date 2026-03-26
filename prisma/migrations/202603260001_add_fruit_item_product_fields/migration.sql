CREATE TYPE "PackageType" AS ENUM ('BULK', 'PACKAGED');

ALTER TABLE "FruitItem"
  ADD COLUMN "brand" TEXT,
  ADD COLUMN "packageType" "PackageType" NOT NULL DEFAULT 'BULK',
  ADD COLUMN "variety" TEXT,
  ADD COLUMN "storageTemp" TEXT,
  ADD COLUMN "foodLicense" TEXT,
  ADD COLUMN "mainImage" TEXT,
  ADD COLUMN "detailImages" JSONB,
  ADD COLUMN "detailContent" TEXT,
  ADD COLUMN "unitSpec" TEXT,
  ADD COLUMN "netWeight" DECIMAL(12, 2),
  ADD COLUMN "price" DECIMAL(12, 2);

