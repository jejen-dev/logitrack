import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getUsers } from "@/lib/users/queries";
import { UsersManagement } from "./users-management";

export default async function UsersPage() {
    const { currentUserId, users } = await getUsers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader title="Users & Access" description="Manage application roles for Google accounts that have signed in." />
                <UsersManagement users={users} currentUserId={currentUserId} />
            </PageContainer>
        </AppShell>
    );
}
