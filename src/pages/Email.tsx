import { useState, useCallback } from "react";
import { 
  Search, Star, Mail, Archive, Trash2, 
  Send, MessageSquare, RefreshCw, MoreVertical 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

export default function EmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      sender: "Anna Andersson",
      subject: "Möte om nya projektet",
      preview: "Hej! Jag ville höra när vi kan boka in ett möte...",
      timestamp: "2024-01-15T10:30:00",
      isStarred: true,
      isRead: false,
    },
    {
      id: 2,
      sender: "Erik Svensson",
      subject: "Kvartalsrapport Q4",
      preview: "Här kommer den senaste kvartalsrapporten...",
      timestamp: "2024-01-15T09:15:00",
      isStarred: false,
      isRead: true,
    },
    {
      id: 3,
      sender: "Maria Larsson",
      subject: "Teambuilding nästa vecka",
      preview: "Vi planerar att ha en teamaktivitet...",
      timestamp: "2024-01-14T16:45:00",
      isStarred: false,
      isRead: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleStar = useCallback((id: number) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id
          ? { ...email, isStarred: !email.isStarred }
          : email
      )
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    toast.success("E-post borttagen");
  }, []);

  const handleArchive = useCallback((id: number) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    toast.success("E-post arkiverad");
  }, []);

  const generateAIResponse = useCallback(() => {
    toast.success("AI-svar genererat", {
      description: "Svaret har kopierats till urklipp",
    });
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Totala e-post</div>
            <div className="text-2xl font-bold">1,254</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Olästa</div>
            <div className="text-2xl font-bold">23</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Skickade idag</div>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Arkiverade</div>
            <div className="text-2xl font-bold">289</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök e-post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Alla e-post" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alla">Alla e-post</SelectItem>
                <SelectItem value="olasta">Olästa</SelectItem>
                <SelectItem value="stjarnmarkerade">Stjärnmärkta</SelectItem>
                <SelectItem value="arkiverade">Arkiverade</SelectItem>
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
                        onClick={() => toggleStar(email.id)}
                      >
                        <Star
                          className={email.isStarred ? "fill-yellow-400" : ""}
                        />
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{email.sender}</span>
                          {!email.isRead && (
                            <Badge variant="secondary">Ny</Badge>
                          )}
                        </div>
                        <div>{email.subject}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {email.preview}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(email.timestamp)}
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
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Snabbåtgärder</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Skriv nytt mail
                </Button>
                <Button className="w-full" variant="outline">
                  <Archive className="mr-2 h-4 w-4" />
                  Arkivera alla
                </Button>
                <Button className="w-full" variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Uppdatera inkorg
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Mallar</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="outline">
                  Mötesbokning
                </Button>
                <Button className="w-full" variant="outline">
                  Projektuppdatering
                </Button>
                <Button className="w-full" variant="outline">
                  Kunduppföljning
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">AI-Assistent</h3>
              <div className="space-y-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={generateAIResponse}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generera svar
                </Button>
                <Button className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Skicka AI-svar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}