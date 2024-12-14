import { TranscriptionSummary } from "@/components/dashboard/TranscriptionSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Mic, Plus } from "lucide-react";
import { useState } from "react";
import { DashboardDictationDialog } from "@/components/dashboard/DashboardDictationDialog";

const AITranscriptions = () => {
  const [showDictation, setShowDictation] = useState(false);

  const { data: callRecords, isLoading } = useQuery({
    queryKey: ['call-records'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('call_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Transcriptions</h1>
        <Button onClick={() => setShowDictation(true)}>
          <Mic className="mr-2 h-4 w-4" />
          New Recording
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Loading transcriptions...
              </div>
            </CardContent>
          </Card>
        ) : !callRecords?.length ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground flex flex-col items-center gap-4">
                <Clock className="h-12 w-12 opacity-20" />
                <p>No transcriptions yet</p>
                <Button onClick={() => setShowDictation(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6">
              {callRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <CardTitle>{record.contact_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TranscriptionSummary
                      title={`Call with ${record.contact_name}`}
                      date={new Date(record.created_at).toLocaleDateString("sv-SE")}
                      summary={record.summary || ""}
                      actionItems={(record.action_plan || "").split('\n').filter(Boolean)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <DashboardDictationDialog
        open={showDictation}
        onOpenChange={setShowDictation}
      />
    </div>
  );
};

export default AITranscriptions;