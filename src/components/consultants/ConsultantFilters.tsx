import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FilterX, Search, Tag, Brain, MapPin } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ConsultantFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    location: string;
    category: string;
  }) => void;
}

export const ConsultantFilters = ({ onFilterChange }: ConsultantFiltersProps) => {
  const [isFiltersActive, setIsFiltersActive] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status, location, category });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value, location, category });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    onFilterChange({ search, status, location: value, category });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, status, location, category: value });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setLocation("");
    setCategory("all");
    setIsFiltersActive(false);
    onFilterChange({ search: "", status: "", location: "", category: "all" });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
        <TabsList className="w-full justify-start h-auto flex-wrap gap-3 bg-transparent p-1">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
          >
            Alla
            <Badge variant="secondary" className="ml-2">123</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="doctor" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
          >
            Läkare
            <Badge variant="secondary" className="ml-2">45</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="nurse" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
          >
            Sjuksköterska
            <Badge variant="secondary" className="ml-2">38</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="social" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 rounded-full transition-all duration-200"
          >
            Socionom
            <Badge variant="secondary" className="ml-2">40</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök konsult..."
            className="pl-10 h-12"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px] h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="Tillgänglig">Tillgänglig</SelectItem>
              <SelectItem value="Upptagen">Upptagen</SelectItem>
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={handleLocationChange}>
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
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12"
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
    </div>
  );
};