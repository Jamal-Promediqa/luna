import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, Calendar, ChevronRight, Home, Settings, Users, Briefcase, FileCheck, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Notifications } from "@/components/dashboard/Notifications";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskNotifications } from "@/components/tasks/TaskNotifications";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { EmailSection } from "@/components/dashboard/EmailSection";

const Dashboard = () => {
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

  const { data: assignments, error: assignmentsError } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .limit(5);
        
        if (error) {
          console.error('Error fetching assignments:', error);
          return [];
        }
        return data;
      } catch (error) {
        console.error('Error fetching assignments:', error);
        return [];
      }
    }
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) {
          console.error('Error fetching tasks:', error);
          return [];
        }
        return data as Task[];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('personal_number', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return {
            given_name: session.user.email?.split('@')[0] || 'Användare',
            full_name: session.user.email || 'Användare'
          };
        }
        
        return data || {
          given_name: session.user.email?.split('@')[0] || 'Användare',
          full_name: session.user.email || 'Användare'
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        return {
          given_name: session.user.email?.split('@')[0] || 'Användare',
          full_name: session.user.email || 'Användare'
        };
      }
    }
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/");
    }
  };

  const handleViewDetails = (task: Task) => {
    console.log("Task details viewed:", task.id);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <TaskNotifications />
      <DashboardHeader profile={profile} onSignOut={handleSignOut} />
      <DashboardNavigation navigate={navigate} />
      <DashboardMetrics assignments={assignments || []} />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Prioriterade uppgifter</CardTitle>
            <Button 
              variant="ghost" 
              className="text-sm"
              onClick={() => navigate('/tasks')}
            >
              Visa alla
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksLoading ? (
                <div className="text-center text-muted-foreground">Laddar uppgifter...</div>
              ) : tasksError ? (
                <div className="text-center text-muted-foreground">Kunde inte ladda uppgifter</div>
              ) : tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground">Inga uppgifter att visa</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          <QuickActions />
          <EmailSection />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;