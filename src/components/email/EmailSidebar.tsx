import { Mail, Archive, RefreshCw, MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmailSidebarProps {
  onGenerateAIResponse: () => void;
}

export const EmailSidebar = ({ onGenerateAIResponse }: EmailSidebarProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Snabbåtgärder</h3>
          <div className="space-y-3">
            <Button className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Skriv nytt mail
            </Button>
            <Button className="w-full" variant="outline">
              <Archive className="mr-2 h-4 w-4" />
              Arkivera alla
            </Button>
            <Button className="w-full" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Uppdatera inkorg
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Mallar</h3>
          <div className="space-y-3">
            <Button className="w-full" variant="outline">
              Mötesbokning
            </Button>
            <Button className="w-full" variant="outline">
              Projektuppdatering
            </Button>
            <Button className="w-full" variant="outline">
              Kunduppföljning
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">AI-Assistent</h3>
          <div className="space-y-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={onGenerateAIResponse}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Generera svar
            </Button>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Skicka AI-svar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};