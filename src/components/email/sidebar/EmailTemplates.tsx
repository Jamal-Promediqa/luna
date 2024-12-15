import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmailTemplatesProps {
  isConnected: boolean;
  onSelectTemplate: (template: string) => void;
}

export const EmailTemplates = ({ isConnected, onSelectTemplate }: EmailTemplatesProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Mallar</h3>
        <div className="space-y-3">
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={() => onSelectTemplate("Mötesbokning")}
          >
            Mötesbokning
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={() => onSelectTemplate("Projektuppdatering")}
          >
            Projektuppdatering
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            disabled={!isConnected}
            onClick={() => onSelectTemplate("Kunduppföljning")}
          >
            Kunduppföljning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};