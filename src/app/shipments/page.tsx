import { AppShell } from "@/components/layout/app-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { Badge, Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getShipments } from "@/lib/shipments/queries";
import { getShipmentFormData } from "@/lib/shipments/form-data";
import { ShipmentCreateDialog } from "./shipment-create-dialog";
import Link from "next/link";

import type {
    PaymentStatus,
    ShipmentStatus,
} from "@/generated/prisma/enums";
import { LocalizedText , LocalizedInput} from "@/components/locale-provider";

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

    const session = await getServerSession(authOptions);
    const canCreateShipment = ["ADMIN", "MANAGER", "OPERATOR"].includes(session?.user?.role ?? "");
    const [shipments, formData] = await Promise.all([
        getShipments({ search, status, paymentStatus }),
        canCreateShipment ? getShipmentFormData() : Promise.resolve(null),
    ]);

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Shipments"
                    description="Manage and monitor all shipments."
                    actions={formData ? <ShipmentCreateDialog {...formData} /> : undefined}
                />

                <div className="mb-4">
                    <form
                        method="GET"
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 md:flex-row"
                    >
                        <LocalizedInput
                            type="search"
                            name="search"
                            defaultValue={search}
                            placeholder="Search tracking number or customer..."
                            className="h-10 min-h-10 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                            name="status"
                            defaultValue={status ?? ""}
                            className="h-10 min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value=""><LocalizedText text={"All Status"} /></option>
                            <option value="PENDING"><LocalizedText text={"Pending"} /></option>
                            <option value="PICKED_UP"><LocalizedText text={"Picked Up"} /></option>
                            <option value="IN_TRANSIT"><LocalizedText text={"In Transit"} /></option>
                            <option value="OUT_FOR_DELIVERY">
                                <LocalizedText text={"\n                                Out for Delivery\n                            "} /></option>
                            <option value="DELIVERED"><LocalizedText text={"Delivered"} /></option>
                            <option value="CANCELLED"><LocalizedText text={"Cancelled"} /></option>
                        </select>

                        <select
                            name="payment"
                            defaultValue={paymentStatus ?? ""}
                            className="h-10 min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value=""><LocalizedText text={"All Payments"} /></option>
                            <option value="UNPAID"><LocalizedText text={"Unpaid"} /></option>
                            <option value="PAID"><LocalizedText text={"Paid"} /></option>
                            <option value="REFUNDED"><LocalizedText text={"Refunded"} /></option>
                        </select>

                        <Button type="submit">
                            <LocalizedText text={"\n                            Filter\n                        "} /></Button>
                    </form>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Tracking Number\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Customer\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Route\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Driver\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Vehicle\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Status\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Payment\n                                        "} /></th>

                                        <th className="px-6 py-3 font-medium">
                                            <LocalizedText text={"\n                                            Created\n                                        "} /></th>
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
                                                    <LocalizedText text={"\n                                                    ↓"} />{" "}
                                                    {
                                                        shipment.destinationAddress
                                                    }
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {shipment.driver?.name ??
                                                    "Unassigned"}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {shipment.vehicle?.plateNumber ?? "Unassigned"}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Badge
                                                    variant={getStatusVariant(
                                                        shipment.status,
                                                    )}
                                                >
                                                    <LocalizedText text={shipment.status.replaceAll(
                                                        "_",
                                                        " ",
                                                    )} />
                                                </Badge>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600">
                                                    {
                                                        <LocalizedText text={shipment.paymentStatus} />
                                                    }
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                                {shipment.createdAt.toLocaleDateString("en-ID")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {shipments.length === 0 && (
                            <div className="px-6 py-12 text-center text-sm text-slate-500">
                                <LocalizedText text={"\n                                No shipments found.\n                            "} /></div>
                        )}
                    </CardContent>
                </Card>
            </PageContainer>
        </AppShell>
    );
}
