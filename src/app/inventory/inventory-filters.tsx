"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface InventoryFiltersProps {
    warehouses: {
        id: string;
        name: string;
        code: string;
    }[];
}

export function InventoryFilters({
    warehouses,
}: InventoryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") ?? "";
    const warehouseId =
        searchParams.get("warehouseId") ?? "";
    const stockStatus =
        searchParams.get("stockStatus") ?? "ALL";

    function updateFilter(
        key: string,
        value: string,
    ) {
        const params = new URLSearchParams(
            searchParams.toString(),
        );

        if (!value || value === "ALL") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.push(
            `/inventory${
                params.toString()
                    ? `?${params.toString()}`
                    : ""
            }`,
        );
    }

    function clearFilters() {
        router.push("/inventory");
    }

    const hasFilters =
        search ||
        warehouseId ||
        stockStatus !== "ALL";

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    type="search"
                    defaultValue={search}
                    placeholder="Search SKU or product..."
                    className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            updateFilter(
                                "search",
                                event.currentTarget.value.trim(),
                            );
                        }
                    }}
                />
            </div>

            {/* Warehouse */}
            <select
                value={warehouseId}
                onChange={(event) =>
                    updateFilter(
                        "warehouseId",
                        event.target.value,
                    )
                }
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
                <option value="">
                    All Warehouses
                </option>

                {warehouses.map((warehouse) => (
                    <option
                        key={warehouse.id}
                        value={warehouse.id}
                    >
                        {warehouse.name}
                    </option>
                ))}
            </select>

            {/* Stock Status */}
            <select
                value={stockStatus}
                onChange={(event) =>
                    updateFilter(
                        "stockStatus",
                        event.target.value,
                    )
                }
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
                <option value="ALL">
                    All Stock
                </option>

                <option value="IN_STOCK">
                    In Stock
                </option>

                <option value="LOW_STOCK">
                    Low Stock
                </option>
            </select>

            {hasFilters && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1 text-slate-500"
                >
                    <X className="h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>
    );
}
