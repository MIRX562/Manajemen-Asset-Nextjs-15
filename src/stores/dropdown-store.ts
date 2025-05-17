// Zustand store for dropdown data (assetTypes, locations, mechanics)
import { create } from "zustand";

type AssetType = {
  id: number;
  model: string;
  manufacturer: string;
  category: string;
};

type Location = { id: number; name: string; address: string; type: string };

type User = { id: number; username: string };

interface DropdownState {
  assetTypes: AssetType[];
  locations: Location[];
  mechanics: User[];
  fetchDropdownData: () => Promise<void>;
}

export const useDropdownStore = create<DropdownState>((set) => ({
  assetTypes: [],
  locations: [],
  mechanics: [],
  fetchDropdownData: async () => {
    try {
      const [assetTypesRes, locationsRes, mechanicRes] = await Promise.all([
        fetch("/api/asset-types").then((res) => res.json()),
        fetch("/api/locations").then((res) => res.json()),
        fetch("/api/mechanics").then((res) => res.json()),
      ]);
      set({
        assetTypes: assetTypesRes.types,
        locations: locationsRes.locations,
        mechanics: mechanicRes.mechanics,
      });
    } catch (error) {
      console.error("Failed to fetch dropdown data", error);
    }
  },
}));
