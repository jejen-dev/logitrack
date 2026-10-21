"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Mail, MapPin, Phone, RotateCcw, UserRound } from "lucide-react";

import {
    createCustomer,
    setCustomerActive,
    updateCustomer,
} from "@/app/customers/actions/manage-customer";
import { Badge, Card, CardContent, CardHeader, CardTitle, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { LocalizedText , LocalizedInput} from "@/components/locale-provider";

interface Customer {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    postalCode: string | null;
    isActive: boolean;
}

interface CustomerInput {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

type CustomerDialog =
    | { type: "create" }
    | { type: "edit"; customer: Customer }
    | { type: "archive" | "restore"; customer: Customer }
    | null;

export function CustomerManagement({ customers }: { customers: Customer[] }) {
    const router = useRouter();
    const [dialog, setDialog] = useState<CustomerDialog>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function saveCustomer(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dialog?.type !== "create" && dialog?.type !== "edit") return;

        setError("");
        setBusy(true);
        const formData = new FormData(event.currentTarget);
        const input: CustomerInput = {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            address: String(formData.get("address") ?? ""),
            city: String(formData.get("city") ?? ""),
            postalCode: String(formData.get("postalCode") ?? ""),
        };

        try {
            if (dialog.type === "edit") await updateCustomer(dialog.customer.id, input);
            else await createCustomer(input);
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to save customer.");
        } finally {
            setBusy(false);
        }
    }

    async function confirmCustomerStateChange() {
        if (dialog?.type !== "archive" && dialog?.type !== "restore") return;

        setError("");
        setBusy(true);
        try {
            await setCustomerActive(dialog.customer.id, dialog.type === "restore");
            setDialog(null);
            router.refresh();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Failed to change customer status.");
        } finally {
            setBusy(false);
        }
    }

    const activeCustomers = customers.filter((customer) => customer.isActive);
    const inactiveCustomers = customers.filter((customer) => !customer.isActive);
    const editingCustomer = dialog?.type === "edit" ? dialog.customer : undefined;
    const stateChangeCustomer = dialog?.type === "archive" || dialog?.type === "restore" ? dialog.customer : undefined;

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                    {activeCustomers.length} <LocalizedText text={" active · "} />{inactiveCustomers.length} <LocalizedText text={" archived\n                "} /></p>
                <Button onClick={() => { setError(""); setDialog({ type: "create" }); }}>
                    <LocalizedText text={"\n                    Add customer\n                "} /></Button>
            </div>

            {error && !dialog && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><LocalizedText text={error} /></p>}

            <CustomerGrid
                customers={activeCustomers}
                onEdit={(customer) => { setError(""); setDialog({ type: "edit", customer }); }}
                onToggle={(customer) => { setError(""); setDialog({ type: "archive", customer }); }}
            />

            {inactiveCustomers.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800"><LocalizedText text={"Archived customers"} /></h2>
                    <CustomerGrid
                        customers={inactiveCustomers}
                        onEdit={(customer) => { setError(""); setDialog({ type: "edit", customer }); }}
                        onToggle={(customer) => { setError(""); setDialog({ type: "restore", customer }); }}
                    />
                </section>
            )}

            {customers.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <UserRound className="mx-auto h-8 w-8 text-slate-300" />
                        <p className="mt-3 text-sm text-slate-500"><LocalizedText text={"No customers found. Add your first customer."} /></p>
                    </CardContent>
                </Card>
            )}

            <Modal
                open={dialog !== null}
                onOpenChange={(open) => { if (!open && !busy) { setDialog(null); setError(""); } }}
                title={dialog?.type === "create" ? "Add customer" : dialog?.type === "edit" ? "Edit customer" : dialog?.type === "archive" ? "Archive customer" : "Restore customer"}
                description={dialog?.type === "create" ? "Enter the customer's contact information." : dialog?.type === "edit" ? "Update the customer's information." : undefined}
            >
                {(dialog?.type === "create" || dialog?.type === "edit") && (
                    <CustomerForm customer={editingCustomer} busy={busy} error={error} onCancel={() => setDialog(null)} onSubmit={saveCustomer} />
                )}

                {stateChangeCustomer && (
                    <div className="space-y-5">
                        <p className="text-sm leading-6 text-slate-600">
                            {dialog?.type === "archive"
                                ? `Archive ${stateChangeCustomer.name}? The customer record and shipment history will be kept, but the customer cannot be selected for new shipments.`
                                : `Restore ${stateChangeCustomer.name}? The customer can be selected for new shipments again.`}
                        </p>
                        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" disabled={busy} onClick={() => setDialog(null)}><LocalizedText text={"Cancel"} /></Button>
                            <Button variant={dialog?.type === "archive" ? "danger" : "primary"} disabled={busy} onClick={confirmCustomerStateChange}>
                                <LocalizedText text={busy ? "Saving…" : dialog?.type === "archive" ? "Archive" : "Restore"} />
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

function CustomerGrid({
    customers,
    onEdit,
    onToggle,
}: {
    customers: Customer[];
    onEdit: (customer: Customer) => void;
    onToggle: (customer: Customer) => void;
}) {
    if (customers.length === 0) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {customers.map((customer) => (
                <Card key={customer.id}>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                    <UserRound className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{customer.name}</CardTitle>
                                    {customer.city && <p className="mt-1 text-xs text-slate-500">{customer.city}</p>}
                                </div>
                            </div>
                            {!customer.isActive && <Badge><LocalizedText text={"ARCHIVED"} /></Badge>}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {customer.email && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span className="break-all">{customer.email}</span>
                                </div>
                            )}
                            {customer.phone && (
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                            {(customer.address || customer.postalCode) && (
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                    <div>
                                        {customer.address && <p>{customer.address}</p>}
                                        {(customer.city || customer.postalCode) && (
                                            <p className="text-slate-500">{[customer.city, customer.postalCode].filter(Boolean).join(", ")}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEdit(customer)}><LocalizedText text={"Edit"} /></Button>
                            <Button variant={customer.isActive ? "danger" : "secondary"} size="sm" onClick={() => onToggle(customer)}>
                                {customer.isActive ? <Archive aria-hidden="true" className="h-3.5 w-3.5" /> : <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />}
                                <LocalizedText text={customer.isActive ? "Archive" : "Restore"} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function CustomerForm({
    customer,
    busy,
    error,
    onCancel,
    onSubmit,
}: {
    customer?: Customer;
    busy: boolean;
    error: string;
    onCancel: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">
                <LocalizedText text={"\n                Name\n                "} /><LocalizedInput name="name" required maxLength={120} defaultValue={customer?.name} placeholder="PT Logistik Nusantara" autoComplete="name" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                    <LocalizedText text={"\n                    Email\n                    "} /><LocalizedInput name="email" type="email" maxLength={254} defaultValue={customer?.email ?? ""} placeholder="operasional@perusahaan.co.id" autoComplete="email" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    <LocalizedText text={"\n                    Phone\n                    "} /><LocalizedInput name="phone" type="tel" maxLength={40} defaultValue={customer?.phone ?? ""} placeholder="021 555 1234" autoComplete="tel" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
                <LocalizedText text={"\n                Address\n                "} /><LocalizedInput name="address" maxLength={300} defaultValue={customer?.address ?? ""} placeholder="Jl. Jenderal Sudirman No. 10" autoComplete="street-address" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                    <LocalizedText text={"\n                    City\n                    "} /><LocalizedInput name="city" maxLength={100} defaultValue={customer?.city ?? ""} placeholder="Jakarta Selatan" autoComplete="address-level2" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    <LocalizedText text={"\n                    Postal code\n                    "} /><LocalizedInput name="postalCode" maxLength={20} defaultValue={customer?.postalCode ?? ""} placeholder="12190" autoComplete="postal-code" className="mt-1 h-10 w-full rounded-md border border-slate-300 bg-white px-3 font-normal" />
                </label>
            </div>
            {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"><LocalizedText text={error} /></p>}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" disabled={busy} onClick={onCancel}><LocalizedText text={"Cancel"} /></Button>
                <Button type="submit" disabled={busy}><LocalizedText text={busy ? "Saving…" : "Save"} /></Button>
            </div>
        </form>
    );
}
