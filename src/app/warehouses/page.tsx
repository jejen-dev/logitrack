import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getWarehouses } from "@/lib/warehouses/queries";
import { WarehouseManagement } from "./warehouse-management";

export default async function WarehousesPage() {
    const warehouses = await getWarehouses();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Warehouses"
                    description="Manage warehouse locations and inventory capacity."
                />
                <WarehouseManagement warehouses={warehouses} />
            </PageContainer>
        </AppShell>
    );
}
