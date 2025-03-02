import { getAssetById } from "@/actions/assets-actions";
import AssetOverview from "./_components/asset-overview";
import AssetTabs from "./_components/asset-tabs";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = params.slug;
  const id = parseInt(searchParams.id);

  const data = await getAssetById(id);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-3xl font-bold">{decodeURI(slug)}</h1>
      <AssetOverview assetData={data} />
      <AssetTabs assetData={data} />
    </div>
  );
}
