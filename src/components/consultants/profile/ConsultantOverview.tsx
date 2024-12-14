import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Consultant } from "@/types/consultant";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ConsultantOverviewProps {
  consultant: Consultant;
}

export function ConsultantOverview({ consultant }: ConsultantOverviewProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Kompetenser</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-copilot-teal/10 text-copilot-teal border-copilot-teal/20">React</Badge>
                <Badge variant="outline" className="bg-copilot-teal/10 text-copilot-teal border-copilot-teal/20">Node.js</Badge>
                <Badge variant="outline" className="bg-copilot-teal/10 text-copilot-teal border-copilot-teal/20">TypeScript</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Om {consultant.name}</h3>
              <p className="text-muted-foreground">
                Senior utvecklare med omfattande erfarenhet inom {consultant.specialty}.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Tillgänglighet</h3>
              <Badge className="bg-copilot-teal text-white">
                {consultant.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}