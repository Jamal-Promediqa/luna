import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useEmailAuth } from "@/components/email/hooks/useEmailAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { isConnected, isInitialized } = useEmailAuth();
  const [givenName, setGivenName] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
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
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("given_name, full_name")
          .eq("user_id", session.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setGivenName(profile.given_name || "");
          setFullName(profile.full_name || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
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
          given_name: givenName,
          full_name: fullName,
          updated_at: new Date().toISOString(),
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
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

      <Card>
        <CardHeader>
          <CardTitle>Email Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Microsoft Account Status</span>
            <span className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isInitialized ? (isConnected ? 'Connected' : 'Not Connected') : 'Checking...'}
            </span>
          </div>
          <Button
            onClick={() => navigate("/email")}
            variant="outline"
            className="w-full"
          >
            Manage Email Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Email: {userEmail}
            </p>
          </div>
          <Separator className="my-4" />
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;