export const vehicleTypes = [
    "Motorcycle",
    "Van",
    "Pickup Truck",
    "Light Truck (CDE)",
    "Medium Truck (CDD)",
    "Box Truck",
    "Refrigerated Truck",
    "Wingbox Truck",
    "Flatbed Truck",
    "Tractor Head & Trailer",
] as const;

export type VehicleType = (typeof vehicleTypes)[number];

const legacyVehicleTypes: Record<string, VehicleType> = {
    "Sepeda Motor": "Motorcycle",
    "Mobil Van": "Van",
    "Truk Pikap": "Pickup Truck",
    "Truk Ringan (CDE)": "Light Truck (CDE)",
    "Truk Sedang (CDD)": "Medium Truck (CDD)",
    "Truk Box": "Box Truck",
    "Truk Berpendingin": "Refrigerated Truck",
    "Truk Wingbox": "Wingbox Truck",
    "Truk Bak Datar": "Flatbed Truck",
    "Kepala Traktor + Trailer": "Tractor Head & Trailer",
};

export function normalizeVehicleType(value: string): VehicleType | "" {
    if (vehicleTypes.includes(value as VehicleType)) return value as VehicleType;
    return legacyVehicleTypes[value] ?? "";
}

export function getVehicleTypeLabel(value: string): string {
    return normalizeVehicleType(value) || "Other type";
}
