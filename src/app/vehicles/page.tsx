import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getVehicles } from "@/lib/vehicles/queries";
import { VehicleManagement } from "./vehicle-management";

export default async function VehiclesPage() {
    const vehicles = await getVehicles();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Vehicles"
                    description="Manage fleet vehicles and monitor their status."
                />
                <VehicleManagement vehicles={vehicles} />
            </PageContainer>
        </AppShell>
    );
}
