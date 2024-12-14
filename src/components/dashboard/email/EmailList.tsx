import { Mail } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmailListProps {
  emails: any[];
  isLoading: boolean;
}

export const EmailList = ({ emails, isLoading }: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Loading emails...</p>
      </div>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <Mail className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No emails to display</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {emails.map((email) => (
          <div
            key={email.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
          >
            <Mail className={`h-5 w-5 mt-0.5 ${email.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
            <div className="flex-1 space-y-1">
              <p className={`text-sm leading-none ${!email.is_read && 'font-medium'}`}>
                {email.subject || '(No subject)'}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {email.body_preview}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  From: {email.from_address}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(email.received_at), 'MMM d, HH:mm')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};