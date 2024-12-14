import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export const ConsultantHeader = () => {
  return (
    <div className="flex justify-between items-center space-y-0 pb-4">
      <h2 className="text-2xl font-bold">Konsulter</h2>
      <Button className="ml-auto">
        <Download className="mr-2 h-4 w-4" />
        Bakgrundskontroller
      </Button>
    </div>
  );
};