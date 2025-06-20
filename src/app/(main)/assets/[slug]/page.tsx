import { getAssetById } from "@/actions/asset-actions";
import AssetOverview from "./_components/asset-overview";
import AssetTabs from "./_components/asset-tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditAssetForm from "../_components/form-edit";

export const dynamic = "force-dynamic";
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
    <div className="flex flex-col gap-4 mt-6">
      <div className="mb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            asChild
            variant="default"
            size="icon"
            className="flex items-center shadow-md"
          >
            <Link href="/assets">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl md:text-3xl font-bold">
            {decodeURI(slug)} - Details
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md">
              <Edit className="h-4 w-4" />
              Edit Asset
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Edit Asset</DialogTitle>
            <div className="max-h-[80svh] overflow-y-scroll">
              <EditAssetForm data={data} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <AssetOverview assetData={data} />
      <AssetTabs assetData={data} />
    </div>
  );
}
