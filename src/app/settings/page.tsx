import { Settings, ShieldCheck } from "lucide-react";

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

export default function SettingsPage() {
    return (
        <AppShell>
            <PageContainer>
                <PageHeader
                    title="Settings"
                    description="Manage application configuration and access settings."
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                    <Settings className="h-4 w-4 text-slate-600" />
                                </div>

                                <div>
                                    <CardTitle className="text-base">
                                        Application
                                    </CardTitle>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Current application configuration.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-sm text-slate-500">
                                        Application
                                    </span>

                                    <span className="text-sm font-medium text-slate-900">
                                        LogiTrack
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-sm text-slate-500">
                                        Environment
                                    </span>

                                    <Badge variant="success">
                                        Development
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Version
                                    </span>

                                    <span className="text-sm font-medium text-slate-900">
                                        0.1.0
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                                </div>

                                <div>
                                    <CardTitle className="text-base">
                                        Access Control
                                    </CardTitle>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Role-based access control is enabled.
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span className="text-sm text-slate-600">
                                        ADMIN
                                    </span>

                                    <Badge variant="success">
                                        Full Access
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span className="text-sm text-slate-600">
                                        MANAGER
                                    </span>

                                    <Badge variant="info">
                                        Management
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span className="text-sm text-slate-600">
                                        OPERATOR
                                    </span>

                                    <Badge variant="info">
                                        Operations
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                                    <span className="text-sm text-slate-600">
                                        DRIVER
                                    </span>

                                    <Badge variant="info">
                                        Delivery
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        </AppShell>
    );
}
