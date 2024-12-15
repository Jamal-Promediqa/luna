import { format } from "date-fns";
import { Star, Archive, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Email {
  id: string;
  from_address: string;
  subject: string;
  body_preview: string;
  is_read: boolean;
  received_at: string;
  is_starred?: boolean;
}

interface EmailListProps {
  emails: Email[] | null;
  isLoading?: boolean;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onStar?: (id: string) => void;
}

export const EmailList = ({ emails, isLoading, onArchive, onDelete, onStar }: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 w-full">
                  <Skeleton className="h-8 w-8" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">No emails found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <Card key={email.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {onStar && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => onStar(email.id)}
                  >
                    <Star className={`h-4 w-4 ${email.is_starred ? 'fill-yellow-400' : ''}`} />
                  </Button>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{email.from_address}</span>
                    {!email.is_read && (
                      <Badge variant="secondary">New</Badge>
                    )}
                  </div>
                  <div>{email.subject}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {email.body_preview}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(email.received_at), 'MMM d, HH:mm')}
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