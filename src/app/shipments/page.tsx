import { AppShell } from "@/components/layout/app-shell";
import { Badge, Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getShipments } from "@/lib/shipments/queries";
import Link from "next/link";

import type {
    PaymentStatus,
    ShipmentStatus,
} from "@/generated/prisma/enums";

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

interface ShipmentsPageProps {
    searchParams: Promise<{
        search?: string;
        status?: string;
        payment?: string;
    }>;
}

export default async function ShipmentsPage({
    searchParams,
}: ShipmentsPageProps) {
    const params = await searchParams;

    const search = params.search?.trim();

    const status =
        params.status &&
            [
                "PENDING",
                "PICKED_UP",
                "IN_TRANSIT",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED",
            ].includes(params.status)
            ? (params.status as ShipmentStatus)
            : undefined;

    const paymentStatus =
        params.payment &&
            ["UNPAID", "PAID", "REFUNDED"].includes(
                params.payment,
            )
            ? (params.payment as PaymentStatus)
            : undefined;

    const shipments = await getShipments({
        search,
        status,
        paymentStatus,
    });

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

                <div className="mb-4">
                    <form
                        method="GET"
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={search}
                            placeholder="Search tracking number or customer..."
                            className="h-9 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                            name="status"
                            defaultValue={status ?? ""}
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PICKED_UP">Picked Up</option>
                            <option value="IN_TRANSIT">In Transit</option>
                            <option value="OUT_FOR_DELIVERY">
                                Out for Delivery
                            </option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>

                        <select
                            name="payment"
                            defaultValue={paymentStatus ?? ""}
                            className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">All Payments</option>
                            <option value="UNPAID">Unpaid</option>
                            <option value="PAID">Paid</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>

                        <Button type="submit">
                            Filter
                        </Button>
                    </form>
                </div>

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
                                                <Link
                                                    href={`/shipments/${shipment.id}`}
                                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    {shipment.trackingNumber}
                                                </Link>
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