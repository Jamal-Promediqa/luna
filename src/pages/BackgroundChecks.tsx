import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Calendar,
  FileText,
  Download,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      indicator: "default",
    },
    {
      consultant: "Erik Eriksson",
      checkType: "IVO",
      status: "Väntar",
      date: "2023-11-02",
      action: "Väntar på svar",
      indicator: "secondary",
    },
  ];

  const handleSendRequest = async () => {
    if (!selectedConsultant) {
      toast.error("Välj en konsult först");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/functions/v1/send-ivo-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          consultantName: selectedConsultant.name,
          personalNumber: selectedConsultant.personalId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      toast.success("Förfrågan har skickats");
      setIsDialogOpen(false);
    } catch (error) {
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

      {/* Consultant Selection */}
      <div className="bg-muted/50 p-6 rounded-lg space-y-4">
        <div className="relative">
          <Select onValueChange={(value) => setSelectedConsultant(consultants[Number(value)])}>
            <SelectTrigger>
              <SelectValue placeholder="Sök konsult..." />
            </SelectTrigger>
            <SelectContent>
              {consultants.map((consultant, i) => (
                <SelectItem key={consultant.id} value={i.toString()}>
                  {consultant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedConsultant && (
          <div className="p-4 bg-background rounded-md shadow-sm">
            <div className="flex justify-between">
              <div className="space-y-1">
                <p className="font-bold">{selectedConsultant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedConsultant.specialty}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm">{selectedConsultant.personalId}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedConsultant.location}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="IVO status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approved">Godkänd</SelectItem>
            <SelectItem value="reviewing">Under granskning</SelectItem>
            <SelectItem value="rejected">Avslag</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" />
        <Textarea placeholder="Anteckningar" className="min-h-[100px]" />
      </div>

      {/* Status Table */}
      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Konsult</TableHead>
              <TableHead>Kontrolltyp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Åtgärd</TableHead>
              <TableHead>Indikator</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checksHistory.map((check, i) => (
              <TableRow key={i}>
                <TableCell>{check.consultant}</TableCell>
                <TableCell>{check.checkType}</TableCell>
                <TableCell>{check.status}</TableCell>
                <TableCell>{check.date}</TableCell>
                <TableCell>{check.action}</TableCell>
                <TableCell>
                  <Badge variant={check.indicator as "default" | "secondary"}>
                    {check.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
