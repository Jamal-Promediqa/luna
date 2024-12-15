import { Card, CardContent } from "@/components/ui/card";

interface EmailStatsProps {
  stats: {
    total: number;
    unread: number;
    sentToday: number;
    archived: number;
  };
}

export const EmailStats = ({ stats }: EmailStatsProps) => {
  return (
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
  );
};