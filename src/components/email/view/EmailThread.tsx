import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface EmailThreadProps {
  sender: string;
  timestamp: string;
  subject: string;
  preview: string;
}

export const EmailThread = ({
  sender,
  timestamp,
  subject,
  preview,
}: EmailThreadProps) => {
  const formattedDate = format(new Date(timestamp), "EEEE, d MMMM yyyy 'at' HH:mm", {
    locale: sv,
  });

  return (
    <div className="border-l-2 border-gray-200 pl-4 mt-4 space-y-2 text-muted-foreground">
      <div className="space-y-1">
        <div className="font-semibold">Från: {sender}</div>
        <div>Skickat: {formattedDate}</div>
        <div>Ämne: {subject}</div>
      </div>
      <div className="mt-4 whitespace-pre-wrap">{preview}</div>
    </div>
  );
};