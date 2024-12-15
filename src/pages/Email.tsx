import { useState, useCallback } from "react";
import { toast } from "sonner";
import { EmailMetrics } from "@/components/email/EmailMetrics";
import { EmailFilters } from "@/components/email/EmailFilters";
import { EmailList } from "@/components/email/EmailList";
import { EmailSidebar } from "@/components/email/EmailSidebar";

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

export default function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      sender: "Anna Andersson",
      subject: "Möte om nya projektet",
      preview: "Hej! Jag ville höra när vi kan boka in ett möte...",
      timestamp: "2024-01-15T10:30:00",
      isStarred: true,
      isRead: false,
    },
    {
      id: 2,
      sender: "Erik Svensson",
      subject: "Kvartalsrapport Q4",
      preview: "Här kommer den senaste kvartalsrapporten...",
      timestamp: "2024-01-15T09:15:00",
      isStarred: false,
      isRead: true,
    },
    {
      id: 3,
      sender: "Maria Larsson",
      subject: "Teambuilding nästa vecka",
      preview: "Vi planerar att ha en teamaktivitet...",
      timestamp: "2024-01-14T16:45:00",
      isStarred: false,
      isRead: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleStar = useCallback((id: number) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id
          ? { ...email, isStarred: !email.isStarred }
          : email
      )
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    toast.success("E-post borttagen");
  }, []);

  const handleArchive = useCallback((id: number) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    toast.success("E-post arkiverad");
  }, []);

  const generateAIResponse = useCallback(() => {
    toast.success("AI-svar genererat", {
      description: "Svaret har kopierats till urklipp",
    });
  }, []);

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