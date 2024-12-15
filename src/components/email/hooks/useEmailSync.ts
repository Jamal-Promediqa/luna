import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchEmails, syncEmailsToSupabase } from "@/utils/microsoftGraph";
import { toast } from "sonner";

export const useEmailSync = (userId: string | null, accessToken: string | null) => {
  return useQuery({
    queryKey: ['emails', userId, accessToken],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID found");
        throw new Error("No user found");
      }
      
      try {
        console.log("Starting email fetch process");
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

        console.log("Cached emails found:", cachedEmails?.length || 0);

        // Then fetch fresh emails if we have an access token
        if (accessToken) {
          try {
            console.log("Attempting to fetch fresh emails with token");
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

            console.log("Fresh emails synced and fetched:", freshEmails?.length || 0);
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
            console.error('Error fetching fresh emails:', error);
            toast.error('Could not sync with Microsoft. Using cached emails.');
            
            // Return cached emails as fallback
            return cachedEmails?.map(email => ({
              id: email.id,
              sender: email.from_address || '',
              subject: email.subject || '',
              preview: email.body_preview || '',
              timestamp: email.received_at || '',
              isStarred: email.is_starred || false,
              isRead: email.is_read || false
            })) || [];
          }
        }

        // Return cached emails if no Microsoft token
        if (!accessToken) {
          console.log("No access token available - using cached emails only");
          toast.error('Microsoft account not connected. Please connect your account to sync emails.');
        }

        return cachedEmails?.map(email => ({
          id: email.id,
          sender: email.from_address || '',
          subject: email.subject || '',
          preview: email.body_preview || '',
          timestamp: email.received_at || '',
          isStarred: email.is_starred || false,
          isRead: email.is_read || false
        })) || [];
      } catch (error) {
        console.error('Error in email query:', error);
        toast.error('Could not fetch emails. Please try again.');
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
  });
};