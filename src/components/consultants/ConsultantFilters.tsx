import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

export const ConsultantFilters = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Sök konsult..." className="pl-8" />
      </div>
      <div className="flex gap-4">
        <Select>
          <option>Status</option>
          <option>Tillgänglig</option>
          <option>Upptagen</option>
        </Select>
        <Select>
          <option>Plats</option>
          <option>Stockholm</option>
          <option>Göteborg</option>
          <option>Malmö</option>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};