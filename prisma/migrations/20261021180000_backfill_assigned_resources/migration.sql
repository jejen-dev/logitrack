UPDATE "Driver"
SET "status" = 'ON_DELIVERY'
WHERE "status" = 'AVAILABLE'
  AND "id" IN (
    SELECT DISTINCT "driverId"
    FROM "Shipment"
    WHERE "status" IN ('PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY')
      AND "driverId" IS NOT NULL
  );

UPDATE "Vehicle"
SET "status" = 'IN_USE'
WHERE "status" = 'AVAILABLE'
  AND "id" IN (
    SELECT DISTINCT "vehicleId"
    FROM "Shipment"
    WHERE "status" IN ('PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY')
      AND "vehicleId" IS NOT NULL
  );

UPDATE "Driver"
SET "status" = 'ASSIGNED'
WHERE "status" = 'AVAILABLE'
  AND "id" IN (
    SELECT DISTINCT "driverId"
    FROM "Shipment"
    WHERE "status" = 'PENDING' AND "driverId" IS NOT NULL
  );

UPDATE "Vehicle"
SET "status" = 'RESERVED'
WHERE "status" = 'AVAILABLE'
  AND "id" IN (
    SELECT DISTINCT "vehicleId"
    FROM "Shipment"
    WHERE "status" = 'PENDING' AND "vehicleId" IS NOT NULL
  );
