ALTER TABLE "InventoryItem"
ADD COLUMN "reservedQuantity" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "InventoryItem"
ADD CONSTRAINT "InventoryItem_reservedQuantity_check"
CHECK ("reservedQuantity" >= 0 AND "reservedQuantity" <= "quantity");

ALTER TABLE "ShipmentItem"
ADD COLUMN "inventoryItemId" TEXT;

CREATE INDEX "ShipmentItem_inventoryItemId_idx"
ON "ShipmentItem"("inventoryItemId");

ALTER TABLE "ShipmentItem"
ADD CONSTRAINT "ShipmentItem_inventoryItemId_fkey"
FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "TrackingEvent_shipmentId_occurredAt_idx"
ON "TrackingEvent"("shipmentId", "occurredAt");

CREATE INDEX "TrackingEvent_occurredAt_idx"
ON "TrackingEvent"("occurredAt");
