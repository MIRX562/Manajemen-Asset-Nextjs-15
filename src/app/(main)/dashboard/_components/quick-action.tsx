import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BarChart3, FileSearch, Settings } from "lucide-react";
import Link from "next/link";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  url: string;
}

function QuickActionButton({ icon: Icon, label, url }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center space-y-2 bg-background hover:bg-secondary"
      asChild
    >
      <Link href={url}>
        <Icon className="h-8 w-8" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </Button>
  );
}

export function QuickActions() {
  const actions: QuickActionProps[] = [
    {
      icon: PlusCircle,
      label: "Add Asset",
      url: "/assets",
    },
    {
      icon: BarChart3,
      label: "Add Location",
      url: "/locations",
    },
    {
      icon: FileSearch,
      label: "Reports",
      url: "/reports",
    },
    {
      icon: Settings,
      label: "Settings",
      url: "/settings",
    },
    {
      icon: FileSearch,
      label: "Maintenance",
      url: "/maintenance",
    },
    {
      icon: Settings,
      label: "Inventory",
      url: "/inventory",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickActionButton key={index} {...action} />
        ))}
      </CardContent>
    </Card>
  );
}
