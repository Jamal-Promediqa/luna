import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchEmails, syncEmailsToSupabase } from "@/utils/microsoftGraph";
import { toast } from "sonner";

export const useEmailSync = (userId: string | null, accessToken: string | null, folder: string = 'inbox') => {
  return useQuery({
    queryKey: ['emails', userId, accessToken, folder],
    queryFn: async () => {
      if (!userId) {
        console.log("No user ID found");
        throw new Error("No user found");
      }
      
      try {
        console.log(`Starting email fetch process for folder: ${folder}`);
        
        // First check if we have a valid access token
        if (!accessToken) {
          console.log("No access token available - please connect Microsoft account");
          toast.error('Microsoft account not connected', {
            description: 'Please connect your Microsoft account in the sidebar to sync your emails.',
            duration: 7000
          });
          return [];
        }

        // Then try to get cached emails for the selected folder
        const { data: cachedEmails, error: cacheError } = await supabase
          .from('outlook_emails')
          .select('*')
          .eq('user_id', userId)
          .eq('status', folder)
          .order('received_at', { ascending: false });

        if (cacheError) {
          console.error('Cache error:', cacheError);
          toast.error('Could not fetch cached emails', {
            description: cacheError.message,
            duration: 5000
          });
          throw cacheError;
        }

        console.log(`Cached emails found for folder ${folder}:`, cachedEmails?.length || 0);

        try {
          console.log(`Attempting to fetch fresh emails for folder ${folder}`);
          const outlookEmails = await fetchEmails(accessToken, folder);
          console.log(`Successfully fetched ${outlookEmails.length} emails from Microsoft`);
          
          await syncEmailsToSupabase(userId, outlookEmails, folder);
          console.log('Successfully synced emails to Supabase');
          
          // Return fresh data for the selected folder
          const { data: freshEmails, error: freshError } = await supabase
            .from('outlook_emails')
            .select('*')
            .eq('user_id', userId)
            .eq('status', folder)
            .order('received_at', { ascending: false });
            
          if (freshError) {
            console.error('Fresh emails error:', freshError);
            toast.error('Could not fetch new emails', {
              description: freshError.message,
              duration: 5000
            });
            throw freshError;
          }

          console.log(`Returning ${freshEmails?.length || 0} fresh emails`);
          return freshEmails?.map(email => ({
            id: email.id,
            sender: email.from_address || '',
            subject: email.subject || '',
            preview: email.body_preview || '',
            timestamp: email.received_at || '',
            isStarred: email.is_starred || false,
            isRead: email.is_read || false
          })) || [];
        } catch (error: any) {
          console.error('Error syncing with Microsoft:', error);
          
          // Check if it's an authentication error
          if (error.message?.includes('401') || error.message?.includes('authentication')) {
            toast.error('Microsoft authentication expired', {
              description: 'Please reconnect your Microsoft account in the sidebar.',
              duration: 7000
            });
            return [];
          }
          
          // For other errors, use cached emails as fallback
          toast.error('Could not sync with Microsoft', {
            description: 'Using cached emails. Please check your connection.',
            duration: 5000
          });
          
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
      } catch (error: any) {
        console.error('Error in email query:', error);
        toast.error('Could not fetch emails', {
          description: error?.message || 'Please try again later.',
          duration: 5000
        });
        throw error;
      }
    },
    enabled: !!userId,
    retry: 1,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};