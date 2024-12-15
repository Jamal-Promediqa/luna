import { useState } from "react";
import { EmailSection } from "./EmailSection";
import { EmailStats } from "./email/EmailStats";
import { EmailFilters } from "./email/EmailFilters";
import { EmailQuickActions } from "./email/EmailQuickActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmailDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  const { data: emailStats } = useQuery({
    queryKey: ['email-stats'],
    queryFn: async () => {
      if (!session?.user) return null;

      const { count: total } = await supabase
        .from('outlook_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      const { count: unread } = await supabase
        .from('outlook_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: sentToday } = await supabase
        .from('outlook_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .gte('created_at', today.toISOString());

      const { count: archived } = await supabase
        .from('outlook_emails')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id)
        .eq('status', 'archived');

      return {
        total: total || 0,
        unread: unread || 0,
        sentToday: sentToday || 0,
        archived: archived || 0
      };
    },
    enabled: !!session?.user
  });

  const handleSync = async () => {
    if (!session?.user) {
      toast.error("Please sign in to sync emails");
      return;
    }

    try {
      toast.loading("Syncing emails...");
      
      const { data, error } = await supabase.functions.invoke('sync-outlook-emails', {
        body: { userId: session.user.id }
      });

      if (error) throw error;

      toast.dismiss();
      toast.success(`Successfully synced ${data.emailCount} emails`);
    } catch (error) {
      console.error('Error syncing emails:', error);
      toast.dismiss();
      toast.error("Failed to sync emails. Please try again.");
    }
  };

  const handleGenerateAIResponse = () => {
    toast.info("AI response generation coming soon!");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <EmailStats stats={emailStats || { total: 0, unread: 0, sentToday: 0, archived: 0 }} />
        <EmailFilters
          searchQuery={searchQuery}
          filterValue={filterValue}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onFilterChange={setFilterValue}
        />
        <EmailSection />
      </div>
      <div>
        <EmailQuickActions
          onCompose={() => {}} // This will be handled by the EmailSection
          onRefresh={handleSync}
          onGenerateAIResponse={handleGenerateAIResponse}
        />
      </div>
    </div>
  );
};