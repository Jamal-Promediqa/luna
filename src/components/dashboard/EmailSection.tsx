import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ComposeEmail } from "./ComposeEmail";
import { EmailHeader } from "./email/EmailHeader";
import { EmailList } from "./email/EmailList";
import { EmailLinkAccount } from "./EmailLinkAccount";
import { toast } from "sonner";

export const EmailSection = () => {
  const [isMicrosoftLinked, setIsMicrosoftLinked] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session data:", session);
      
      if (error) {
        console.error("Session error:", error);
        setConnectionError("Failed to check session status");
        return null;
      }

      const hasMicrosoftProvider = session?.user?.app_metadata?.provider === 'azure';
      console.log("Has Microsoft provider:", hasMicrosoftProvider);
      setIsMicrosoftLinked(!!hasMicrosoftProvider);
      return session;
    }
  });

  const { data: emails, isLoading, refetch } = useQuery({
    queryKey: ['outlook-emails'],
    queryFn: async () => {
      if (!session || !isMicrosoftLinked) {
        console.log("Skipping email fetch - no session or Microsoft not linked");
        return null;
      }

      console.log("Fetching emails for user:", session.user.id);
      const { data, error } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching emails:", error);
        setConnectionError("Failed to fetch emails");
        throw error;
      }
      
      console.log("Fetched emails:", data);
      return data;
    },
    enabled: !!session && isMicrosoftLinked,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const handleArchive = async (id: string) => {
    try {
      const { error } = await supabase
        .from('outlook_emails')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;
      toast.success("Email archived");
      refetch();
    } catch (error) {
      console.error('Error archiving email:', error);
      toast.error("Failed to archive email");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('outlook_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Email deleted");
      refetch();
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error("Failed to delete email");
    }
  };

  if (sessionLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Checking connection status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isMicrosoftLinked) {
    return <EmailLinkAccount />;
  }

  if (connectionError) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>{connectionError}</AlertDescription>
          </Alert>
          <Button
            className="mt-4 w-full"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium">Recent Emails</CardTitle>
          <EmailHeader 
            onRefresh={refetch}
            onCompose={() => setShowComposeDialog(true)}
            isLoading={isLoading}
          />
        </CardHeader>
        <CardContent>
          <EmailList 
            emails={emails} 
            isLoading={isLoading}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <ComposeEmail
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
      />
    </>
  );
};