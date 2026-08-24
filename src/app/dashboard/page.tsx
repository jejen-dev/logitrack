import { AppShell } from "@/components/layout/app-shell";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import {
    getDashboardStats,
    getRecentShipments,
    getShipmentStatusOverview,
} from "@/lib/dashboard/queries";

export default async function DashboardPage() {
    const [stats, recentShipments, statusOverview] =
        await Promise.all([
            getDashboardStats(),
            getRecentShipments(),
            getShipmentStatusOverview(),
        ]);

    const cards = [
        {
            title: "Total Shipments",
            value: stats.totalShipments,
            description: "All shipments",
        },
        {
            title: "Pending",
            value: stats.pendingShipments,
            description: "Waiting to be processed",
        },
        {
            title: "In Transit",
            value: stats.inTransitShipments,
            description: "Currently in transit",
        },
        {
            title: "Delivered",
            value: stats.deliveredShipments,
            description: "Successfully delivered",
        },
    ];

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Dashboard"
                    description="Monitor your logistics operations from one place."
                />

                {/* KPI Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">
                                    {card.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight text-slate-900">
                                    {card.value}
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Shipment Status Overview */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Shipment Status
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                {statusOverview.map((status) => {
                                    const percentage =
                                        stats.totalShipments > 0
                                            ? (status.value /
                                                stats.totalShipments) *
                                            100
                                            : 0;

                                    return (
                                        <div key={status.label}>
                                            <div className="mb-1.5 flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-700">
                                                    {status.label}
                                                </span>

                                                <span className="text-sm font-semibold text-slate-900">
                                                    {status.value}
                                                </span>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Shipments */}
                <div className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Recent Shipments
                            </CardTitle>
                        </CardHeader>

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
                                                Status
                                            </th>

                                            <th className="px-6 py-3 font-medium">
                                                Payment
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentShipments.map((shipment) => (
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

                                                <td className="min-w-64 px-6 py-4 text-slate-600">
                                                    <div className="text-xs">
                                                        {shipment.originAddress}
                                                    </div>

                                                    <div className="mt-1 text-xs text-slate-400">
                                                        ↓ {shipment.destinationAddress}
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {shipment.status.replaceAll(
                                                            "_",
                                                            " ",
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                                        {shipment.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {recentShipments.length === 0 && (
                                <div className="px-6 py-10 text-center text-sm text-slate-500">
                                    No shipments found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppShell>
    );
}