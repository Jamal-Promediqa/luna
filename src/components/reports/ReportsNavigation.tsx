import { Button } from "@/components/ui/button";
import { Home, Users, List, FileCheck, Settings, Mic } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface ReportsNavigationProps {
  navigate: NavigateFunction;
}

export const ReportsNavigation = ({ navigate }: ReportsNavigationProps) => {
  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Mic className="h-4 w-4" />, text: "AI Transcriptions", path: "/ai-transcriptions" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <List className="h-4 w-4" />, text: "Ring Lista", path: "/ring-lista" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
  ];

  return (
    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
      {navigationItems.map((item) => (
        <Button
          key={item.text}
          variant="ghost"
          className="whitespace-nowrap"
          onClick={() => navigate(item.path)}
        >
          {item.icon}
          <span className="ml-2">{item.text}</span>
        </Button>
      ))}
    </div>
  );
};