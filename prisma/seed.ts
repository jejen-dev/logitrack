import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");
  const passwordHash = await bcrypt.hash("demo-password", 12);

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.shipmentItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.user.updateMany({ data: { merchantId: null } });
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin LogiTrack",
      email: "admin@logitrack.dev",
      passwordHash,
      role: "ADMIN",
    },
  });
  const merchant = await prisma.merchant.create({
    data: { name: "LogiTrack Demo Merchant", ownerId: admin.id },
  });
  await prisma.user.update({ where: { id: admin.id }, data: { merchantId: merchant.id } });

  await prisma.user.create({
    data: {
      name: "Operations Manager",
      email: "manager@logitrack.dev",
      passwordHash,
      role: "MANAGER",
      merchantId: merchant.id,
    },
  });

  const operator = await prisma.user.create({
    data: {
      name: "Operations Operator",
      email: "operator@logitrack.dev",
      passwordHash,
      role: "OPERATOR",
      merchantId: merchant.id,
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: "Delivery Driver",
      email: "driver@logitrack.dev",
      passwordHash,
      role: "DRIVER",
      merchantId: merchant.id,
    },
  });

  // Customers
  const customerA = await prisma.customer.create({
    data: {
      name: "PT Nusantara Retail",
      merchantId: merchant.id,
      email: "contact@nusantararetail.co.id",
      phone: "021-555-0101",
      address: "Jl. Sudirman No. 10",
      city: "Jakarta",
      postalCode: "10220",
    },
  });

  const customerB = await prisma.customer.create({
    data: {
      name: "CV Mitra Distribusi",
      merchantId: merchant.id,
      email: "hello@mitradistribusi.co.id",
      phone: "021-555-0202",
      address: "Jl. Ahmad Yani No. 25",
      city: "Bekasi",
      postalCode: "17148",
    },
  });

  // Warehouses
  const warehouseA = await prisma.warehouse.create({
    data: {
      name: "Jakarta Central Warehouse",
      merchantId: merchant.id,
      code: "WH-JKT-01",
      address: "Jl. Raya Cakung No. 12",
      city: "Jakarta",
      postalCode: "13910",
    },
  });

  const warehouseB = await prisma.warehouse.create({
    data: {
      name: "Bekasi Distribution Center",
      merchantId: merchant.id,
      code: "WH-BKS-01",
      address: "Jl. Industri Raya No. 8",
      city: "Bekasi",
      postalCode: "17530",
    },
  });

  // Drivers
  const driverA = await prisma.driver.create({
    data: {
      name: "Andi Pratama",
      merchantId: merchant.id,
      email: "driver@logitrack.dev",
      phone: "0812-1000-2001",
      licenseNo: "SIM-A-10001",
      status: "ON_DELIVERY",
    },
  });

  const driverB = await prisma.driver.create({
    data: {
      name: "Budi Santoso",
      merchantId: merchant.id,
      phone: "0812-1000-2002",
      licenseNo: "SIM-A-10002",
      status: "AVAILABLE",
    },
  });

  // Vehicles
  const vehicleA = await prisma.vehicle.create({
    data: {
      plateNumber: "B 1234 LGT",
      merchantId: merchant.id,
      type: "Box Truck",
      capacity: 1200,
      status: "IN_USE",
    },
  });

  const vehicleB = await prisma.vehicle.create({
    data: {
      plateNumber: "B 5678 LGT",
      merchantId: merchant.id,
      type: "Van",
      capacity: 600,
      status: "AVAILABLE",
    },
  });

  // Inventory
  await prisma.inventoryItem.createMany({
    data: [
      {
        sku: "SKU-001",
        merchantId: merchant.id,
        name: "Electronic Components",
        quantity: 240,
        reorderPoint: 50,
        warehouseId: warehouseA.id,
      },
      {
        sku: "SKU-002",
        merchantId: merchant.id,
        name: "Packaging Box Large",
        quantity: 850,
        reorderPoint: 200,
        warehouseId: warehouseA.id,
      },
      {
        sku: "SKU-003",
        merchantId: merchant.id,
        name: "Packaging Box Medium",
        quantity: 120,
        reorderPoint: 150,
        warehouseId: warehouseB.id,
      },
      {
        sku: "SKU-004",
        merchantId: merchant.id,
        name: "Industrial Parts",
        quantity: 320,
        reorderPoint: 75,
        warehouseId: warehouseB.id,
      },
    ],
  });

  // Shipment 1
  const shipmentA = await prisma.shipment.create({
    data: {
      trackingNumber: "LGT-2026-0001",
      merchantId: merchant.id,
      status: "IN_TRANSIT",
      paymentStatus: "PAID",
      customerId: customerA.id,
      driverId: driverA.id,
      vehicleId: vehicleA.id,
      originAddress: "Jakarta Central Warehouse",
      destinationAddress: "Bekasi Distribution Center",
      shippedAt: new Date("2026-08-20T08:30:00"),
      items: {
        create: [
          {
            merchantId: merchant.id,
            productName: "Electronic Components",
            quantity: 40,
            weight: 180,
          },
          {
            merchantId: merchant.id,
            productName: "Packaging Box Large",
            quantity: 100,
            weight: 75,
          },
        ],
      },
    },
  });

  // Shipment 2
  const shipmentB = await prisma.shipment.create({
    data: {
      trackingNumber: "LGT-2026-0002",
      merchantId: merchant.id,
      status: "OUT_FOR_DELIVERY",
      paymentStatus: "PAID",
      customerId: customerB.id,
      driverId: driverB.id,
      vehicleId: vehicleB.id,
      originAddress: "Bekasi Distribution Center",
      destinationAddress: "Jl. Ahmad Yani No. 25, Bekasi",
      shippedAt: new Date("2026-08-21T07:00:00"),
      items: {
        create: [
          {
            merchantId: merchant.id,
            productName: "Industrial Parts",
            quantity: 20,
            weight: 95,
          },
        ],
      },
    },
  });

  // Shipment 3
  const shipmentC = await prisma.shipment.create({
    data: {
      trackingNumber: "LGT-2026-0003",
      merchantId: merchant.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      customerId: customerA.id,
      originAddress: "Jakarta Central Warehouse",
      destinationAddress: "Jl. Sudirman No. 10, Jakarta",
      shippedAt: new Date("2026-08-18T09:00:00"),
      deliveredAt: new Date("2026-08-19T15:30:00"),
      items: {
        create: [
          {
            merchantId: merchant.id,
            productName: "Packaging Box Medium",
            quantity: 50,
            weight: 30,
          },
        ],
      },
    },
  });

  // Tracking events
  await prisma.trackingEvent.createMany({
    data: [
      {
        shipmentId: shipmentA.id,
        merchantId: merchant.id,
        status: "PICKED_UP",
        location: "Jakarta Central Warehouse",
        description: "Shipment picked up from warehouse",
        occurredAt: new Date("2026-08-20T08:30:00"),
      },
      {
        shipmentId: shipmentA.id,
        merchantId: merchant.id,
        status: "IN_TRANSIT",
        location: "Jakarta - Bekasi Highway",
        description: "Shipment is currently in transit",
        occurredAt: new Date("2026-08-20T10:15:00"),
      },
      {
        shipmentId: shipmentB.id,
        merchantId: merchant.id,
        status: "PICKED_UP",
        location: "Bekasi Distribution Center",
        description: "Shipment picked up by driver",
        occurredAt: new Date("2026-08-21T07:00:00"),
      },
      {
        shipmentId: shipmentB.id,
        merchantId: merchant.id,
        status: "OUT_FOR_DELIVERY",
        location: "Bekasi",
        description: "Shipment is out for delivery",
        occurredAt: new Date("2026-08-21T08:30:00"),
      },
      {
        shipmentId: shipmentC.id,
        merchantId: merchant.id,
        status: "DELIVERED",
        location: "Jakarta",
        description: "Shipment successfully delivered",
        occurredAt: new Date("2026-08-19T15:30:00"),
      },
    ],
  });

  console.log("✅ Database seed completed.");
  console.log(`Admin: ${admin.email}`);
  console.log(`Shipments created: 3`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
