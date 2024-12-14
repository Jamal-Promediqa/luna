import { Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AIInsights = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#8B5CF6]" />
          <CardTitle>AI Insikter</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Kontrollmönster</h3>
            <p className="text-muted-foreground">
              Bakgrundskontroller har ökat med 15% jämfört med förra veckan.
              Högst effektivitet observerad under morgontimmarna.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Effektivitetsanalys</h3>
            <p className="text-muted-foreground">
              Genomsnittlig handläggningstid minskade med 1 dag.
              IVO-kontroller visar snabbast handläggning.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Rekommendationer</h3>
            <p className="text-muted-foreground">
              Prioritera morgontider för kritiska kontroller.
              Implementera gruppering av liknande kontrolltyper.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};