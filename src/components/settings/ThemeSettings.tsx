import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ThemeSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [uiDensity, setUiDensity] = useState("comfortable");
  const [colorScheme, setColorScheme] = useState("default");

  useEffect(() => {
    loadThemePreferences();
    // Apply dark mode on initial load
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  const loadThemePreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('theme_preferences')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;

      if (profile?.theme_preferences) {
        const prefs = profile.theme_preferences;
        setDarkMode(prefs.darkMode ?? false);
        setUiDensity(prefs.uiDensity ?? "comfortable");
        setColorScheme(prefs.colorScheme ?? "default");
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
      toast.error("Could not load theme preferences");
    }
  };

  const saveThemePreferences = async (
    isDarkMode: boolean,
    density: string,
    scheme: string
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
          theme_preferences: {
            darkMode: isDarkMode,
            uiDensity: density,
            colorScheme: scheme
          },
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;
      toast.success("Theme preferences updated");
    } catch (error) {
      console.error('Error saving theme preferences:', error);
      toast.error("Could not save theme preferences");
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
    saveThemePreferences(checked, uiDensity, colorScheme);
  };

  const handleUiDensityChange = (value: string) => {
    setUiDensity(value);
    saveThemePreferences(darkMode, value, colorScheme);
  };

  const handleColorSchemeChange = (value: string) => {
    setColorScheme(value);
    saveThemePreferences(darkMode, uiDensity, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <p className="text-sm text-muted-foreground">
              Toggle dark mode theme
            </p>
          </div>
          <Switch
            checked={darkMode}
            onCheckedChange={handleDarkModeToggle}
          />
        </div>

        <div className="space-y-2">
          <Label>UI Density</Label>
          <Select value={uiDensity} onValueChange={handleUiDensityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select density" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Color Scheme</Label>
          <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="purple">Purple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};