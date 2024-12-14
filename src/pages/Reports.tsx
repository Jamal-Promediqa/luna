import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  CheckCircle,
  Clock,
  LineChart,
  AlertCircle,
  TrendingUp,
  Brain,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });

  const completedTasks = tasks?.filter(task => task.status === 'klar').length || 0;
  const pendingTasks = tasks?.filter(task => task.status !== 'klar').length || 0;
  const totalTasks = tasks?.length || 0;
  const successRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Veckorapport</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('sv-SE', { 
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Genomförda kontroller</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Godkännandegrad</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Genomsnittlig handläggningstid</p>
                <p className="text-2xl font-bold">2.4d</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Väntande kontroller</p>
                <p className="text-2xl font-bold">{pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle className="text-lg">Kontrolltyper</CardTitle>
          </CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: ["IVO", "Belastningsregister", "Referenser", "Övrigt"],
                datasets: [
                  {
                    data: [40, 25, 20, 15],
                    backgroundColor: [
                      "hsl(var(--primary) / 0.8)",
                      "hsl(var(--secondary) / 0.8)",
                      "hsl(var(--accent) / 0.8)",
                      "hsl(var(--muted) / 0.8)",
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

        <Card className="bg-background">
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
                    data: [8, 12, 9, 11, 7],
                    borderColor: "hsl(var(--primary))",
                    backgroundColor: "hsl(var(--primary) / 0.1)",
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

        <Card className="bg-background">
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
                    data: [15, 25, 7],
                    backgroundColor: "hsl(var(--primary) / 0.8)",
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
    </div>
  );
};

export default Reports;