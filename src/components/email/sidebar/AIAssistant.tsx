import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIAssistantProps {
  isConnected: boolean;
  onGenerateAIResponse: () => void;
}

export const AIAssistant = ({ isConnected, onGenerateAIResponse }: AIAssistantProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">AI-Assistent</h3>
        <div className="space-y-3">
          <Button
            className="w-full"
            variant="outline"
            onClick={onGenerateAIResponse}
            disabled={!isConnected}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Generera svar
          </Button>
          <Button 
            className="w-full" 
            disabled={!isConnected}
          >
            <Send className="mr-2 h-4 w-4" />
            Skicka AI-svar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};