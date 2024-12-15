import { Star, Archive, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailView } from "./EmailView";
import { useState } from "react";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

interface EmailListProps {
  emails: Email[];
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const extractDisplayName = (sender: string): string => {
  // Check if the sender contains a name part (e.g., "John Doe <john@example.com>")
  const nameMatch = sender.match(/^([^<]+?)\s*<[^>]+>$/);
  if (nameMatch && nameMatch[1]) {
    return nameMatch[1].trim();
  }
  
  // If no name part, extract the part before @ in the email
  const emailPart = sender.split('@')[0];
  // Capitalize first letter and replace dots/underscores with spaces
  return emailPart
    .split(/[._]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const EmailList = ({
  emails,
  onToggleStar,
  onArchive,
  onDelete,
  formatDate,
}: EmailListProps) => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  if (selectedEmail) {
    return (
      <EmailView
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        onToggleStar={onToggleStar}
        onArchive={onArchive}
        onDelete={onDelete}
        formatDate={formatDate}
      />
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Card 
          key={email.id} 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
        >
          <CardContent 
            className="p-4"
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id);
                  }}
                >
                  <Star
                    className={email.isStarred ? "fill-yellow-400" : ""}
                  />
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">
                      {extractDisplayName(email.sender)}
                    </span>
                    {!email.isRead && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        Ny
                      </Badge>
                    )}
                  </div>
                  <div className="text-base font-medium truncate mb-1">
                    {email.subject}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {email.preview}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(email.timestamp)}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(email.id);
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(email.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};