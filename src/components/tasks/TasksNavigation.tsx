import { Button } from "@/components/ui/button";
import { Home, Settings, Users, Briefcase, FileCheck, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TasksNavigation = () => {
  const navigate = useNavigate();

  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads", path: "/leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Uppgifter och aktiviteter</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

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
    </>
  );
};