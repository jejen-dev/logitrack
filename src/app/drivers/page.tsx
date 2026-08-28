import { Phone, UserRound } from "lucide-react";

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
import { getDrivers } from "@/lib/drivers/queries";

export default async function DriversPage() {
    const drivers = await getDrivers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Drivers"
                    description="Manage drivers and monitor their availability."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {drivers.map((driver) => {
                        const isAvailable =
                            driver.status === "AVAILABLE";

                        return (
                            <Card key={driver.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                                <UserRound className="h-5 w-5 text-slate-600" />
                                            </div>

                                            <div>
                                                <CardTitle className="text-base">
                                                    {driver.name}
                                                </CardTitle>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {driver.licenseNo}
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
                                            {driver.status.replace(
                                                "_",
                                                " ",
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 text-slate-400" />

                                        <span>
                                            {driver.phone}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {drivers.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <UserRound className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm text-slate-500">
                                No drivers found.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </PageContainer>
        </AppShell>
    );
}
