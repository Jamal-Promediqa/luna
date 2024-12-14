import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Reports Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reports functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;