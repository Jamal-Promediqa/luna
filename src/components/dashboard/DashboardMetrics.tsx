import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, Briefcase, Calendar, PhoneCall } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { KPI } from "@/integrations/supabase/types";

interface DashboardMetricsProps {
  assignments: any[];
}

export const DashboardMetrics = ({ assignments }: DashboardMetricsProps) => {
  const [showKpiDialog, setShowKpiDialog] = useState(false);
  const [kpiValues, setKpiValues] = useState({
    presentedConsultants: 0,
    bookedWeeks: 0,
    callCount: 0
  });
  const queryClient = useQueryClient();

  const { data: kpis } = useQuery<KPI | null>({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('kpis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updateKpiMutation = useMutation({
    mutationFn: async (values: typeof kpiValues) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('kpis')
        .insert({
          user_id: user.id,
          presented_consultants: values.presentedConsultants,
          booked_weeks: values.bookedWeeks,
          call_count: values.callCount
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      setShowKpiDialog(false);
      toast.success('KPIs har uppdaterats');
    },
    onError: (error) => {
      console.error('Error updating KPIs:', error);
      toast.error('Ett fel uppstod när KPIs skulle uppdateras');
    }
  });

  const handleUpdateKpis = () => {
    updateKpiMutation.mutate(kpiValues);
  };

  const metrics = [
    { title: "Antal konsulter kontaktade idag", value: assignments?.length || "0", icon: <Users className="h-6 w-6" />, color: "text-blue-500" },
    { title: "Pågående referenstagningar", value: "5", icon: <Clock className="h-6 w-6" />, color: "text-orange-500" },
    { title: "Antal bakgrundskontroller klara", value: "8", icon: <CheckCircle className="h-6 w-6" />, color: "text-green-500" },
    { title: "Aktiva leads", value: "24", icon: <Briefcase className="h-6 w-6" />, color: "text-purple-500" },
    { title: "Presenterade konsulter", value: kpis?.presented_consultants || "0", icon: <Users className="h-6 w-6" />, color: "text-indigo-500" },
    { title: "Bokade veckor", value: kpis?.booked_weeks || "0", icon: <Calendar className="h-6 w-6" />, color: "text-pink-500" },
    { title: "Antal samtal", value: kpis?.call_count || "0", icon: <PhoneCall className="h-6 w-6" />, color: "text-cyan-500" }
  ];

  return (
    <div className="relative">
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

      <Button
        onClick={() => setShowKpiDialog(true)}
        className="absolute top-0 right-0"
      >
        Uppdatera KPIs
      </Button>

      <Dialog open={showKpiDialog} onOpenChange={setShowKpiDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Uppdatera KPIs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="presentedConsultants">Antal presenterade konsulter</Label>
              <Input
                id="presentedConsultants"
                type="number"
                value={kpiValues.presentedConsultants}
                onChange={(e) => setKpiValues(prev => ({
                  ...prev,
                  presentedConsultants: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bookedWeeks">Bokade veckor</Label>
              <Input
                id="bookedWeeks"
                type="number"
                value={kpiValues.bookedWeeks}
                onChange={(e) => setKpiValues(prev => ({
                  ...prev,
                  bookedWeeks: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="callCount">Antal samtal</Label>
              <Input
                id="callCount"
                type="number"
                value={kpiValues.callCount}
                onChange={(e) => setKpiValues(prev => ({
                  ...prev,
                  callCount: parseInt(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateKpis}
              disabled={updateKpiMutation.isPending}
            >
              {updateKpiMutation.isPending ? 'Uppdaterar...' : 'Spara'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};