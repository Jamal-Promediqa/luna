import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Shield, History } from "lucide-react";
import { toast } from "sonner";

export const AccountSecuritySettings = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = () => {
    // Implement password change logic
    toast.info("Password change functionality coming soon");
  };

  const handleTwoFactorToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    toast.success(`Two-factor authentication ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleViewSessions = () => {
    // Implement view sessions logic
    toast.info("Session history view coming soon");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Button
            onClick={handlePasswordChange}
            variant="outline"
            className="w-full"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security
            </p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorToggle}
          />
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleViewSessions}
            variant="outline"
            className="w-full"
          >
            <History className="mr-2 h-4 w-4" />
            View Login History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};