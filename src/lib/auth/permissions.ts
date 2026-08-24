import type { UserRole } from "@/generated/prisma/enums";

export const routePermissions: Record<string, UserRole[]> = {
    "/dashboard": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
        "DRIVER",
    ],

    "/shipments": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
        "DRIVER",
    ],

    "/tracking": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
        "DRIVER",
    ],

    "/inventory": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ],

    "/warehouses": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ],

    "/drivers": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ],

    "/vehicles": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ],

    "/customers": [
        "ADMIN",
        "MANAGER",
        "OPERATOR",
    ],

    "/reports": [
        "ADMIN",
        "MANAGER",
    ],

    "/settings": [
        "ADMIN",
        "MANAGER",
    ],
};

const validRoles: UserRole[] = [
    "ADMIN",
    "MANAGER",
    "OPERATOR",
    "DRIVER",
];

export function isUserRole(
    role: unknown,
): role is UserRole {
    return (
        typeof role === "string" &&
        validRoles.includes(role as UserRole)
    );
}

export function canAccessRoute(
    pathname: string,
    role: UserRole,
): boolean {
    const matchingRoute = Object.keys(routePermissions)
        .sort((a, b) => b.length - a.length)
        .find(
            (route) =>
                pathname === route ||
                pathname.startsWith(`${route}/`),
        );

    if (!matchingRoute) {
        return false;
    }

    return routePermissions[matchingRoute].includes(role);
}