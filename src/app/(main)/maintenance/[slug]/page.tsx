import { getMaintenanceById } from "@/actions/maintenance-actions";
import MaintenanceDetailView from "./main";
import { getAvailableAssetsIncludeId } from "@/actions/assets-actions";
import { getAvailableInventoryItems } from "@/actions/inventory-actions";

export const dynamic = "force-dynamic";
type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const id = parseInt(searchParams.id);

  const data = await getMaintenanceById(id);
  const assets = await getAvailableAssetsIncludeId(data.asset.id);
  const inventory = await getAvailableInventoryItems();
  const secondData = { assets: assets, inventoryItems: inventory };

  return <MaintenanceDetailView maintenance={data} data={secondData} />;
}
