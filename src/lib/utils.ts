import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string): string {
  if (!name) {
    return "D";
  }
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function calculateDepreciation(
  initialValue: number,
  salvageValue: number,
  usefulLifeInYears: number,
  yearsUsed: number
): number {
  if (usefulLifeInYears <= 0) {
    throw new Error("Useful life must be greater than 0.");
  }
  if (yearsUsed > usefulLifeInYears) {
    yearsUsed = usefulLifeInYears;
  }

  // Calculate annual depreciation
  const annualDepreciation = (initialValue - salvageValue) / usefulLifeInYears;

  // Depreciated value after yearsUsed
  const depreciatedValue = initialValue - annualDepreciation * yearsUsed;

  return Math.max(depreciatedValue, salvageValue); // Ensure value does not drop below salvage value
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

// Helper function to calculate current value
export const calculateCurrentValue = (
  initialValue: number,
  salvageValue: number,
  usefulLife: number,
  purchaseDate: Date
) => {
  const ageInYears =
    (new Date().getTime() - new Date(purchaseDate).getTime()) /
    (1000 * 60 * 60 * 24 * 365.25);
  const depreciationPerYear = (initialValue - salvageValue) / usefulLife;
  const depreciatedValue = initialValue - depreciationPerYear * ageInYears;
  return depreciatedValue.toFixed(2);
};
