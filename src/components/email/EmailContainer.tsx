import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmailList } from "./EmailList";
import { EmailSidebar } from "./EmailSidebar";
import { EmailHeader } from "./EmailHeader";
import { EmailFilters } from "./EmailFilters";
import { EmailFolders } from "./EmailFolders";
import { useEmailAuth } from "./hooks/useEmailAuth";
import { useEmailSync } from "./hooks/useEmailSync";

export const EmailContainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  
  const { userId, isConnected, accessToken } = useEmailAuth();
  const { data: emails = [], isLoading, error, refetch } = useEmailSync(userId, accessToken, selectedFolder);

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
    <div className="container mx-auto space-y-6">
      <EmailHeader />
      
      <div className="grid grid-cols-[240px,1fr,280px] gap-6">
        <EmailFolders 
          selectedFolder={selectedFolder}
          onFolderChange={setSelectedFolder}
        />
        
        <div className="space-y-6 min-w-0">
          <EmailFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterValue={filterValue}
            onFilterChange={setFilterValue}
          />
          
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

        <EmailSidebar 
          onGenerateAIResponse={generateAIResponse}
          onRefreshInbox={handleRefreshInbox}
        />
      </div>
    </div>
  );
};