import Link from "next/link";
import { CheckCircle2, Circle, MapPin, Package, Search } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getTrackingEvents } from "@/lib/tracking/queries";
import type { ShipmentStatus } from "@/generated/prisma/enums";

interface TrackingPageProps {
    searchParams: Promise<{ search?: string; status?: string }>;
}

function getStatusVariant(status: ShipmentStatus) {
    if (status === "DELIVERED") return "success";
    if (status === "IN_TRANSIT" || status === "PICKED_UP") return "info";
    if (status === "OUT_FOR_DELIVERY") return "warning";
    if (status === "CANCELLED") return "danger";
    return "default";
}

export default async function TrackingPage({ searchParams }: TrackingPageProps) {
    const params = await searchParams;
    const search = params.search?.trim() ?? "";
    const validStatuses: ShipmentStatus[] = ["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    const status = validStatuses.includes(params.status as ShipmentStatus) ? params.status as ShipmentStatus : undefined;
    const events = await getTrackingEvents({ search, status });

    return (
        <AppShell>
            <PageContainer>
                <PageHeader title="Tracking" description="Search shipment updates and follow each delivery timeline." />

                <form method="GET" className="mb-5 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input name="search" type="search" defaultValue={search} placeholder="Tracking number, customer, location..." className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <select name="status" defaultValue={status ?? ""} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
                        <option value="">All statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PICKED_UP">Picked up</option>
                        <option value="IN_TRANSIT">In transit</option>
                        <option value="OUT_FOR_DELIVERY">Out for delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                    <Button type="submit">Search tracking</Button>
                    {(search || status) && <Link href="/tracking" className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm text-slate-600 hover:bg-slate-100">Clear</Link>}
                </form>

                <p className="mb-4 text-sm text-slate-500">{events.length} tracking update{events.length === 1 ? "" : "s"}</p>
                <div className="space-y-4">
                    {events.map((event) => (
                        <Card key={event.id}>
                            <CardHeader>
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Package className="h-5 w-5" /></div>
                                        <div>
                                            <CardTitle className="text-base"><Link href={`/shipments/${event.shipment.id}`} className="hover:text-blue-600">{event.shipment.trackingNumber}</Link></CardTitle>
                                            <p className="mt-1 text-xs text-slate-500">{event.shipment.customer.name} · {event.occurredAt.toLocaleString("en-ID")}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(event.status)}>{event.status.replaceAll("_", " ")}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="relative ml-2 border-l border-slate-200 pl-6">
                                    <div className="absolute -left-[9px] top-0 flex h-4 w-4 items-center justify-center rounded-full bg-white"><CheckCircle2 className="h-4 w-4 text-blue-600" /></div>
                                    <p className="text-sm font-medium text-slate-900">{event.description || `Shipment updated to ${event.status.replaceAll("_", " ")}.`}</p>
                                    {event.location && <div className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>}
                                    <p className="mt-2 text-xs text-slate-500">Destination: {event.shipment.destinationAddress}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {events.length === 0 && <Card><CardContent className="py-12 text-center"><Circle className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm text-slate-500">No tracking updates match your search.</p></CardContent></Card>}
            </PageContainer>
        </AppShell>
    );
}
