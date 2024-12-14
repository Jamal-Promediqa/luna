import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle } from "lucide-react";

const Tasks = () => {
  const tasks = [
    { 
      title: "Granska CV för Erik Andersson", 
      status: "Brådskande", 
      variant: "destructive" as const,
      dueDate: "2024-03-20",
      assignedTo: "John Doe"
    },
    { 
      title: "Boka intervju med Maria Nilsson", 
      status: "Pågående", 
      variant: "default" as const,
      dueDate: "2024-03-22",
      assignedTo: "Jane Smith"
    },
    { 
      title: "Följ upp referenstagning", 
      status: "Väntar", 
      variant: "secondary" as const,
      dueDate: "2024-03-25",
      assignedTo: "John Doe"
    },
    { 
      title: "Uppdatera konsultprofil", 
      status: "Klar", 
      variant: "outline" as const,
      dueDate: "2024-03-18",
      assignedTo: "Jane Smith"
    }
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Uppgifter och aktiviteter</h1>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Lägg till ny uppgift
        </Button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <Card key={index} className="hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{task.title}</h3>
                    <Badge variant={task.variant}>{task.status}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Förfaller: {task.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      <span>Tilldelad: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Visa detaljer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tasks;