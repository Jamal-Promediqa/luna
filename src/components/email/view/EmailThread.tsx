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
  const formattedDate = format(new Date(timestamp), "EEEE, d MMMM yyyy 'kl.' HH:mm", {
    locale: sv,
  });

  // Extract display name if available, otherwise use the full sender
  const displayName = sender.match(/^([^<]+)/)?.[1]?.trim() || sender;
  const emailAddress = sender.match(/<([^>]+)>/)?.[1] || sender;

  return (
    <div className="border-l-2 border-gray-200 pl-4 mt-6 space-y-3 text-muted-foreground text-sm">
      <div className="space-y-2">
        <div>
          <span className="font-semibold">Från:</span> {displayName} {emailAddress !== displayName && `<${emailAddress}>`}
        </div>
        <div>
          <span className="font-semibold">Skickat:</span> {formattedDate}
        </div>
        <div>
          <span className="font-semibold">Till:</span> {displayName} {emailAddress !== displayName && `<${emailAddress}>`}
        </div>
        <div>
          <span className="font-semibold">Ämne:</span> {subject}
        </div>
      </div>
      <div className="mt-4 whitespace-pre-wrap leading-relaxed border-t pt-4 text-base">
        {preview}
      </div>
    </div>
  );
};