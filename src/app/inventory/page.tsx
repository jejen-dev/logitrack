import { Boxes } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getInventoryItems } from "@/lib/inventory/queries";

export default async function InventoryPage() {
    const inventoryItems = await getInventoryItems();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Inventory"
                    description="Monitor stock levels across your warehouses."
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Boxes className="h-5 w-5" />
                            Inventory Items
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left">
                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            SKU
                                        </th>

                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            Product
                                        </th>

                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            Warehouse
                                        </th>

                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            Quantity
                                        </th>

                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            Reorder Point
                                        </th>

                                        <th className="px-4 py-3 font-medium text-slate-500">
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {inventoryItems.map((item) => {
                                        const isLowStock =
                                            item.quantity <=
                                            item.reorderPoint;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b border-slate-100 last:border-0"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                                                    {item.sku}
                                                </td>

                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {item.name}
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    <div>
                                                        <p>
                                                            {
                                                                item
                                                                    .warehouse
                                                                    .name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-slate-400">
                                                            {
                                                                item
                                                                    .warehouse
                                                                    .code
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-4 py-3 text-slate-600">
                                                    {item.reorderPoint}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={
                                                            isLowStock
                                                                ? "inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                                                                : "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                                                        }
                                                    >
                                                        {isLowStock
                                                            ? "Low Stock"
                                                            : "In Stock"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </PageContainer>
        </AppShell>
    );
}
