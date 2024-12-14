import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, CheckCircle, Briefcase } from "lucide-react";

interface DashboardMetricsProps {
  assignments: any[];
}

export const DashboardMetrics = ({ assignments }: DashboardMetricsProps) => {
  const metrics = [
    { title: "Antal konsulter kontaktade idag", value: assignments?.length || "0", icon: <Users className="h-6 w-6" />, color: "text-blue-500" },
    { title: "Pågående referenstagningar", value: "5", icon: <Clock className="h-6 w-6" />, color: "text-orange-500" },
    { title: "Antal bakgrundskontroller klara", value: "8", icon: <CheckCircle className="h-6 w-6" />, color: "text-green-500" },
    { title: "Aktiva leads", value: "24", icon: <Briefcase className="h-6 w-6" />, color: "text-purple-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:-translate-y-1 transition-transform">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
                <h2 className="text-3xl font-bold">{metric.value}</h2>
              </div>
              <div className={metric.color}>{metric.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};