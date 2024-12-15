import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ensureUserProfile = async (userId: string) => {
  try {
    // First check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      // Profile doesn't exist, create it with default preferences
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{
          user_id: userId,
          given_name: "",
          full_name: "",
          notification_preferences: {
            email: true,
            inApp: true,
            schedule: "always"
          },
          theme_preferences: {
            darkMode: false,
            uiDensity: "comfortable",
            colorScheme: "default"
          },
          regional_preferences: {
            language: "en",
            timezone: "UTC",
            dateFormat: "YYYY-MM-DD"
          }
        }]);

      if (insertError) throw insertError;
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error ensuring user profile:", error);
    toast.error("Could not create user profile");
    return false;
  }
};