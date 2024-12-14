import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileCheck, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export const QuickActions = () => {
  const handleAddConsultant = () => {
    toast.success("Funktionen kommer snart!");
  };

  const handleBookInterview = () => {
    toast.success("Funktionen kommer snart!");
  };

  const handleStartReference = () => {
    toast.success("Funktionen kommer snart!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snabbåtgärder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" variant="default" onClick={handleAddConsultant}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Bakgrundskontroller
        </Button>
        <Button className="w-full" variant="secondary" onClick={handleBookInterview}>
          <Calendar className="mr-2 h-4 w-4" />
          Boka intervju
        </Button>
        <Button className="w-full" variant="secondary" onClick={handleStartReference}>
          <FileCheck className="mr-2 h-4 w-4" />
          Starta referenstagning
        </Button>
      </CardContent>
    </Card>
  );
};