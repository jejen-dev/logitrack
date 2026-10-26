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
import { LocalizedText } from "@/components/locale-provider";

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
                                    <LocalizedText text={card.title} />
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="text-3xl font-bold tracking-tight text-slate-900">
                                    {card.value}
                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    <LocalizedText text={card.description} />
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
                                <LocalizedText text={"\n                                Shipment Status\n                            "} /></CardTitle>
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
                                                    <LocalizedText text={status.label} />
                                                </span>

                                                <span className="text-sm font-semibold text-slate-900">
                                                    {status.value}
                                                </span>
                                            </div>

                                            <div className="h-2 overflow-hidden rounded-full bg-slate-900/[0.06] shadow-inner">
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
                                <LocalizedText text={"\n                                Recent Shipments\n                            "} /></CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs text-slate-500">
                                            <th className="px-6 py-3 font-medium">
                                                <LocalizedText text={"\n                                                Tracking Number\n                                            "} /></th>

                                            <th className="px-6 py-3 font-medium">
                                                <LocalizedText text={"\n                                                Customer\n                                            "} /></th>

                                            <th className="px-6 py-3 font-medium">
                                                <LocalizedText text={"\n                                                Route\n                                            "} /></th>

                                            <th className="px-6 py-3 font-medium">
                                                <LocalizedText text={"\n                                                Status\n                                            "} /></th>

                                            <th className="px-6 py-3 font-medium">
                                                <LocalizedText text={"\n                                                Payment\n                                            "} /></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentShipments.map((shipment) => (
                                            <tr
                                                key={shipment.id}
                                                className="border-b last:border-0"
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
                                                        <LocalizedText text={"\n                                                        ↓ "} />{shipment.destinationAddress}
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/15">
                                                        <LocalizedText text={shipment.status.replaceAll(
                                                            "_",
                                                            " ",
                                                        )} />
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-white/60 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-500/15">
                                                        <LocalizedText text={shipment.paymentStatus} />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {recentShipments.length === 0 && (
                                <div className="px-6 py-10 text-center text-sm text-slate-500">
                                    <LocalizedText text={"\n                                    No shipments found.\n                                "} /></div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppShell>
    );
}
