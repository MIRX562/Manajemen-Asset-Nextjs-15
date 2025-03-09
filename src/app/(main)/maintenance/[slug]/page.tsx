import { getMaintenanceById } from "@/actions/maintenance-actions";
import MaintenanceDetailView from "./main";

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

  return <MaintenanceDetailView maintenance={data} />;
}
