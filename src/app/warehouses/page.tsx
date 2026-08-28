import { Warehouse as WarehouseIcon } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getWarehouses } from "@/lib/warehouses/queries";

export default async function WarehousesPage() {
    const warehouses = await getWarehouses();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Warehouses"
                    description="Manage warehouse locations and inventory capacity."
                />

                <div className="grid gap-4 md:grid-cols-2">
                    {warehouses.map((warehouse) => (
                        <Card key={warehouse.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <WarehouseIcon className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <CardTitle className="text-base">
                                                {warehouse.name}
                                            </CardTitle>

                                            <p className="mt-1 font-mono text-xs text-slate-500">
                                                {warehouse.code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                            Location
                                        </p>

                                        <p className="mt-1 text-sm text-slate-700">
                                            {warehouse.address}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {warehouse.city},{" "}
                                            {warehouse.postalCode}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs text-slate-500">
                                                Inventory Items
                                            </p>

                                            <p className="mt-1 text-xl font-semibold text-slate-900">
                                                {
                                                    warehouse._count
                                                        .inventoryItems
                                                }
                                            </p>
                                        </div>

                                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-xs text-slate-500">
                                                Warehouse Code
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {warehouse.code}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {warehouses.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <WarehouseIcon className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm text-slate-500">
                                No warehouses found.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </PageContainer>
        </AppShell>
    );
}
