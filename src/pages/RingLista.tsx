import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, PhoneCall, Search, Plus, Clock } from "lucide-react";
import { CallRecordingDialog } from "@/components/ring-lista/CallRecordingDialog";
import { ContactList } from "@/components/ring-lista/ContactList";
import { CallHistory } from "@/components/ring-lista/CallHistory";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RingLista = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);
  const [callRecords, setCallRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchCallRecords = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('call_records')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching call records:', error);
        toast.error("Kunde inte hämta samtalshistorik");
        return;
      }

      setCallRecords(data || []);
    };

    fetchCallRecords();
  }, []);

  // Placeholder data until we get Adocka API access
  const ringListItems = [
    { id: 1, name: "Gustav Linder", phone: "0703556695", notes: "Återkoppling angående konsultuppdrag" },
    { id: 2, name: "Maria Frick", phone: "0760443188", notes: "Intresserad av nya uppdrag" },
    { id: 3, name: "Nils Lundgren", phone: "0709596660", notes: "Vill diskutera tillgänglighet" }
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.includes(searchQuery)
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Ring Lista</h1>
        </div>
        <Button onClick={() => toast.info("Integration med Adocka kommer snart")}>
          <Plus className="h-4 w-4 mr-2" />
          Lägg till kontakt
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök på namn eller telefonnummer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5" />
              Att ringa idag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactList 
              contacts={ringListItems}
              onStartCall={setSelectedContact}
            />
            {ringListItems.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <PhoneCall className="h-12 w-12 mx-auto mb-4 opacity-20" />
                Inga kontakter att visa
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tidigare samtal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CallHistory callRecords={callRecords} />
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-muted-foreground text-center mt-4">
        Väntar på integration med Adocka API
      </div>

      {selectedContact && (
        <CallRecordingDialog
          isOpen={true}
          onClose={() => setSelectedContact(null)}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default RingLista;