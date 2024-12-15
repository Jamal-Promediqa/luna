import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Archive,
  RefreshCw,
  MessageSquare,
  Send,
} from "lucide-react";
import { EmailLinkAccount } from "../EmailLinkAccount";

interface EmailQuickActionsProps {
  onCompose: () => void;
  onRefresh: () => void;
  onGenerateAIResponse: () => void;
}

export const EmailQuickActions = ({
  onCompose,
  onRefresh,
  onGenerateAIResponse,
}: EmailQuickActionsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full" onClick={onCompose}>
              <Mail className="mr-2 h-4 w-4" /> New Email
            </Button>
            <Button className="w-full">
              <Archive className="mr-2 h-4 w-4" /> Archive All
            </Button>
            <Button className="w-full" onClick={onRefresh}>
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
            <Button className="w-full" onClick={onGenerateAIResponse}>
              <MessageSquare className="mr-2 h-4 w-4" /> Generate Response
            </Button>
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" /> Send AI Response
            </Button>
          </div>
        </CardContent>
      </Card>

      <EmailLinkAccount />
    </div>
  );
};