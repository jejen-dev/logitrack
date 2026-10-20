import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

import { getShipmentFormData } from "@/lib/shipments/form-data";
import { ShipmentForm } from "./shipment-form";

export default async function NewShipmentPage() {
    const {
        customers,
        drivers,
        vehicles,
        inventoryItems,
    } = await getShipmentFormData();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Create Shipment"
                    description="Create a new shipment and assign its delivery resources."
                />

                <ShipmentForm
                    customers={customers}
                    drivers={drivers}
                    vehicles={vehicles}
                    inventoryItems={inventoryItems}
                />
            </PageContainer>
        </AppShell>
    );
}
