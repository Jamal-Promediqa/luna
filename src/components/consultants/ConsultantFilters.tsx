import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, FilterX } from "lucide-react";
import { FilterTabs } from "./filters/FilterTabs";
import { SearchBar } from "./filters/SearchBar";
import { FilterSelects } from "./filters/FilterSelects";

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
      <FilterTabs onCategoryChange={handleCategoryChange} />

      <div className="flex flex-col md:flex-row gap-6">
        <SearchBar value={search} onChange={handleSearchChange} />
        <div className="flex flex-wrap gap-3">
          <FilterSelects
            status={status}
            location={location}
            onStatusChange={handleStatusChange}
            onLocationChange={handleLocationChange}
          />
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