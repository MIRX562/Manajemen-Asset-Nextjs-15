import { getInventoryItemById } from "@/actions/inventory-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarIcon,
  LifeBuoyIcon,
  DollarSignIcon,
  TagIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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

  const data = await getInventoryItemById(id);

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <h1 className="text-3xl font-bold">{decodeURI(slug)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Category</CardTitle>
            <TagIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.category}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantity</CardTitle>
            <LifeBuoyIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.quantity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Value</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              total value : {formatCurrency(data.quantity * data.unit_price)}
            </div>
            <div className="text-lg">
              per unit price : {formatCurrency(data.unit_price)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              threshold : {data.reorder_level}
            </div>

            {data.quantity <= data.reorder_level ? (
              <div className="text-destructive">Need to Restock !!!</div>
            ) : (
              <div className="text-emerald-600 dark:text-emerald-300">
                No Need to Restock
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Location</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.location?.name}</div>
            <div className="">Address : {data.location?.address}</div>
          </CardContent>
        </Card>
      </div>
      <div className="text-2xl font-bold">Maintenance usage history (todo)</div>
    </div>
  );
}
