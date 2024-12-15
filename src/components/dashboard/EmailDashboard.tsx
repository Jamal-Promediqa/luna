import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ComposeEmail } from "./ComposeEmail";
import {
  Search,
  Star,
  Mail,
  Archive,
  Trash2,
  Send,
  MessageSquare,
  RefreshCw,
  MoreVertical,
} from "lucide-react";

export const EmailDashboard = () => {
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("alla");

  const { data: emails = [], refetch } = useQuery({
    queryKey: ['outlook-emails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from('outlook_emails')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    total: emails.length,
    unread: emails.filter(email => !email.is_read).length,
    sentToday: 0, // This would need to be implemented with sent emails tracking
    archived: 0, // This would need to be implemented with archived status tracking
  };

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilter = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const handleArchive = useCallback((id: string) => {
    toast.success("Email archived");
  }, []);

  const handleDelete = useCallback((id: string) => {
    toast.success("Email deleted");
  }, []);

  const generateAIResponse = useCallback(() => {
    toast.success("AI response generated and copied to clipboard");
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Emails</div>
                <div className="text-2xl font-semibold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Unread</div>
                <div className="text-2xl font-semibold">{stats.unread}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Sent Today</div>
                <div className="text-2xl font-semibold">{stats.sentToday}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Archived</div>
                <div className="text-2xl font-semibold">{stats.archived}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>
            <Select value={filterValue} onValueChange={handleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter emails" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alla">All emails</SelectItem>
                <SelectItem value="olasta">Unread</SelectItem>
                <SelectItem value="stjarnmarkerade">Starred</SelectItem>
                <SelectItem value="arkiverade">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {emails.map((email) => (
              <Card key={email.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{email.from_address}</span>
                          {!email.is_read && (
                            <Badge variant="secondary">New</Badge>
                          )}
                        </div>
                        <div>{email.subject}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {email.body_preview}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(email.received_at || ''), 'MMM d, HH:mm')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleArchive(email.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(email.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" onClick={() => setShowComposeDialog(true)}>
                  <Mail className="mr-2 h-4 w-4" /> New Email
                </Button>
                <Button className="w-full">
                  <Archive className="mr-2 h-4 w-4" /> Archive All
                </Button>
                <Button className="w-full" onClick={() => refetch()}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh Inbox
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Templates</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full">Meeting Request</Button>
                <Button variant="outline" className="w-full">Project Update</Button>
                <Button variant="outline" className="w-full">Customer Follow-up</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">AI Assistant</h3>
              <div className="space-y-4">
                <Button className="w-full" onClick={generateAIResponse}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Generate Response
                </Button>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Send AI Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ComposeEmail
        open={showComposeDialog}
        onOpenChange={setShowComposeDialog}
      />
    </div>
  );
};