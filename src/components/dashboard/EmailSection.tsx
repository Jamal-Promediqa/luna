import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ChevronRight, PenSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EmailLinkAccount } from "./EmailLinkAccount";
import { ComposeEmail } from "./ComposeEmail";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const EmailSection = () => {
  const [isMicrosoftLinked, setIsMicrosoftLinked] = useState(false);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log("Checking session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        setConnectionError("Failed to check session status");
        return null;
      }

      const hasMicrosoftProvider = session?.user?.app_metadata?.provider === 'azure';
      console.log("Microsoft linked status:", hasMicrosoftProvider);
      console.log("User metadata:", session?.user?.app_metadata);
      
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

      console.log("Fetching emails...");
      const { data, error } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Email fetch error:", error);
        setConnectionError("Failed to fetch emails");
        throw error;
      }
      
      console.log("Fetched emails:", data);
      return data;
    },
    enabled: !!session && isMicrosoftLinked
  });

  const syncEmails = async () => {
    try {
      console.log("Starting email sync...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No session found for sync");
        toast.error("Please sign in to sync emails");
        return;
      }

      const { error } = await supabase.functions.invoke('sync-outlook-emails', {
        body: { userId: session.user.id }
      });

      if (error) {
        console.error("Sync error:", error);
        toast.error("Failed to sync emails");
        throw error;
      }

      toast.success('Emails synced successfully');
      refetch();
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast.error('Failed to sync emails');
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
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={syncEmails}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComposeDialog(true)}
            >
              <PenSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              View all
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading emails...</p>
              </div>
            ) : emails && emails.length > 0 ? (
              <div className="space-y-4">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Mail className={`h-5 w-5 mt-0.5 ${email.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-none ${!email.is_read && 'font-medium'}`}>
                        {email.subject || '(No subject)'}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {email.body_preview}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          From: {email.from_address}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(email.received_at), 'MMM d, HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Mail className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No emails to display</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <ComposeEmail
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
      />
    </>
  );
};