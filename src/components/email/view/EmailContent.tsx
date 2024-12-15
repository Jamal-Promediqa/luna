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
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>{sender[0]}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
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
        <div className="whitespace-pre-wrap">{preview}</div>
      </div>

      <Separator />
    </div>
  );
};