import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

const notifications = [
  { text: "Ny ansökan från Johan Svensson", time: "10 min sedan", icon: <AlertCircle className="h-4 w-4" /> },
  { text: "Referenstagning klar för Anna Kim", time: "1 timme sedan", icon: <CheckCircle className="h-4 w-4" /> },
  { text: "Påminnelse: Uppföljningsmöte kl 14:00", time: "2 timmar sedan", icon: <Clock className="h-4 w-4" /> }
];

export const Notifications = () => {
  return (
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
  );
};