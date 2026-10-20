import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getCustomers } from "@/lib/customers/queries";
import { CustomerManagement } from "./customer-management";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Customers"
                    description="Manage customer information and contact details."
                />
                <CustomerManagement customers={customers} />
            </PageContainer>
        </AppShell>
    );
}
