import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchEmails, syncEmailsToSupabase } from "@/utils/microsoftGraph";
import { EmailList } from "./EmailList";
import { EmailSidebar } from "./EmailSidebar";
import { EmailHeader } from "./EmailHeader";

export const EmailContainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        setIsConnected(!!session.provider_token);
      }
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUserId(session?.user?.id ?? null);
        setIsConnected(!!session?.provider_token);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setIsConnected(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: emails = [], isLoading, error, refetch } = useQuery({
    queryKey: ['emails', userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user found");
      
      try {
        // First try to get cached emails
        const { data: cachedEmails, error: cacheError } = await supabase
          .from('outlook_emails')
          .select('*')
          .eq('user_id', userId)
          .order('received_at', { ascending: false });

        if (cacheError) {
          console.error('Cache error:', cacheError);
          toast.error('Could not fetch cached emails');
          throw cacheError;
        }

        // Then fetch fresh emails from Microsoft Graph
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.provider_token;
        
        if (accessToken) {
          try {
            const outlookEmails = await fetchEmails(accessToken);
            await syncEmailsToSupabase(userId, outlookEmails);
            
            // Return fresh data
            const { data: freshEmails, error: freshError } = await supabase
              .from('outlook_emails')
              .select('*')
              .eq('user_id', userId)
              .order('received_at', { ascending: false });
              
            if (freshError) {
              console.error('Fresh emails error:', freshError);
              toast.error('Could not fetch new emails');
              throw freshError;
            }
            
            return (freshEmails || []).map(email => ({
              id: email.id,
              sender: email.from_address || '',
              subject: email.subject || '',
              preview: email.body_preview || '',
              timestamp: email.received_at || '',
              isStarred: email.is_starred || false,
              isRead: email.is_read || false
            }));
          } catch (error) {
            console.error('Error fetching fresh emails:', error);
            toast.error('Could not sync with Microsoft. Using cached emails.');
            
            // Return cached emails as fallback
            return (cachedEmails || []).map(email => ({
              id: email.id,
              sender: email.from_address || '',
              subject: email.subject || '',
              preview: email.body_preview || '',
              timestamp: email.received_at || '',
              isStarred: email.is_starred || false,
              isRead: email.is_read || false
            }));
          }
        }

        // Return cached emails if no Microsoft token
        if (!accessToken) {
          toast.error('Microsoft account not connected. Please connect your account.');
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
      } catch (error) {
        console.error('Error in email query:', error);
        toast.error('Could not fetch emails. Please try again.');
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
  });

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handleRefreshInbox = useCallback(async () => {
    try {
      await refetch();
      toast.success("Inkorgen uppdaterad");
    } catch (error) {
      console.error('Error refreshing inbox:', error);
      toast.error("Kunde inte uppdatera inkorgen");
    }
  }, [refetch]);

  const toggleStar = useCallback(async (id: string) => {
    if (!userId) {
      toast.error("No user found");
      return;
    }

    try {
      const email = emails.find(e => e.id === id);
      if (!email) {
        toast.error("Email not found");
        return;
      }

      const { error } = await supabase
        .from('outlook_emails')
        .update({ is_starred: !email.isStarred })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await refetch();
      toast.success(email.isStarred ? "Stjärnmärkning borttagen" : "E-post stjärnmärkt");
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error("Kunde inte stjärnmärka e-post");
    }
  }, [userId, emails, refetch]);

  const handleDelete = useCallback(async (id: string) => {
    if (!userId) {
      toast.error("No user found");
      return;
    }

    try {
      const { error } = await supabase
        .from('outlook_emails')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await refetch();
      toast.success("E-post borttagen");
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error("Kunde inte ta bort e-post");
    }
  }, [userId, refetch]);

  const handleArchive = useCallback(async (id: string) => {
    toast.success("E-post arkiverad");
    await refetch();
  }, [refetch]);

  const generateAIResponse = useCallback(() => {
    toast.success("AI-svar genererat", {
      description: "Svaret har kopierats till urklipp",
    });
  }, []);

  if (!userId) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <EmailHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Sök i inkorgen..."
              className="flex-1 px-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="alla">Alla</option>
              <option value="olasta">Olästa</option>
              <option value="stjarnmarkta">Stjärnmärkta</option>
            </select>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">
              Ett fel uppstod vid hämtning av e-post. Försök igen senare.
            </div>
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
};