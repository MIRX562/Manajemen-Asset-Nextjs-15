import { createContext, useContext, useEffect, useState } from "react";

type AssetType = {
  id: number;
  model: string;
  manufacturer: string;
  category: string;
};
type Location = { id: number; name: string; address: string; type: string };

type DropdownContextType = {
  assetTypes: AssetType[];
  locations: Location[];
};

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

export const DropdownProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [assetTypesRes, locationsRes] = await Promise.all([
          fetch("/api/asset-types").then((res) => res.json()),
          fetch("/api/locations").then((res) => res.json()),
        ]);
        setAssetTypes(assetTypesRes.types);
        setLocations(locationsRes.locations);
      } catch (error) {
        console.error("Failed to fetch dropdown data", error);
      } finally {
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <DropdownContext.Provider value={{ assetTypes, locations }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("useDropdownContext must be used within DropdownProvider");
  }
  return context;
};
