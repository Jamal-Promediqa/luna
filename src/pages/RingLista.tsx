import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, PhoneCall, Search, Mic, Plus, Clock } from "lucide-react";
import { CallRecordingDialog } from "@/components/ring-lista/CallRecordingDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const RingLista = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);
  const [callRecords, setCallRecords] = useState<any[]>([]);

  // Fetch call records
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

  const handleStartCall = (contact: { name: string; phone: string }) => {
    setSelectedContact(contact);
  };

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
          <CardContent className="space-y-4">
            {ringListItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    {item.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.phone}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStartCall(item)}
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Spela in
                      </Button>
                      <Button variant="default" size="sm">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Ring
                      </Button>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {item.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {callRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium">{record.contact_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.contact_phone} • {format(new Date(record.created_at), 'dd MMM yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                    {record.summary && (
                      <div className="mt-4 space-y-2">
                        <div className="text-sm whitespace-pre-line bg-accent/50 p-4 rounded-lg">
                          {record.summary}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {callRecords.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    Inga tidigare samtal att visa
                  </div>
                )}
              </div>
            </ScrollArea>
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