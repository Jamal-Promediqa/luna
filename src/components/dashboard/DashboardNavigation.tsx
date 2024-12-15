import { Button } from "@/components/ui/button";
import { Home, Users, List, FileCheck, Settings, Mic, Mail } from "lucide-react";
import { NavigateFunction, useLocation } from "react-router-dom";

interface DashboardNavigationProps {
  navigate: NavigateFunction;
}

export const DashboardNavigation = ({ navigate }: DashboardNavigationProps) => {
  const location = useLocation();
  
  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Mic className="h-4 w-4" />, text: "AI Transcriptions", path: "/ai-transcriptions" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <List className="h-4 w-4" />, text: "Ring Lista", path: "/ring-lista" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Mail className="h-4 w-4" />, text: "E-post", path: "/email" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
  ];

  return (
    <nav className="relative mb-8">
      <div className="flex gap-2 overflow-x-auto pb-4 px-2 scrollbar-hide">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.text}
              variant="ghost"
              className={`
                whitespace-nowrap px-4 py-2 transition-all duration-200
                hover:bg-accent/50 hover:text-accent-foreground
                ${isActive ? 'bg-accent text-accent-foreground font-medium shadow-sm' : 'text-muted-foreground'}
              `}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span className="ml-2">{item.text}</span>
            </Button>
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </nav>
  );
};