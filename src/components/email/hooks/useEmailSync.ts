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
          console.log("No access token available");
          toast.error('Microsoft account not connected', {
            description: 'Please connect your Microsoft account in the sidebar to sync your emails.',
            duration: 7000,
            action: {
              label: 'Connect',
              onClick: () => window.location.reload()
            }
          });
          return [];
        }

        // Try to get cached emails first
        const { data: cachedEmails, error: cacheError } = await supabase
          .from('outlook_emails')
          .select('*')
          .eq('user_id', userId)
          .eq('status', folder)
          .order('received_at', { ascending: false });

        if (cacheError) {
          console.error('Cache error:', cacheError);
          throw cacheError;
        }

        console.log(`Found ${cachedEmails?.length || 0} cached emails for folder ${folder}`);

        try {
          console.log('Attempting to sync with Microsoft...');
          const outlookEmails = await fetchEmails(accessToken, folder);
          
          if (outlookEmails && outlookEmails.length > 0) {
            await syncEmailsToSupabase(userId, outlookEmails, folder);
            console.log('Successfully synced emails with Microsoft');
            
            // Get fresh data after sync
            const { data: freshEmails, error: freshError } = await supabase
              .from('outlook_emails')
              .select('*')
              .eq('user_id', userId)
              .eq('status', folder)
              .order('received_at', { ascending: false });

            if (freshError) throw freshError;

            if (freshEmails && freshEmails.length === 0) {
              toast.warning('No emails found', {
                description: 'Your inbox appears to be empty.',
                duration: 5000
              });
            }

            return freshEmails?.map(email => ({
              id: email.id,
              sender: email.from_address || '',
              subject: email.subject || '',
              preview: email.body_preview || '',
              timestamp: email.received_at || '',
              isStarred: email.is_starred || false,
              isRead: email.is_read || false
            })) || [];
          } else {
            console.log('No new emails to sync');
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
          console.error('Error syncing with Microsoft:', error);
          
          if (error.message === 'authentication_failed' || error.message?.includes('401')) {
            toast.error('Microsoft authentication expired', {
              description: 'Please disconnect and reconnect your Microsoft account.',
              duration: 7000,
              action: {
                label: 'Retry',
                onClick: () => window.location.reload()
              }
            });
            return [];
          }
          
          if (error.message?.includes('400')) {
            toast.error('Connection error', {
              description: 'Please check your Microsoft account connection.',
              duration: 7000,
              action: {
                label: 'Reconnect',
                onClick: () => window.location.reload()
              }
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
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });
};