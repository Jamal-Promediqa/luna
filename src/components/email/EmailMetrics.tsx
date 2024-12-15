import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: number;
}

const MetricCard = ({ label, value }: MetricCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export const EmailMetrics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard label="Totala e-post" value={1254} />
      <MetricCard label="Olästa" value={23} />
      <MetricCard label="Skickade idag" value={45} />
      <MetricCard label="Arkiverade" value={289} />
    </div>
  );
};