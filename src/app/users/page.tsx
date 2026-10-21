import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getUsers } from "@/lib/users/queries";
import { UsersManagement } from "./users-management";

export default async function UsersPage() {
    const { currentUserId, ownerId, merchantName, users, invitations } = await getUsers();

    return (
        <AppShell>
            <PageContainer>
                <PageHeader title="Users & Access" description={`Manage members and access for ${merchantName}.`} />
                <UsersManagement users={users} invitations={invitations} currentUserId={currentUserId} ownerId={ownerId} />
            </PageContainer>
        </AppShell>
    );
}
