import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentUpdatesWidget() {
  const recentUpdates = [
    {
      id: 1,
      item: "Widget A",
      action: "Quantity updated",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      item: "Gadget B",
      action: "Added to inventory",
      timestamp: "5 hours ago",
    },
    { id: 3, item: "Tool C", action: "Price updated", timestamp: "1 day ago" },
  ];

  return (
    <Card className="h-[260px] flex flex-col col-span-2">
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
                {update.timestamp}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
