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
        <Card key={email.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
          <CardContent 
            className="p-4"
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id);
                  }}
                >
                  <Star
                    className={email.isStarred ? "fill-yellow-400" : ""}
                  />
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{email.sender}</span>
                    {!email.isRead && (
                      <Badge variant="secondary">Ny</Badge>
                    )}
                  </div>
                  <div>{email.subject}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {email.preview}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatDate(email.timestamp)}
                </span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};