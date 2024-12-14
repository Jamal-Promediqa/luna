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

export const EmailSection = () => {
  const [isMicrosoftLinked, setIsMicrosoftLinked] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setConnectionError("Failed to check session status");
        return null;
      }

      const hasMicrosoftProvider = session?.user?.app_metadata?.provider === 'azure';
      setIsMicrosoftLinked(!!hasMicrosoftProvider);
      return session;
    }
  });

  const { data: emails, isLoading, refetch } = useQuery({
    queryKey: ['outlook-emails'],
    queryFn: async () => {
      if (!session || !isMicrosoftLinked) return null;

      const { data, error } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(5);

      if (error) {
        setConnectionError("Failed to fetch emails");
        throw error;
      }
      
      return data;
    },
    enabled: !!session && isMicrosoftLinked
  });

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
          <EmailList emails={emails} isLoading={isLoading} />
        </CardContent>
      </Card>
      <ComposeEmail
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
      />
    </>
  );
};