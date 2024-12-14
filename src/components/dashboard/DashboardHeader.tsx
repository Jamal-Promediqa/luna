import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  profile: any;
  onSignOut: () => void;
}

export const DashboardHeader = ({ profile, onSignOut }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Välkommen tillbaka, {profile?.given_name || 'Användare'}</h1>
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
        <Button variant="ghost" size="icon" onClick={onSignOut}>
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};