import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const authPrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = authPrisma;
}

const tenantModels = new Set([
  "User", "Customer", "Warehouse", "Driver", "Vehicle", "Shipment",
  "ShipmentItem", "InventoryItem", "TrackingEvent", "Notification",
]);

function stampNestedCreates(value: unknown, merchantId: string): unknown {
  if (Array.isArray(value)) return value.map((entry) => stampNestedCreates(entry, merchantId));
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(record)) {
    if (["create", "createMany"].includes(key)) {
      const stamp = (item: unknown) => item && typeof item === "object" && !Array.isArray(item)
        ? { ...(item as Record<string, unknown>), merchantId }
        : item;
      result[key] = Array.isArray(entry) ? entry.map(stamp) : stamp(entry);
    } else {
      result[key] = stampNestedCreates(entry, merchantId);
    }
  }
  return result;
}

function stampRootCreate(value: unknown, merchantId: string): unknown {
  const stamp = (record: unknown) => record && typeof record === "object" && !Array.isArray(record)
    ? stampNestedCreates({ ...(record as Record<string, unknown>), merchantId }, merchantId)
    : record;
  return Array.isArray(value) ? value.map(stamp) : stamp(value);
}

export const prisma = authPrisma.$extends({
  name: "merchant-tenant-isolation",
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!model || !tenantModels.has(model)) return query(args);
        const [{ getServerSession }, { authOptions }] = await Promise.all([
          import("next-auth"),
          import("@/lib/auth/auth-options"),
        ]);
        const session = await getServerSession(authOptions);
        const merchantId = session?.user?.merchantId;
        if (!merchantId) throw new Error("Merchant membership required.");

        const input = args as Record<string, any>;
        if (["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany", "count", "aggregate", "groupBy", "update", "updateMany", "delete", "deleteMany"].includes(operation)) {
          input.where = { ...(input.where ?? {}), merchantId };
        }
        if (["create", "createMany"].includes(operation)) {
          input.data = stampRootCreate(input.data, merchantId);
        }
        if (operation === "upsert") {
          input.where = { ...(input.where ?? {}), merchantId };
          input.create = stampRootCreate(input.create, merchantId);
        }
        return query(input as never);
      },
    },
  },
});
