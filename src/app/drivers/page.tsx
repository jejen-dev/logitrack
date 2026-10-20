import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getDrivers } from "@/lib/drivers/queries";
import { DriverManagement } from "./driver-management";

export default async function DriversPage() {
    const drivers = await getDrivers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Drivers"
                    description="Manage driver records, active status, and availability."
                />
                <DriverManagement drivers={drivers} />
            </PageContainer>
        </AppShell>
    );
}
