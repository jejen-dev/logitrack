export const driverLicenseTypes = [
    { value: "A", label: "Class A License" },
    { value: "B1", label: "Class B-I License" },
    { value: "B2", label: "Class B-II License" },
    { value: "C", label: "Class C License" },
    { value: "C1", label: "Class C-I License" },
    { value: "C2", label: "Class C-II License" },
    { value: "D", label: "Class D License" },
    { value: "DI", label: "Class D-I License" },
] as const;

export type DriverLicenseType = (typeof driverLicenseTypes)[number]["value"];
