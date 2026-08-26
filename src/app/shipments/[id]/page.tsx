import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getShipmentById } from "@/lib/shipments/detail";

interface ShipmentDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

function getStatusVariant(status: string) {
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

export default async function ShipmentDetailPage({
    params,
}: ShipmentDetailPageProps) {
    const { id } = await params;

    const shipment = await getShipmentById(id);

    if (!shipment) {
        return (
            <AppShell>
                <PageContainer>
                    <PageHeader
                        title="Shipment Not Found"
                        description="The requested shipment could not be found."
                        actions={
                            <Link href="/shipments">
                                <Button variant="outline">
                                    Back to Shipments
                                </Button>
                            </Link>
                        }
                    />
                </PageContainer>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title={shipment.trackingNumber}
                    description="Shipment details and tracking history."
                    actions={
                        <Link href="/shipments">
                            <Button variant="outline">
                                Back to Shipments
                            </Button>
                        </Link>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main information */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Shipment Information
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Tracking Number
                                        </p>

                                        <p className="mt-1 font-medium text-slate-900">
                                            {shipment.trackingNumber}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Status
                                        </p>

                                        <div className="mt-1">
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
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Customer
                                        </p>

                                        <p className="mt-1 font-medium text-slate-900">
                                            {shipment.customer.name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Payment Status
                                        </p>

                                        <p className="mt-1 font-medium text-slate-900">
                                            {shipment.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Route */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Delivery Route
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Origin
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-900">
                                            {shipment.originAddress}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Destination
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-slate-900">
                                            {shipment.destinationAddress}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Shipment Items
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                                <th className="px-6 py-3 font-medium">
                                                    Product
                                                </th>

                                                <th className="px-6 py-3 font-medium">
                                                    Quantity
                                                </th>

                                                <th className="px-6 py-3 font-medium">
                                                    Weight
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {shipment.items.map(
                                                (item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-b border-slate-100 last:border-0"
                                                    >
                                                        <td className="px-6 py-4 font-medium text-slate-900">
                                                            {
                                                                item.productName
                                                            }
                                                        </td>

                                                        <td className="px-6 py-4 text-slate-600">
                                                            {item.quantity}
                                                        </td>

                                                        <td className="px-6 py-4 text-slate-600">
                                                            {item.weight
                                                                ? `${item.weight} kg`
                                                                : "-"}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {shipment.items.length === 0 && (
                                    <div className="px-6 py-8 text-center text-sm text-slate-500">
                                        No shipment items.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Assignment
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Driver
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {shipment.driver?.name ??
                                            "Unassigned"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Vehicle
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {shipment.vehicle?.plateNumber ??
                                            "Unassigned"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Tracking History
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-5">
                                    {shipment.trackingEvents.map(
                                        (event) => (
                                            <div
                                                key={event.id}
                                                className="relative border-l border-slate-200 pl-4"
                                            >
                                                <div className="absolute -left-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600" />

                                                <p className="text-sm font-medium text-slate-900">
                                                    {event.status.replaceAll(
                                                        "_",
                                                        " ",
                                                    )}
                                                </p>

                                                {event.location && (
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        {event.location}
                                                    </p>
                                                )}

                                                {event.description && (
                                                    <p className="mt-1 text-xs text-slate-600">
                                                        {
                                                            event.description
                                                        }
                                                    </p>
                                                )}

                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {event.occurredAt.toLocaleString(
                                                        "en-US",
                                                        {
                                                            dateStyle:
                                                                "medium",
                                                            timeStyle:
                                                                "short",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        ),
                                    )}

                                    {shipment.trackingEvents
                                        .length === 0 && (
                                        <p className="text-sm text-slate-500">
                                            No tracking events.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageContainer>
        </AppShell>
    );
}
