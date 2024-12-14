import { Button } from "@/components/ui/button";
import { PhoneCall, Mic } from "lucide-react";

interface ContactListProps {
  contacts: Array<{
    id: number;
    name: string;
    phone: string;
    notes?: string;
  }>;
  onStartCall: (contact: { name: string; phone: string }) => void;
}

export const ContactList = ({ contacts, onStartCall }: ContactListProps) => {
  return (
    <div className="space-y-4">
      {contacts.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {item.name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.phone}</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onStartCall(item)}
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Spela in
                </Button>
                <Button variant="default" size="sm">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Ring
                </Button>
              </div>
            </div>
            {item.notes && (
              <div className="text-sm text-muted-foreground mt-2">
                {item.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};