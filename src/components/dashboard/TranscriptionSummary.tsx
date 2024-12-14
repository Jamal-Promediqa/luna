import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Share2, MessageSquare, Clock, Flag, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TranscriptionSummaryProps {
  title: string;
  duration?: string;
  date?: string;
  summary: string;
  actionItems: string[];
  onCreateTask?: (task: string) => void;
}

export const TranscriptionSummary = ({
  title = "Diktering",
  duration,
  date = new Date().toLocaleDateString("sv-SE"),
  summary,
  actionItems,
  onCreateTask
}: TranscriptionSummaryProps) => {
  const handleCreateTask = (item: string) => {
    if (onCreateTask) {
      onCreateTask(item);
      toast.success("Uppgift skapad");
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex gap-2 flex-wrap">
            {duration && <Badge variant="secondary">{duration}</Badge>}
            <Badge variant="secondary">{date}</Badge>
          </div>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sammanfattning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Åtgärder</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="default"
                    className="h-8 w-8 rounded-full shrink-0"
                    onClick={() => handleCreateTask(item)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Generell ton</span>
                <span className="text-muted-foreground">75% Positiv</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Engagemangsnivå</span>
                <span className="text-muted-foreground">85% Engagerad</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Key Moments */}
        <Card>
          <CardHeader>
            <CardTitle>Viktiga ögonblick</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-semibold">00:05:30</p>
                  <p className="text-muted-foreground">Diskussion om huvudpunkter</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 mt-1 text-blue-500" />
                <div>
                  <p className="font-semibold">00:15:45</p>
                  <p className="text-muted-foreground">Viktiga beslut tagna</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Flag className="h-5 w-5 mt-1 text-green-500" />
                <div>
                  <p className="font-semibold">00:32:20</p>
                  <p className="text-muted-foreground">Åtgärdsplan fastställd</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Ladda ner sammanfattning
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Dela rapport
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Lägg till kommentar
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};