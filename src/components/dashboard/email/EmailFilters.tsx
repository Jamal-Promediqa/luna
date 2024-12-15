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
  filterValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: string) => void;
}

export const EmailFilters = ({
  searchQuery,
  filterValue,
  onSearchChange,
  onFilterChange,
}: EmailFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search emails..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-9"
        />
      </div>
      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filter emails" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="alla">All emails</SelectItem>
          <SelectItem value="olasta">Unread</SelectItem>
          <SelectItem value="stjarnmarkerade">Starred</SelectItem>
          <SelectItem value="arkiverade">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};