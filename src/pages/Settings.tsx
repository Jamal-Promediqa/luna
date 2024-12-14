import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Settings Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;