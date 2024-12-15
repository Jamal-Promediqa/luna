import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface EmailContentProps {
  sender: string;
  isRead: boolean;
  timestamp: string;
  formatDate: (date: string) => string;
  preview: string;
}

export const EmailContent = ({
  sender,
  isRead,
  timestamp,
  formatDate,
  preview
}: EmailContentProps) => {
  // Extract display name or email part before @ for avatar
  const senderInitial = sender.match(/^([^<]+)/)?.[1]?.trim()?.[0] || 
                       sender.split('@')[0][0].toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" />
          <AvatarFallback>{senderInitial}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{sender}</span>
            {!isRead && <Badge variant="secondary">Ny</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatDate(timestamp)}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="text-base leading-relaxed whitespace-pre-wrap">{preview}</div>
      </div>

      <Separator />
    </div>
  );
};