CREATE TYPE "DriverLicenseType" AS ENUM ('A', 'B1', 'B2', 'C', 'C1', 'C2', 'D', 'DI');

ALTER TABLE "Driver"
ADD COLUMN "licenseType" "DriverLicenseType" NOT NULL DEFAULT 'A';
