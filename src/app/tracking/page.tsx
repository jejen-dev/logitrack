import {
    CheckCircle2,
    Circle,
    MapPin,
    Package,
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
import { getTrackingEvents } from "@/lib/tracking/queries";

export default async function TrackingPage() {
    const events = await getTrackingEvents();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Tracking"
                    description="Monitor shipment movement and tracking events."
                />

                <div className="space-y-4">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <Package className="h-5 w-5" />
                                        </div>

                                        <div>
                                            <CardTitle className="text-base">
                                                {event.shipment.trackingNumber}
                                            </CardTitle>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {new Date(
                                                    event.createdAt,
                                                ).toLocaleString("en-ID")}
                                            </p>
                                        </div>
                                    </div>

                                    <Badge variant="info">
                                        {event.status.replace(
                                            /_/g,
                                            " ",
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="relative ml-2 border-l border-slate-200 pl-6">
                                    <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                                    </div>

                                    <p className="text-sm font-medium text-slate-900">
                                        {event.description}
                                    </p>

                                    {event.location && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4" />

                                            <span>
                                                {event.location}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {events.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Circle className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm text-slate-500">
                                No tracking events found.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </PageContainer>
        </AppShell>
    );
}
