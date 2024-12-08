import { getAssetById } from "@/actions/assets-actions";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const slug = await params.slug;
  const id = parseInt(searchParams.id);

  const data = await getAssetById(id);

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <h1 className="text-3xl font-bold">{decodeURI(slug)}</h1>
    </div>
  );
}
