import { Mail, Archive, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuickActionsProps {
  isConnected: boolean;
  onCompose: () => void;
  onRefreshInbox: () => void;
}

export const QuickActions = ({ isConnected, onCompose, onRefreshInbox }: QuickActionsProps) => {
  const handleArchiveAll = async () => {
    try {
      // In a real implementation, this would archive all emails
      toast.success("Alla mail arkiverade");
    } catch (error) {
      console.error('Error archiving all emails:', error);
      toast.error('Kunde inte arkivera alla mail');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Snabbåtgärder</h3>
        <div className="space-y-3">
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={onCompose}
          >
            <Mail className="mr-2 h-4 w-4" />
            Skriv nytt mail
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={handleArchiveAll}
          >
            <Archive className="mr-2 h-4 w-4" />
            Arkivera alla
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={onRefreshInbox}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Uppdatera inkorg
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};