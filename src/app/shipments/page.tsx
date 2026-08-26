import { AppShell } from "@/components/layout/app-shell";
import { Badge, Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getShipments } from "@/lib/shipments/queries";

function getStatusVariant(
    status: string,
) {
    switch (status) {
        case "DELIVERED":
            return "success";

        case "IN_TRANSIT":
            return "info";

        case "OUT_FOR_DELIVERY":
            return "warning";

        case "CANCELLED":
            return "danger";

        default:
            return "default";
    }
}

export default async function ShipmentsPage() {
    const shipments = await getShipments();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Shipments"
                    description="Manage and monitor all shipments."
                    actions={
                        <Button>
                            Create Shipment
                        </Button>
                    }
                />

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                        <th className="px-6 py-3 font-medium">
                                            Tracking Number
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Customer
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Route
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Driver
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Payment
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {shipments.map((shipment) => (
                                        <tr
                                            key={shipment.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                                                {shipment.trackingNumber}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {shipment.customer.name}
                                            </td>

                                            <td className="min-w-64 px-6 py-4">
                                                <div className="text-xs text-slate-700">
                                                    {shipment.originAddress}
                                                </div>

                                                <div className="mt-1 text-xs text-slate-400">
                                                    ↓{" "}
                                                    {
                                                        shipment.destinationAddress
                                                    }
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {shipment.driver?.name ??
                                                    "Unassigned"}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge
                                                    variant={getStatusVariant(
                                                        shipment.status,
                                                    )}
                                                >
                                                    {shipment.status.replaceAll(
                                                        "_",
                                                        " ",
                                                    )}
                                                </Badge>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600">
                                                    {
                                                        shipment.paymentStatus
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {shipments.length === 0 && (
                            <div className="px-6 py-12 text-center text-sm text-slate-500">
                                No shipments found.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </PageContainer>
        </AppShell>
    );
}