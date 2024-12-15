import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Inbox, 
  Archive, 
  PenSquare, 
  Send, 
  Trash2, 
  MessageSquare, 
  MailX, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailFoldersProps {
  selectedFolder: string;
  onFolderChange: (folder: string) => void;
}

export const EmailFolders = ({ selectedFolder, onFolderChange }: EmailFoldersProps) => {
  // Query to get email counts for each folder
  const { data: emailCounts } = useQuery({
    queryKey: ['emailCounts'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const counts = {
        inbox: 0,
        archive: 0,
        drafts: 0,
        sent: 0,
        deleted: 0,
        junk: 0
      };

      // Get counts for each status
      const { data: statusCounts, error } = await supabase
        .from('outlook_emails')
        .select('status, count(*)')
        .eq('user_id', user.id)
        .groupBy('status');

      if (error) {
        console.error('Error fetching email counts:', error);
        return counts;
      }

      statusCounts.forEach((item: any) => {
        if (item.status in counts) {
          counts[item.status as keyof typeof counts] = item.count;
        }
      });

      return counts;
    }
  });

  const folders = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="h-4 w-4" />, count: emailCounts?.inbox },
    { id: 'archive', label: 'Archive', icon: <Archive className="h-4 w-4" />, count: emailCounts?.archive },
    { id: 'drafts', label: 'Drafts', icon: <PenSquare className="h-4 w-4" />, count: emailCounts?.drafts },
    { id: 'sent', label: 'Sent', icon: <Send className="h-4 w-4" />, count: emailCounts?.sent },
    { id: 'deleted', label: 'Deleted Items', icon: <Trash2 className="h-4 w-4" />, count: emailCounts?.deleted },
    { id: 'conversation', label: 'Conversation History', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'junk', label: 'Junk Email', icon: <MailX className="h-4 w-4" />, count: emailCounts?.junk },
    { id: 'groups', label: 'Groups', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="w-60 pr-6 border-r">
      <nav className="space-y-1">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onFolderChange(folder.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
              selectedFolder === folder.id
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              {folder.icon}
              <span>{folder.label}</span>
            </div>
            {typeof folder.count === 'number' && folder.count > 0 && (
              <span className="text-xs font-medium">{folder.count}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};