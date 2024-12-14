import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, ChevronRight, Home, Settings, Users, Briefcase, FileCheck, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Notifications } from "@/components/dashboard/Notifications";
import { Task } from "@/types/task";
import { TaskCard } from "@/components/tasks/TaskCard";

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

  // Fetch assignments data
  const { data: assignments } = useQuery({
    queryKey: ['assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch tasks data
  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Task[];
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
        
        if (error) throw error;
        
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

  const navigationItems = [
    { icon: <Home className="h-4 w-4" />, text: "Dashboard", path: "/dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter", path: "/consultants" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads", path: "/leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter", path: "/reports" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar", path: "/settings" }
  ];

  const metrics = [
    { title: "Antal konsulter kontaktade idag", value: assignments?.length || "0", icon: <Users className="h-6 w-6" />, color: "text-blue-500" },
    { title: "Pågående referenstagningar", value: "5", icon: <Clock className="h-6 w-6" />, color: "text-orange-500" },
    { title: "Antal bakgrundskontroller klara", value: "8", icon: <CheckCircle className="h-6 w-6" />, color: "text-green-500" },
    { title: "Aktiva leads", value: "24", icon: <Briefcase className="h-6 w-6" />, color: "text-purple-500" }
  ];

  const getVariantForStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "brådskande":
        return "destructive";
      case "pågående":
        return "default";
      case "väntar":
        return "secondary";
      case "klar":
        return "outline";
      default:
        return "default";
    }
  };

  const handleViewDetails = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Välkommen tillbaka, {profile?.given_name || 'Användare'}</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("sv-SE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {navigationItems.map((item) => (
          <Button
            key={item.text}
            variant="ghost"
            className="whitespace-nowrap"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="ml-2">{item.text}</span>
          </Button>
        ))}
      </div>

      {/* Metrics Grid */}
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
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
