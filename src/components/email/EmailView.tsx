import { ArrowLeft, Star, Archive, Trash2, MoreVertical, Reply, Forward, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isStarred: boolean;
  isRead: boolean;
}

interface EmailViewProps {
  email: Email;
  onBack: () => void;
  onToggleStar: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

export const EmailView = ({
  email,
  onBack,
  onToggleStar,
  onArchive,
  onDelete,
  formatDate,
}: EmailViewProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-semibold">{email.subject}</h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStar(email.id)}
              >
                <Star className={email.isStarred ? "fill-yellow-400" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onArchive(email.id)}
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(email.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email Details */}
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>{email.sender[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{email.sender}</span>
                {!email.isRead && (
                  <Badge variant="secondary">Ny</Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(email.timestamp)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Content */}
          <div className="space-y-4">
            <div className="whitespace-pre-wrap">{email.preview}</div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline">
              <Reply className="mr-2 h-4 w-4" />
              Svara
            </Button>
            <Button variant="outline">
              <Forward className="mr-2 h-4 w-4" />
              Vidarebefordra
            </Button>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              AI Svar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};