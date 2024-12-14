import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PhoneCall } from "lucide-react";

const RingLista = () => {
  const navigate = useNavigate();

  // Placeholder data until we get Adocka API access
  const ringListItems = [
    { id: 1, name: "Anna Andersson", phone: "070-123 45 67", notes: "Återkoppling angående konsultuppdrag" },
    { id: 2, name: "Erik Eriksson", phone: "070-234 56 78", notes: "Intresserad av nya uppdrag" },
    { id: 3, name: "Maria Nilsson", phone: "070-345 67 89", notes: "Vill diskutera tillgänglighet" }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
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
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    {item.phone}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.notes}
                </div>
              </div>
            </div>
          ))}
          {ringListItems.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <PhoneCall className="h-12 w-12 mx-auto mb-4 opacity-20" />
              Inga samtal att visa
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center mt-4">
        Väntar på integration med Adocka API
      </div>
    </div>
  );
};

export default RingLista;