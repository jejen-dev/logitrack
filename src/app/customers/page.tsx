import { Mail, MapPin, Phone, UserRound } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getCustomers } from "@/lib/customers/queries";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Customers"
                    description="Manage customer information and contact details."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {customers.map((customer) => (
                        <Card key={customer.id}>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                        <UserRound className="h-5 w-5 text-slate-600" />
                                    </div>

                                    <div>
                                        <CardTitle className="text-base">
                                            {customer.name}
                                        </CardTitle>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {customer.city}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{customer.email}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{customer.phone}</span>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                                        <div>
                                            <p>{customer.address}</p>

                                            <p className="text-slate-500">
                                                {customer.city},{" "}
                                                {customer.postalCode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {customers.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <UserRound className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-3 text-sm text-slate-500">
                                No customers found.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </PageContainer>
        </AppShell>
    );
}
