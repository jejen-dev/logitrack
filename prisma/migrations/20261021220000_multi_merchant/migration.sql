CREATE TABLE "Merchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MerchantInvitation" (
    "id" TEXT NOT NULL,
    "merchantId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MerchantInvitation_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "User" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Customer" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Warehouse" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Driver" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Vehicle" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Shipment" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "ShipmentItem" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "InventoryItem" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "TrackingEvent" ADD COLUMN "merchantId" TEXT;
ALTER TABLE "Notification" ADD COLUMN "merchantId" TEXT;

DO $$
DECLARE first_user_id TEXT;
BEGIN
  SELECT "id" INTO first_user_id FROM "User" ORDER BY "createdAt", "id" LIMIT 1;
  IF first_user_id IS NOT NULL THEN
    INSERT INTO "Merchant" ("id", "name", "ownerId", "updatedAt")
    VALUES ('legacy_merchant', 'Legacy merchant', first_user_id, CURRENT_TIMESTAMP);
    UPDATE "User" SET "role" = 'ADMIN' WHERE "id" = first_user_id;
    UPDATE "User" SET "merchantId" = 'legacy_merchant';
    UPDATE "Customer" SET "merchantId" = 'legacy_merchant';
    UPDATE "Warehouse" SET "merchantId" = 'legacy_merchant';
    UPDATE "Driver" SET "merchantId" = 'legacy_merchant';
    UPDATE "Vehicle" SET "merchantId" = 'legacy_merchant';
    UPDATE "Shipment" SET "merchantId" = 'legacy_merchant';
    UPDATE "ShipmentItem" SET "merchantId" = 'legacy_merchant';
    UPDATE "InventoryItem" SET "merchantId" = 'legacy_merchant';
    UPDATE "TrackingEvent" SET "merchantId" = 'legacy_merchant';
    UPDATE "Notification" SET "merchantId" = 'legacy_merchant';
  END IF;
END $$;

DROP INDEX "Warehouse_code_key";
DROP INDEX "Driver_email_key";
DROP INDEX "Driver_licenseNo_key";
DROP INDEX "Vehicle_plateNumber_key";
DROP INDEX "Shipment_trackingNumber_key";
DROP INDEX "InventoryItem_sku_key";

CREATE UNIQUE INDEX "Merchant_ownerId_key" ON "Merchant"("ownerId");
CREATE UNIQUE INDEX "MerchantInvitation_tokenHash_key" ON "MerchantInvitation"("tokenHash");
CREATE INDEX "MerchantInvitation_merchantId_email_idx" ON "MerchantInvitation"("merchantId", "email");
CREATE UNIQUE INDEX "Warehouse_merchantId_code_key" ON "Warehouse"("merchantId", "code");
CREATE UNIQUE INDEX "Driver_merchantId_email_key" ON "Driver"("merchantId", "email");
CREATE UNIQUE INDEX "Driver_merchantId_licenseNo_key" ON "Driver"("merchantId", "licenseNo");
CREATE UNIQUE INDEX "Vehicle_merchantId_plateNumber_key" ON "Vehicle"("merchantId", "plateNumber");
CREATE UNIQUE INDEX "Shipment_merchantId_trackingNumber_key" ON "Shipment"("merchantId", "trackingNumber");
CREATE UNIQUE INDEX "InventoryItem_merchantId_sku_key" ON "InventoryItem"("merchantId", "sku");

ALTER TABLE "User" ADD CONSTRAINT "User_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MerchantInvitation" ADD CONSTRAINT "MerchantInvitation_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrackingEvent" ADD CONSTRAINT "TrackingEvent_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Customer" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "Warehouse" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "Driver" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "Vehicle" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "Shipment" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "ShipmentItem" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "InventoryItem" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "TrackingEvent" ALTER COLUMN "merchantId" SET NOT NULL;
ALTER TABLE "Notification" ALTER COLUMN "merchantId" SET NOT NULL;
