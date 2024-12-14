import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
import { MetricsCards } from "@/components/reports/MetricsCards";
import { AIInsights } from "@/components/reports/AIInsights";
import { TaskBreakdownCharts } from "@/components/reports/TaskBreakdownCharts";
import { TaskBreakdownTable } from "@/components/reports/TaskBreakdownTable";
import { startOfWeek, endOfWeek } from "date-fns";

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

        const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'klar')
          .gte('updated_at', startDate.toISOString())
          .lte('updated_at', endDate.toISOString())
          .order('updated_at', { ascending: false });
        
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

  // Sample data for task breakdown
  const tasksByType = [40, 25, 20, 15];
  const tasksByPriority = [15, 25, 7];
  const dailyCompletionData = [8, 12, 9, 11, 7];

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

      <MetricsCards
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        successRate={successRate}
      />

      <AIInsights />

      <TaskBreakdownCharts
        tasksByType={tasksByType}
        tasksByPriority={tasksByPriority}
        dailyCompletionData={dailyCompletionData}
      />

      <TaskBreakdownTable tasks={tasks || []} />
    </div>
  );
};

export default Reports;