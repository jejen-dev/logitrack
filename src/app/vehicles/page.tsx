import { Car, Gauge } from "lucide-react";

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
import { getVehicles } from "@/lib/vehicles/queries";

export default async function VehiclesPage() {
    const vehicles = await getVehicles();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Vehicles"
                    description="Manage fleet vehicles and monitor their status."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {vehicles.map((vehicle) => {
                        const isAvailable =
                            vehicle.status === "AVAILABLE";

                        return (
                            <Card key={vehicle.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                                                <Car className="h-5 w-5 text-slate-600" />
                                            </div>

                                            <div>
                                                <CardTitle className="text-base">
                                                    {vehicle.plateNumber}
                                                </CardTitle>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {vehicle.type}
                                                </p>
                                            </div>
                                        </div>

                                        <Badge
                                            variant={
                                                isAvailable
                                                    ? "success"
                                                    : "info"
                                            }
                                        >
                                            {vehicle.status.replace(
                                                "_",
                                                " ",
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Gauge className="h-4 w-4 text-slate-400" />

                                        <span>
                                            Capacity:{" "}
                                            {vehicle.capacity}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {vehicles.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Car className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm text-slate-500">
                                No vehicles found.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </PageContainer>
        </AppShell>
    );
}
