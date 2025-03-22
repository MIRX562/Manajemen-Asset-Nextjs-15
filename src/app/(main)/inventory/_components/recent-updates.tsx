import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecentInventoryActivities } from "@/actions/analytics-actions";
import { formatDistanceToNow } from "date-fns";

export default async function MostUsedItems() {
  const recentUpdates = await getRecentInventoryActivities();

  return (
    <Card className="h-[260px] flex flex-col col-span-2 pb-3">
      <CardHeader>
        <CardTitle>Recent Updates</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <ul className="space-y-4">
          {recentUpdates.map((update) => (
            <li key={update.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{update.item}</p>
                <p className="text-sm text-muted-foreground">{update.action}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(update.timestamp))}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
