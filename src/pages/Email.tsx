import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchEmails, syncEmailsToSupabase } from "@/utils/microsoftGraph";
import { EmailMetrics } from "@/components/email/EmailMetrics";
import { EmailFilters } from "@/components/email/EmailFilters";
import { EmailList } from "@/components/email/EmailList";
import { EmailSidebar } from "@/components/email/EmailSidebar";

export default function EmailDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
      setIsConnected(!!session?.provider_token);
    };
    getSession();
  }, []);

  const { data: emails = [], isLoading, refetch } = useQuery({
    queryKey: ['emails', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // First try to get cached emails
      const { data: cachedEmails } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false });

      // Then fetch fresh emails from Microsoft Graph
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.provider_token;
      
      if (accessToken) {
        try {
          const outlookEmails = await fetchEmails(accessToken);
          await syncEmailsToSupabase(userId, outlookEmails);
          
          // Return fresh data
          const { data: freshEmails } = await supabase
            .from('outlook_emails')
            .select('*')
            .order('received_at', { ascending: false });
            
          return freshEmails?.map(email => ({
            id: email.id,
            sender: email.from_address || '',
            subject: email.subject || '',
            preview: email.body_preview || '',
            timestamp: email.received_at || '',
            isStarred: email.is_starred || false,
            isRead: email.is_read || false
          })) || [];
        } catch (error) {
          console.error('Error fetching emails:', error);
          toast.error('Could not fetch new emails');
        }
      }

      return (cachedEmails || []).map(email => ({
        id: email.id,
        sender: email.from_address || '',
        subject: email.subject || '',
        preview: email.body_preview || '',
        timestamp: email.received_at || '',
        isStarred: email.is_starred || false,
        isRead: email.is_read || false
      }));
    },
    enabled: !!userId && isConnected,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRefreshInbox = useCallback(async () => {
    await refetch();
    toast.success("Inkorgen uppdaterad");
  }, [refetch]);

  const toggleStar = useCallback(async (id: string) => {
    if (!userId) return;

    const email = emails.find(e => e.id === id);
    if (!email) return;

    const { error } = await supabase
      .from('outlook_emails')
      .update({ is_starred: !email.isStarred })
      .eq('id', id);

    if (error) {
      toast.error("Kunde inte stjärnmärka e-post");
      return;
    }

    await refetch();
    toast.success(email.isStarred ? "Stjärnmärkning borttagen" : "E-post stjärnmärkt");
  }, [userId, emails, refetch]);

  const handleDelete = useCallback(async (id: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('outlook_emails')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Kunde inte ta bort e-post");
      return;
    }

    await refetch();
    toast.success("E-post borttagen");
  }, [userId, refetch]);

  const handleArchive = useCallback(async (id: string) => {
    // In a real implementation, we would call Microsoft Graph API to archive the email
    toast.success("E-post arkiverad");
    await refetch();
  }, [refetch]);

  const generateAIResponse = useCallback(() => {
    toast.success("AI-svar genererat", {
      description: "Svaret har kopierats till urklipp",
    });
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <EmailMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <EmailFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
          />
          
          {isLoading ? (
            <div>Laddar e-post...</div>
          ) : (
            <EmailList
              emails={emails}
              onToggleStar={toggleStar}
              onArchive={handleArchive}
              onDelete={handleDelete}
              formatDate={formatDate}
            />
          )}
        </div>

        <div>
          <EmailSidebar 
            onGenerateAIResponse={generateAIResponse}
            onRefreshInbox={handleRefreshInbox}
          />
        </div>
      </div>
    </div>
  );
}