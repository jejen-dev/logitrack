import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getInventoryItems, getInventoryWarehouses } from "@/lib/inventory/queries";
import { InventoryManagement } from "./inventory-management";

interface InventoryPageProps {
    searchParams: Promise<{
        search?: string;
        warehouseId?: string;
        stockStatus?: string;
    }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
    const params = await searchParams;
    const search = params.search ?? "";
    const warehouseId = params.warehouseId ?? "";
    const stockStatus = params.stockStatus === "LOW_STOCK" || params.stockStatus === "IN_STOCK"
        ? params.stockStatus
        : "ALL";

    const [items, warehouses] = await Promise.all([
        getInventoryItems({ search, warehouseId, stockStatus }),
        getInventoryWarehouses(),
    ]);

    return (
        <AppShell>
            <PageContainer>
                <PageHeader title="Inventory" description="Monitor stock levels across your warehouses." />
                <InventoryManagement items={items} warehouses={warehouses} />
            </PageContainer>
        </AppShell>
    );
}
