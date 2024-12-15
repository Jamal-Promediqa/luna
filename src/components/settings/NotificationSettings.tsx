import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [notificationSchedule, setNotificationSchedule] = useState("always");

  useEffect(() => {
    loadNotificationPreferences();
  }, []);

  const loadNotificationPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (profile?.notification_preferences) {
        const prefs = profile.notification_preferences;
        setEmailNotifications(prefs.email ?? true);
        setInAppNotifications(prefs.inApp ?? true);
        setNotificationSchedule(prefs.schedule ?? "always");
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast.error("Could not load notification preferences");
    }
  };

  const saveNotificationPreferences = async (
    email: boolean,
    inApp: boolean,
    schedule: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("No active session");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: {
            email,
            inApp,
            schedule
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error("Could not save notification preferences");
    }
  };

  const handleEmailToggle = (checked: boolean) => {
    setEmailNotifications(checked);
    saveNotificationPreferences(checked, inAppNotifications, notificationSchedule);
  };

  const handleInAppToggle = (checked: boolean) => {
    setInAppNotifications(checked);
    saveNotificationPreferences(emailNotifications, checked, notificationSchedule);
  };

  const handleScheduleChange = (value: string) => {
    setNotificationSchedule(value);
    saveNotificationPreferences(emailNotifications, inAppNotifications, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email updates
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={handleEmailToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>In-app Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Show notifications in app
            </p>
          </div>
          <Switch
            checked={inAppNotifications}
            onCheckedChange={handleInAppToggle}
          />
        </div>

        <div className="space-y-2">
          <Label>Notification Schedule</Label>
          <Select value={notificationSchedule} onValueChange={handleScheduleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Always</SelectItem>
              <SelectItem value="working-hours">Working Hours Only</SelectItem>
              <SelectItem value="custom">Custom Schedule</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};