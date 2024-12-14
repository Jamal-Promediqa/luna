import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FilterX, Search } from "lucide-react";

interface ConsultantFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    location: string;
  }) => void;
}

export const ConsultantFilters = ({ onFilterChange }: ConsultantFiltersProps) => {
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status, location });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, location });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({ search, status, location: value });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLocation("");
    setIsFiltersActive(false);
    onFilterChange({ search: "", status: "", location: "" });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök konsult..."
          className="pl-8"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla</SelectItem>
            <SelectItem value="Tillgänglig">Tillgänglig</SelectItem>
            <SelectItem value="Upptagen">Upptagen</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={handleLocationChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Plats" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla</SelectItem>
            <SelectItem value="Stockholm">Stockholm</SelectItem>
            <SelectItem value="Göteborg">Göteborg</SelectItem>
            <SelectItem value="Malmö">Malmö</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={isFiltersActive ? clearFilters : () => setIsFiltersActive(true)}
        >
          {isFiltersActive ? (
            <FilterX className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};