import { Button } from "@/components/ui/button";
import { Home, Users, Briefcase, FileCheck, Settings, Bell } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface DashboardNavigationProps {
  navigate: NavigateFunction;
}

export const DashboardNavigation = ({ navigate }: DashboardNavigationProps) => {
  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads", path: "/leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" },
    { icon: <Bell className="h-4 w-4" />, text: "Notifikationer", path: "/notifications" }
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