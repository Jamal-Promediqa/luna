import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function ConsultantComments() {
  const [newComment, setNewComment] = useState("");

  const handleNewComment = () => {
    if (newComment.trim()) {
      toast.success("Kommentar sparad");
      setNewComment("");
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Kommentarer</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Textarea 
              placeholder="Skriv en kommentar..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleNewComment} className="bg-copilot-teal hover:bg-copilot-teal-dark">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Linus Skoglund</span>
                <span className="text-sm text-muted-foreground">aug 15</span>
              </div>
              <p>Behöver ingen plan, hör av när usk uppdrag komer</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}