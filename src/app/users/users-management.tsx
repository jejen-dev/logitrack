"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateUserRole } from "@/app/users/actions/manage-user";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/generated/prisma/enums";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

const roles: UserRole[] = ["ADMIN", "MANAGER", "OPERATOR", "DRIVER"];

export function UsersManagement({ users, currentUserId }: { users: UserRecord[]; currentUserId: string }) {
    const router = useRouter();
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);
    const [error, setError] = useState("");

    async function saveRole(userId: string, formData: FormData) {
        const role = String(formData.get("role")) as UserRole;
        setError("");
        setPendingUserId(userId);
        try {
            await updateUserRole(userId, role);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to update user role.");
        } finally {
            setPendingUserId(null);
        }
    }

    return (
        <div className="space-y-4">
            <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                Users appear here after their first Google sign-in. To enable driver shipment access, set the role to DRIVER and use the same Google email in the driver profile.
            </p>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <Card>
                <CardContent className="pt-5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-4 py-3 font-medium text-slate-500">User</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Email</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Role</th>
                                    <th className="px-4 py-3 font-medium text-slate-500">Joined</th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <UserRow
                                        key={user.id}
                                        user={user}
                                        busy={pendingUserId === user.id}
                                        disabled={pendingUserId !== null || user.id === currentUserId || user.role === "ADMIN" && users.filter((entry) => entry.role === "ADMIN").length === 1}
                                        onSave={(formData) => saveRole(user.id, formData)}
                                    />
                                ))}
                                {users.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500">No users have signed in yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function UserRow({
    user,
    busy,
    disabled,
    onSave,
}: {
    user: UserRecord;
    busy: boolean;
    disabled: boolean;
    onSave: (formData: FormData) => void;
}) {
    return (
        <tr className="border-b border-slate-100 last:border-0">
            <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
            <td className="px-4 py-3 text-slate-600">{user.email}</td>
            <td className="px-4 py-3">
                <form id={`role-${user.id}`} action={onSave}>
                    <select name="role" defaultValue={user.role} disabled={disabled} aria-label={`Role for ${user.email}`} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50">
                        {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                    </select>
                </form>
            </td>
            <td className="px-4 py-3 text-slate-600">{new Date(user.createdAt).toLocaleDateString("en-ID")}</td>
            <td className="px-4 py-3 text-right"><Button type="submit" form={`role-${user.id}`} size="sm" variant="outline" disabled={disabled}>{busy ? "Saving…" : "Save role"}</Button></td>
        </tr>
    );
}
