import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EmailLinkAccount } from "./EmailLinkAccount";
import { useState } from "react";

export const EmailSection = () => {
  const [isMicrosoftLinked, setIsMicrosoftLinked] = useState(false);

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hasMicrosoftProvider = session?.user?.app_metadata?.providers?.includes('azure');
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

      if (error) throw error;
      return data;
    },
    enabled: !!session && isMicrosoftLinked
  });

  const syncEmails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      await supabase.functions.invoke('sync-outlook-emails', {
        body: { userId: session.user.id }
      });

      toast.success('Emails synced successfully');
      refetch();
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast.error('Failed to sync emails');
    }
  };

  if (!isMicrosoftLinked) {
    return <EmailLinkAccount />;
  }

  return (
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
  );
};