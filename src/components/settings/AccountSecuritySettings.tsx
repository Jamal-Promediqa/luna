import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Shield, History } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const AccountSecuritySettings = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      // In a real application, you would fetch the session history from your backend
      // For now, we'll just show the current session
      setSessions([{
        id: 1,
        device: "Current Browser",
        lastActive: new Date().toISOString(),
        location: "Unknown"
      }]);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error("Could not load session history");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error("Could not update password");
    }
  };

  const handleViewSessions = () => {
    toast.info("Session history loaded");
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
        {!showPasswordChange ? (
          <Button
            onClick={() => setShowPasswordChange(true)}
            variant="outline"
            className="w-full"
          >
            <Lock className="mr-2 h-4 w-4" />
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePasswordChange} className="flex-1">
                Update Password
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordChange(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={handleViewSessions}
          variant="outline"
          className="w-full"
        >
          <History className="mr-2 h-4 w-4" />
          View Login History
        </Button>

        {sessions.length > 0 && (
          <div className="mt-4 space-y-4">
            <Label>Active Sessions</Label>
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{session.device}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.lastActive).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Location: {session.location}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};