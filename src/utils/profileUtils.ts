import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ensureUserProfile = async (userId: string) => {
  try {
    // Get user email first
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error("Error getting user:", userError);
      return false;
    }

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking profile:", checkError);
      toast.error("Could not check user profile");
      return false;
    }

    // If profile exists, return true
    if (existingProfile) {
      return true;
    }

    // Profile doesn't exist, try to create it with default preferences
    const defaultName = user?.email?.split('@')[0] || 'User';
    const { error: insertError } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        given_name: defaultName,
        full_name: defaultName,
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
      }, {
        onConflict: 'user_id'
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