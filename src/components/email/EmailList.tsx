import { Star, Archive, Trash2, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

interface EmailListProps {
  emails: Email[];
  onToggleStar: (id: number) => void;
  onArchive: (id: number) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

export const EmailList = ({
  emails,
  onToggleStar,
  onArchive,
  onDelete,
  formatDate,
}: EmailListProps) => {
  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Card key={email.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStar(email.id)}
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
                  onClick={() => onArchive(email.id)}
                >
                  <Archive className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(email.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
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