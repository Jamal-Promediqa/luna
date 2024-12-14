import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Tag, Brain } from "lucide-react";

interface FilterSelectsProps {
  status: string;
  location: string;
  onStatusChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export const FilterSelects = ({ 
  status, 
  location, 
  onStatusChange, 
  onLocationChange 
}: FilterSelectsProps) => {
  return (
    <>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] h-12">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla</SelectItem>
          <SelectItem value="Tillgänglig">Tillgänglig</SelectItem>
          <SelectItem value="Upptagen">Upptagen</SelectItem>
        </SelectContent>
      </Select>
      <Select value={location} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[140px] h-12">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <SelectValue placeholder="Plats" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla</SelectItem>
          <SelectItem value="Stockholm">Stockholm</SelectItem>
          <SelectItem value="Göteborg">Göteborg</SelectItem>
          <SelectItem value="Malmö">Malmö</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[140px] h-12">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <SelectValue placeholder="Tags" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alla Tags</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="new">Ny Konsult</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[170px] h-12">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <SelectValue placeholder="Systemkunskap" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Systemkunskap</SelectItem>
          <SelectItem value="take-care">TakeCare</SelectItem>
          <SelectItem value="cosmic">Cosmic</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};