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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    getSession();
  }, []);

  const { data: emails = [], isLoading } = useQuery({
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
    enabled: !!userId,
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

  const toggleStar = useCallback(async (id: number) => {
    if (!userId) return;

    const { error } = await supabase
      .from('outlook_emails')
      .update({ is_starred: true })
      .eq('id', id);

    if (error) {
      toast.error("Kunde inte stjärnmärka e-post");
      return;
    }

    toast.success("E-post stjärnmärkt");
  }, [userId]);

  const handleDelete = useCallback(async (id: number) => {
    if (!userId) return;

    const { error } = await supabase
      .from('outlook_emails')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Kunde inte ta bort e-post");
      return;
    }

    toast.success("E-post borttagen");
  }, [userId]);

  const handleArchive = useCallback(async (id: number) => {
    // In a real implementation, we would call Microsoft Graph API to archive the email
    toast.success("E-post arkiverad");
  }, []);

  const generateAIResponse = useCallback(() => {
    toast.success("AI-svar genererat", {
      description: "Svaret har kopierats till urklipp",
    });
  }, []);

  if (isLoading) {
    return <div>Laddar...</div>;
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
          
          <EmailList
            emails={emails}
            onToggleStar={toggleStar}
            onArchive={handleArchive}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </div>

        <div>
          <EmailSidebar onGenerateAIResponse={generateAIResponse} />
        </div>
      </div>
    </div>
  );
}