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
                    description="Kelola data driver, status aktif, dan ketersediaan mereka."
                />
                <DriverManagement drivers={drivers} />
            </PageContainer>
        </AppShell>
    );
}
