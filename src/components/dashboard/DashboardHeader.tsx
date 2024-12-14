import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DashboardDictationDialog } from "./DashboardDictationDialog";
import { LogoutButton } from "./LogoutButton";
import { NotificationDropdown } from "./header/NotificationDropdown";
import { UserWelcome } from "./header/UserWelcome";

interface DashboardHeaderProps {
  profile: any;
}

export const DashboardHeader = ({ profile }: DashboardHeaderProps) => {
  const [showDictationDialog, setShowDictationDialog] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      <UserWelcome givenName={profile?.given_name} />
      <div className="flex gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowDictationDialog(true)}
          className="relative"
        >
          <Mic className="h-5 w-5" />
        </Button>
        <NotificationDropdown />
        <LogoutButton />
      </div>

      <DashboardDictationDialog
        isOpen={showDictationDialog}
        onClose={() => setShowDictationDialog(false)}
      />
    </div>
  );
};