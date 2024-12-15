import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ensureUserProfile = async (userId: string) => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    // If profile exists, return true
    if (existingProfile) return true;

    // Profile doesn't exist, create it with default preferences
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
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
      });

    if (insertError) {
      console.error("Error creating profile:", insertError);
      toast.error("Could not create user profile");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error ensuring user profile:", error);
    toast.error("Could not create user profile");
    return false;
  }
};