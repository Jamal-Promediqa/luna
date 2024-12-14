import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  AlertCircle, 
  MessageSquare, 
  Send,
  Lock
} from "lucide-react";

export function ConsultantSidebar() {
  return (
    <div className="space-y-4">
      {/* Quality Control */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Kvalitetskontroll</h3>
            <span className="text-sm text-muted-foreground">0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-copilot-teal hover:bg-copilot-teal-dark" size="lg">
          Presentera konsult
        </Button>
        <Button className="w-full bg-copilot-teal hover:bg-copilot-teal-dark" size="lg">
          Skapa avtal
        </Button>
        <Button className="w-full" variant="destructive" size="lg">
          Boka konsult
        </Button>
        <Button className="w-full" variant="outline" size="lg">
          <Lock className="h-4 w-4 mr-2" />
          Spärra konsult
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start">
          <Bell className="h-4 w-4 mr-2" />
          Ny aktivitet
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <AlertCircle className="h-4 w-4 mr-2" />
          Ny påminnelse
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ny kommentar
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Send className="h-4 w-4 mr-2" />
          Skicka inloggningsuppgifter
        </Button>
      </div>
    </div>
  );
}