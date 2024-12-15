import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ensureUserProfile } from "@/utils/profileUtils";

export const RegionalSettings = () => {
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");

  useEffect(() => {
    loadRegionalPreferences();
  }, []);

  const loadRegionalPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      // Ensure profile exists before loading preferences
      const profileExists = await ensureUserProfile(session.user.id);
      if (!profileExists) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('regional_preferences')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (profile?.regional_preferences) {
        const prefs = profile.regional_preferences;
        setLanguage(prefs.language ?? "en");
        setTimezone(prefs.timezone ?? "UTC");
        setDateFormat(prefs.dateFormat ?? "YYYY-MM-DD");
      }
    } catch (error) {
      console.error('Error loading regional preferences:', error);
      toast.error("Could not load regional preferences");
    }
  };

  const saveRegionalPreferences = async (
    lang: string,
    tz: string,
    format: string
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
          regional_preferences: {
            language: lang,
            timezone: tz,
            dateFormat: format
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      toast.success("Regional preferences updated");
    } catch (error) {
      console.error('Error saving regional preferences:', error);
      toast.error("Could not save regional preferences");
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    saveRegionalPreferences(value, timezone, dateFormat);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    saveRegionalPreferences(language, value, dateFormat);
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value);
    saveRegionalPreferences(language, timezone, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Regional Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sv">Svenska</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Zone</Label>
          <Select value={timezone} onValueChange={handleTimezoneChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="Europe/Stockholm">Europe/Stockholm</SelectItem>
              <SelectItem value="Europe/London">Europe/London</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Format</Label>
          <Select value={dateFormat} onValueChange={handleDateFormatChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};