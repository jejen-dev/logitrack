export const vehicleTypes = [
    "Sepeda Motor",
    "Mobil Van",
    "Truk Pikap",
    "Truk Ringan (CDE)",
    "Truk Sedang (CDD)",
    "Truk Box",
    "Truk Berpendingin",
    "Truk Wingbox",
    "Truk Bak Datar",
    "Kepala Traktor + Trailer",
] as const;

export type VehicleType = (typeof vehicleTypes)[number];

const legacyVehicleTypes: Record<string, VehicleType> = {
    Motorcycle: "Sepeda Motor",
    Van: "Mobil Van",
    "Pickup Truck": "Truk Pikap",
    "Light Truck (CDE)": "Truk Ringan (CDE)",
    "Medium Truck (CDD)": "Truk Sedang (CDD)",
    "Box Truck": "Truk Box",
    "Refrigerated Truck": "Truk Berpendingin",
    "Wingbox Truck": "Truk Wingbox",
    "Flatbed Truck": "Truk Bak Datar",
    "Tractor Head & Trailer": "Kepala Traktor + Trailer",
};

export function normalizeVehicleType(value: string): VehicleType | "" {
    if (vehicleTypes.includes(value as VehicleType)) return value as VehicleType;
    return legacyVehicleTypes[value] ?? "";
}

export function getVehicleTypeLabel(value: string): string {
    return normalizeVehicleType(value) || "Tipe lainnya";
}
