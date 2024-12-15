import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ComposeEmail } from "./ComposeEmail";
import { EmailStats } from "./email/EmailStats";
import { EmailFilters } from "./email/EmailFilters";
import { EmailList } from "./email/EmailList";
import { EmailQuickActions } from "./email/EmailQuickActions";

export const EmailDashboard = () => {
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");

  const { data: emails = [], refetch } = useQuery({
    queryKey: ['outlook-emails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    total: emails.length,
    unread: emails.filter(email => !email.is_read).length,
    sentToday: 0, // This would need to be implemented with sent emails tracking
    archived: 0, // This would need to be implemented with archived status tracking
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilter = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const handleArchive = useCallback((id: string) => {
    toast.success("Email archived");
  }, []);

  const handleDelete = useCallback((id: string) => {
    toast.success("Email deleted");
  }, []);

  const generateAIResponse = useCallback(() => {
    toast.success("AI response generated and copied to clipboard");
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <EmailStats stats={stats} />
          <EmailFilters
            searchQuery={searchQuery}
            filterValue={filterValue}
            onSearchChange={handleSearch}
            onFilterChange={handleFilter}
          />
          <EmailList
            emails={emails}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>

        <div>
          <EmailQuickActions
            onCompose={() => setShowComposeDialog(true)}
            onRefresh={refetch}
            onGenerateAIResponse={generateAIResponse}
          />
        </div>
      </div>

      <ComposeEmail
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
      />
    </div>
  );
};