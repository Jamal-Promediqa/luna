import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ConsultantSelector } from "@/components/background-checks/ConsultantSelector";
import { ChecksTable } from "@/components/background-checks/ChecksTable";

export default function BackgroundChecks() {
  const [selectedConsultant, setSelectedConsultant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const consultants = [
    {
      id: 1,
      name: "Anna Andersson",
      specialty: "Sjuksköterska",
      personalId: "198505121234",
      location: "Stockholm",
    },
    {
      id: 2,
      name: "Erik Eriksson",
      specialty: "Läkare",
      personalId: "197012301234",
      location: "Göteborg",
    },
  ];

  const checksHistory = [
    {
      consultant: "Anna Andersson",
      checkType: "Socialstyrelsen",
      status: "Godkänd",
      date: "2023-11-01",
      action: "Ingen åtgärd krävs",
      indicator: "default" as const,
    },
    {
      consultant: "Erik Eriksson",
      checkType: "IVO",
      status: "Väntar",
      date: "2023-11-02",
      action: "Väntar på svar",
      indicator: "secondary" as const,
    },
  ];

  const handleSendRequest = async () => {
    if (!selectedConsultant) {
      toast.error("Välj en konsult först");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-ivo-check', {
        body: {
          consultantName: selectedConsultant.name,
          personalNumber: selectedConsultant.personalId,
          specialty: selectedConsultant.specialty,
          requestType: "IVO bakgrundskontroll",
          additionalContext: `Konsulten är en ${selectedConsultant.specialty.toLowerCase()} baserad i ${selectedConsultant.location}.`
        },
      });

      if (error) throw error;

      toast.success("Förfrågan har skickats");
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Ett fel uppstod vid sändning av förfrågan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <header className="pb-6">
        <h1 className="text-2xl font-bold">Bakgrundskontroller</h1>
      </header>

      <ConsultantSelector
        consultants={consultants}
        selectedConsultant={selectedConsultant}
        onSelect={setSelectedConsultant}
      />

      {/* Checklist */}
      <div className="bg-muted/50 p-6 rounded-lg space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="socialstyrelsen" />
          <label htmlFor="socialstyrelsen">Socialstyrelsen kontroll</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="ivo" />
          <label htmlFor="ivo">IVO kontroll</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="license" />
          <label htmlFor="license">Licensvalidering</label>
        </div>
      </div>

      {/* Form */}
      <div className="bg-muted/50 p-6 rounded-lg space-y-4">
        <Input placeholder="Referensnummer" />
        <Input type="date" />
        <Textarea placeholder="Anteckningar" className="min-h-[100px]" />
      </div>

      <ChecksTable checksHistory={checksHistory} />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            disabled={!selectedConsultant || isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            {isLoading ? "Skickar..." : "Skicka förfrågan"}
          </Button>
          <Button>Markera som klar</Button>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Lägg till anteckning
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportera kontrollhistorik
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekräfta åtgärd</DialogTitle>
          </DialogHeader>
          <p>Är du säker på att du vill skicka denna förfrågan till IVO?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSendRequest} disabled={isLoading}>
              {isLoading ? "Skickar..." : "Bekräfta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}