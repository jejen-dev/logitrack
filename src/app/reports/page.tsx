import {
    BarChart3,
    CheckCircle2,
    Clock3,
    Package,
    XCircle,
} from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getShipmentReport } from "@/lib/reports/queries";

export default async function ReportsPage() {
    const report = await getShipmentReport();

    const statusItems = [
        {
            label: "Pending",
            value: report.pendingShipments,
            icon: Clock3,
        },
        {
            label: "Picked Up",
            value: report.pickedUpShipments,
            icon: Package,
        },
        {
            label: "In Transit",
            value: report.inTransitShipments,
            icon: BarChart3,
        },
        {
            label: "Out for Delivery",
            value: report.outForDeliveryShipments,
            icon: Package,
        },
        {
            label: "Delivered",
            value: report.deliveredShipments,
            icon: CheckCircle2,
        },
        {
            label: "Cancelled",
            value: report.cancelledShipments,
            icon: XCircle,
        },
    ];

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Reports"
                    description="Overview of shipment performance and operational status."
                />

                {/* Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipment Summary</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <Package className="h-5 w-5 text-blue-600" />
                            </div>

                            <div>
                                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {report.totalShipments}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Total Shipments
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statusItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.label}>
                                <CardContent className="flex items-center justify-between p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                            <Icon className="h-4 w-4 text-slate-600" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {item.label}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                Shipments
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="info">
                                        {item.value}
                                    </Badge>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </PageContainer>
        </AppShell>
    );
}
