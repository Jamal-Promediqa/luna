import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
}

export const EmailFilters = ({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
}: EmailFiltersProps) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Sök e-post..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Alla e-post" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alla">Alla e-post</SelectItem>
          <SelectItem value="olasta">Olästa</SelectItem>
          <SelectItem value="stjarnmarkerade">Stjärnmärkta</SelectItem>
          <SelectItem value="arkiverade">Arkiverade</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};