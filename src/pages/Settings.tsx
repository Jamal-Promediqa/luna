import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AccountSecuritySettings } from "@/components/settings/AccountSecuritySettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { RegionalSettings } from "@/components/settings/RegionalSettings";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserRound, Trash2 } from "lucide-react";
import { ensureUserProfile } from "@/utils/profileUtils";

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [givenName, setGivenName] = useState("");
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error("Session error:", error);
        navigate("/login");
        return;
      }

      setUserEmail(session.user.email);

      try {
        // Ensure profile exists before loading data
        const profileExists = await ensureUserProfile(session.user.id);
        if (!profileExists) {
          toast.error("Could not load profile");
          return;
        }

        // Load profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("given_name, full_name")
          .eq("user_id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error loading profile:", profileError);
          toast.error("Could not load profile information");
          return;
        }

        if (profile) {
          setGivenName(profile.given_name || "");
          setFullName(profile.full_name || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Could not load profile information");
      }
    };

    checkSession();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        toast.error("No active session found");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: session.user.id,
          given_name: givenName || session.user.email?.split('@')[0],
          full_name: fullName || session.user.email?.split('@')[0],
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Could not sign out");
    }
  };

  const handleDeleteAccount = () => {
    toast.info("Account deletion functionality coming soon");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        <DashboardNavigation navigate={navigate} />
        
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="givenName">Given Name</Label>
                <Input
                  id="givenName"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  placeholder="Enter your given name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>

          <AccountSecuritySettings />
          <NotificationSettings />
          <ThemeSettings />
          <RegionalSettings />

          <Card>
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator className="my-4" />
              <div className="space-y-4">
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full"
                >
                  Sign Out
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="w-full text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;