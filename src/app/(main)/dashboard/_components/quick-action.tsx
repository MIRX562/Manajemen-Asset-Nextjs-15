"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, BarChart3, FileSearch, Settings } from "lucide-react";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

function QuickActionButton({ icon: Icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="h-24 flex flex-col items-center justify-center space-y-2 bg-background hover:bg-secondary"
      onClick={onClick}
    >
      <Icon className="h-8 w-8" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}

export function QuickActions() {
  const actions: QuickActionProps[] = [
    {
      icon: PlusCircle,
      label: "Add Asset",
      onClick: () => console.log("Add Asset clicked"),
    },
    {
      icon: BarChart3,
      label: "Portfolio",
      onClick: () => console.log("Portfolio clicked"),
    },
    {
      icon: FileSearch,
      label: "Reports",
      onClick: () => console.log("Reports clicked"),
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
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
