export const driverLicenseTypes = [
    { value: "A", label: "SIM A" },
    { value: "B1", label: "SIM B I" },
    { value: "B2", label: "SIM B II" },
    { value: "C", label: "SIM C" },
    { value: "C1", label: "SIM C I" },
    { value: "C2", label: "SIM C II" },
    { value: "D", label: "SIM D" },
    { value: "DI", label: "SIM D I" },
] as const;

export type DriverLicenseType = (typeof driverLicenseTypes)[number]["value"];
