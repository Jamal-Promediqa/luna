import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, ChevronRight, Home, Settings, Users, Briefcase, FileCheck, AlertCircle, PlusCircle, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

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

  // Fetch user profile with error handling
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
          .maybeSingle(); // Use maybeSingle() instead of single()
        
        if (error) throw error;
        
        // If no profile exists, return a default profile
        return data || {
          given_name: session.user.email?.split('@')[0] || 'Användare',
          full_name: session.user.email || 'Användare'
        };
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Return a default profile on error
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
    { icon: <Home className="h-4 w-4" />, text: "Dashboard" },
    { icon: <Users className="h-4 w-4" />, text: "Konsulter" },
    { icon: <Briefcase className="h-4 w-4" />, text: "Leads" },
    { icon: <FileCheck className="h-4 w-4" />, text: "Rapporter" },
    { icon: <Settings className="h-4 w-4" />, text: "Inställningar" }
  ];

  const metrics = [
    { title: "Antal konsulter kontaktade idag", value: assignments?.length || "0", icon: <Users className="h-6 w-6" />, color: "text-blue-500" },
    { title: "Pågående referenstagningar", value: "5", icon: <Clock className="h-6 w-6" />, color: "text-orange-500" },
    { title: "Antal bakgrundskontroller klara", value: "8", icon: <CheckCircle className="h-6 w-6" />, color: "text-green-500" },
    { title: "Aktiva leads", value: "24", icon: <Briefcase className="h-6 w-6" />, color: "text-purple-500" }
  ];

  const tasks = [
    { title: "Granska CV för Erik Andersson", status: "Brådskande", variant: "destructive" as const },
    { title: "Boka intervju med Maria Nilsson", status: "Pågående", variant: "default" as const },
    { title: "Följ upp referenstagning", status: "Väntar", variant: "secondary" as const },
    { title: "Uppdatera konsultprofil", status: "Klar", variant: "outline" as const }
  ];

  const notifications = [
    { text: "Ny ansökan från Johan Svensson", time: "10 min sedan", icon: <AlertCircle className="h-4 w-4" /> },
    { text: "Referenstagning klar för Anna Kim", time: "1 timme sedan", icon: <CheckCircle className="h-4 w-4" /> },
    { text: "Påminnelse: Uppföljningsmöte kl 14:00", time: "2 timmar sedan", icon: <Clock className="h-4 w-4" /> }
  ];

  const handleAddConsultant = () => {
    toast.success("Funktionen kommer snart!");
  };

  const handleBookInterview = () => {
    toast.success("Funktionen kommer snart!");
  };

  const handleStartReference = () => {
    toast.success("Funktionen kommer snart!");
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
          <Button key={item.text} variant="ghost" className="whitespace-nowrap">
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
            <Button variant="ghost" className="text-sm">
              Visa alla
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.title}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <span>{task.title}</span>
                  <Badge variant={task.variant}>{task.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Snabbåtgärder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default" onClick={handleAddConsultant}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Lägg till ny konsult
              </Button>
              <Button className="w-full" variant="secondary" onClick={handleBookInterview}>
                <Calendar className="mr-2 h-4 w-4" />
                Boka intervju
              </Button>
              <Button className="w-full" variant="secondary" onClick={handleStartReference}>
                <FileCheck className="mr-2 h-4 w-4" />
                Starta referenstagning
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifikationer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.text} className="flex gap-3 items-start">
                  <div className="text-muted-foreground mt-0.5">
                    {notification.icon}
                  </div>
                  <div>
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
