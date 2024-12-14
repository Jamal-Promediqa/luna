import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsCardsProps {
  completedTasks: number;
  pendingTasks: number;
  successRate: number;
}

export const MetricsCards = ({ completedTasks, pendingTasks, successRate }: MetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-[#F2FCE2]/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-[#8B5CF6]" />
            <div>
              <p className="text-sm text-muted-foreground">Genomförda kontroller</p>
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#FEF7CD]/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[#D946EF]" />
            <div>
              <p className="text-sm text-muted-foreground">Godkännandegrad</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#FEC6A1]/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#F97316]" />
            <div>
              <p className="text-sm text-muted-foreground">Genomsnittlig handläggningstid</p>
              <p className="text-2xl font-bold">2.4d</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#E5DEFF]/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-[#0EA5E9]" />
            <div>
              <p className="text-sm text-muted-foreground">Väntande kontroller</p>
              <p className="text-2xl font-bold">{pendingTasks}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};