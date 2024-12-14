import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, Line, Bar } from "react-chartjs-2";

interface TaskBreakdownChartsProps {
  tasksByType: number[];
  tasksByPriority: number[];
  dailyCompletionData: number[];
}

export const TaskBreakdownCharts = ({ tasksByType, tasksByPriority, dailyCompletionData }: TaskBreakdownChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Kontrolltyper</CardTitle>
        </CardHeader>
        <CardContent>
          <Pie
            data={{
              labels: ["IVO", "Belastningsregister", "Referenser", "Övrigt"],
              datasets: [
                {
                  data: tasksByType,
                  backgroundColor: [
                    "#8B5CF6",
                    "#D946EF",
                    "#F97316",
                    "#0EA5E9",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Daglig genomförandegrad</CardTitle>
        </CardHeader>
        <CardContent>
          <Line
            data={{
              labels: ["Mån", "Tis", "Ons", "Tor", "Fre"],
              datasets: [
                {
                  label: "Genomförda kontroller",
                  data: dailyCompletionData,
                  borderColor: "#8B5CF6",
                  backgroundColor: "#E5DEFF",
                  tension: 0.1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg">Prioritetsfördelning</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: ["Hög", "Medium", "Låg"],
              datasets: [
                {
                  label: "Kontroller",
                  data: tasksByPriority,
                  backgroundColor: [
                    "#D946EF",
                    "#F97316",
                    "#0EA5E9",
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};