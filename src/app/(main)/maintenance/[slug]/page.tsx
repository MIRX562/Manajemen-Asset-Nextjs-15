import { getMaintenanceById } from "@/actions/maintenance-actions";
import MaintenanceDetailView from "./main";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = await params.slug;
  const id = parseInt(slug);

  const data = await getMaintenanceById(id);

  return <MaintenanceDetailView maintenance={data} />;
}
