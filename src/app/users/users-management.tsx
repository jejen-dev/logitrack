"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMerchantInvitation } from "@/app/team/actions";
import { updateUserRole } from "@/app/users/actions/manage-user";
import { Card, CardContent } from "@/components/ui";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/generated/prisma/enums";
import { LocalizedText, LocalizedInput, useLocale } from "@/components/locale-provider";

interface UserRecord {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

interface InvitationRecord {
    email: string;
    role: UserRole;
    expiresAt: Date;
}

const roles: UserRole[] = ["ADMIN", "MANAGER", "OPERATOR", "DRIVER"];

export function UsersManagement({
    users,
    invitations,
    currentUserId,
    ownerId,
}: {
    users: UserRecord[];
    invitations: InvitationRecord[];
    currentUserId: string;
    ownerId: string;
}) {
    const { locale } = useLocale();
    const router = useRouter();
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);
    const [inviteBusy, setInviteBusy] = useState(false);
    const [error, setError] = useState("");
    const [inviteLink, setInviteLink] = useState("");

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

    async function invite(formData: FormData) {
        setError("");
        setInviteLink("");
        setInviteBusy(true);
        try {
            const result = await createMerchantInvitation(formData);
            setInviteLink(result.link);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not create invitation.");
        } finally {
            setInviteBusy(false);
        }
    }

    const adminCount = users.filter((user) => user.role === "ADMIN").length;

    return (
        <div className="space-y-5">
            <p className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                <LocalizedText text={"\n                Invite teammates with a link, then manage their role here. Users appear in the list after they sign in with the invited Google account.\n            "} /></p>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><LocalizedText text={error} /></p>}

            <Card>
                <CardContent className="space-y-4 p-6">
                    <div>
                        <h2 className="text-lg font-semibold"><LocalizedText text={"Invite a user"} /></h2>
                        <p className="mt-1 text-sm text-slate-500"><LocalizedText text={"The invite link expires after 7 days and only works for the invited email."} /></p>
                    </div>
                    <form action={invite} className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                        <LocalizedInput name="email" type="email" required placeholder="Email address" className="h-11 rounded-xl border border-slate-200 bg-white/70 px-3 text-sm" />
                        <select name="role" defaultValue="OPERATOR" className="h-11 rounded-xl border border-slate-200 bg-white/70 px-3 text-sm">
                            <option value="MANAGER"><LocalizedText text={"Manager"} /></option>
                            <option value="OPERATOR"><LocalizedText text={"Operator"} /></option>
                            <option value="DRIVER"><LocalizedText text={"Driver"} /></option>
                        </select>
                        <Button type="submit" disabled={inviteBusy}><LocalizedText text={inviteBusy ? "Creating…" : "Create invite link"} /></Button>
                    </form>
                    {inviteLink && (
                        <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                            <p className="text-sm"><LocalizedText text={"Send this link to the invited email:"} /></p>
                            <a className="break-all text-sm text-blue-700 underline" href={inviteLink}>{inviteLink}</a>
                            <Button type="button" variant="outline" onClick={() => navigator.clipboard.writeText(inviteLink)}><LocalizedText text={"Copy link"} /></Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {invitations.length > 0 && (
                <Card>
                    <CardContent className="p-6">
                        <h2 className="mb-3 text-lg font-semibold"><LocalizedText text={"Pending invitations"} /></h2>
                        <div className="divide-y divide-slate-200">
                            {invitations.map((invitation) => (
                                <div key={`${invitation.email}-${invitation.expiresAt.toISOString()}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                                    <span className="text-slate-700">{invitation.email} <LocalizedText text={" · "} /><LocalizedText text={invitation.role} /></span>
                                    <span className="text-slate-500"><LocalizedText text={"Expires "} />{new Date(invitation.expiresAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="pt-5">
                    <h2 className="mb-3 px-4 text-lg font-semibold"><LocalizedText text={"Members"} /></h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"User"} /></th>
                                    <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Email"} /></th>
                                    <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Role"} /></th>
                                    <th className="px-4 py-3 font-medium text-slate-500"><LocalizedText text={"Joined"} /></th>
                                    <th className="px-4 py-3 text-right font-medium text-slate-500"><LocalizedText text={"Actions"} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => {
                                    const isOwner = user.id === ownerId;
                                    const disabled = pendingUserId !== null || user.id === currentUserId || isOwner || (user.role === "ADMIN" && adminCount === 1);
                                    return (
                                        <UserRow
                                            key={user.id}
                                            user={user}
                                            busy={pendingUserId === user.id}
                                            disabled={disabled}
                                            onSave={(formData) => saveRole(user.id, formData)}
                                        />
                                    );
                                })}
                                {users.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-500"><LocalizedText text={"No members yet."} /></td></tr>}
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
    const { locale, t } = useLocale();
    return (
        <tr className="border-b border-slate-100 last:border-0">
            <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
            <td className="px-4 py-3 text-slate-600">{user.email}</td>
            <td className="px-4 py-3">
                <form id={`role-${user.id}`} action={onSave}>
                    <select name="role" defaultValue={user.role} disabled={disabled} aria-label={`${t("Role")} ${user.email}`} className="h-10 min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm disabled:bg-slate-50">
                        {roles.map((role) => <option key={role} value={role}><LocalizedText text={role} /></option>)}
                    </select>
                </form>
            </td>
            <td className="px-4 py-3 text-slate-600">{new Date(user.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US")}</td>
            <td className="px-4 py-3 text-right"><Button type="submit" form={`role-${user.id}`} size="sm" variant="outline" disabled={disabled}><LocalizedText text={busy ? "Saving…" : "Save role"} /></Button></td>
        </tr>
    );
}
